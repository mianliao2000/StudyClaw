import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { resolveCodexBinary } from "./chatgpt-oauth-common.mjs";

function extractLastAgentMessage(stdout) {
  let lastMessage = "";

  for (const line of stdout.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    try {
      const event = JSON.parse(trimmed);
      if (
        event?.type === "item.completed" &&
        event?.item?.type === "agent_message" &&
        typeof event.item.text === "string"
      ) {
        lastMessage = event.item.text;
      }
    } catch {
      // Ignore non-JSON lines on stdout.
    }
  }

  return lastMessage.trim();
}

export function buildConversationPrompt(messages) {
  const transcript = (messages || [])
    .map((message, index) => {
      const role = String(message.role || "user").toUpperCase();
      const content = String(message.content || "").trim();
      return [
        `<message index="${index + 1}" role="${role}">`,
        content,
        "</message>",
      ].join("\n");
    })
    .join("\n\n");

  return [
    "You are continuing an in-app conversation for Pandora AI.",
    "This is a pure text response task.",
    "Do not inspect files, run shell commands, or mention tooling.",
    "Treat SYSTEM messages in the transcript as highest priority.",
    "Return only the next assistant message content.",
    "",
    "<conversation>",
    transcript,
    "</conversation>",
  ].join("\n");
}

export async function runCodexExec({
  prompt,
  model,
  cwd = process.cwd(),
  timeoutMs = 300000,
}) {
  const codexBinary = resolveCodexBinary();
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "studyclaw-codex-"));
  const lastMessageFile = path.join(tempDir, "last-message.txt");

  const args = [
    "exec",
    "--json",
    "--ephemeral",
    "--skip-git-repo-check",
    "--sandbox",
    "read-only",
    "--color",
    "never",
    "--output-last-message",
    lastMessageFile,
  ];

  if (model) {
    args.push("--model", model);
  }

  args.push("-");

  return new Promise((resolve, reject) => {
    const child = spawn(codexBinary, args, {
      cwd,
      stdio: ["pipe", "pipe", "pipe"],
      env: process.env,
    });

    let stdout = "";
    let stderr = "";
    let finished = false;

    const finalize = async (error) => {
      if (finished) {
        return;
      }
      finished = true;

      clearTimeout(timer);

      try {
        await rm(tempDir, { recursive: true, force: true });
      } catch {
        // Ignore temp cleanup failures.
      }

      if (error) {
        reject(error);
      }
    };

    const timer = setTimeout(() => {
      try {
        child.kill();
      } catch {
        // Ignore kill failures.
      }
      void finalize(
        new Error(
          `codex exec timed out after ${timeoutMs}ms${stderr ? `\n${stderr}` : ""}`
        )
      );
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      void finalize(error);
    });

    child.on("close", async (code) => {
      let content = "";

      try {
        content = (await readFile(lastMessageFile, "utf8")).trim();
      } catch {
        content = extractLastAgentMessage(stdout);
      }

      if (code !== 0) {
        void finalize(
          new Error(
            [
              `codex exec exited with code ${code ?? "unknown"}`,
              stderr.trim(),
              stdout.trim(),
            ]
              .filter(Boolean)
              .join("\n\n")
          )
        );
        return;
      }

      if (!content) {
        void finalize(
          new Error(
            [
              "codex exec completed without returning a final assistant message",
              stderr.trim(),
              stdout.trim(),
            ]
              .filter(Boolean)
              .join("\n\n")
          )
        );
        return;
      }

      try {
        await rm(tempDir, { recursive: true, force: true });
      } catch {
        // Ignore temp cleanup failures.
      }

      if (finished) {
        return;
      }
      finished = true;
      clearTimeout(timer);
      resolve({
        content,
        stdout,
        stderr,
      });
    });

    child.stdin.write(prompt);
    child.stdin.end();
  });
}
