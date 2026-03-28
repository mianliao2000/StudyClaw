import { readFileSync } from "node:fs";
import { buildConversationPrompt, runCodexExec } from "./codex-exec-common.mjs";
import { DEFAULT_MODEL } from "./chatgpt-oauth-common.mjs";

async function readPayload() {
  const raw = readFileSync(0, "utf8").trim();
  if (!raw) {
    throw new Error("Bridge received no input.");
  }
  return JSON.parse(raw);
}

async function main() {
  const payload = await readPayload();
  const model = payload.model || process.env.CHATGPT_MODEL || DEFAULT_MODEL;
  const prompt = buildConversationPrompt(payload.messages || []);

  const result = await runCodexExec({
    prompt,
    model,
    cwd: process.cwd(),
  });

  process.stdout.write(
    JSON.stringify({
      provider: "chatgpt-codex",
      model,
      content: result.content.trim(),
    })
  );
}

main().catch((error) => {
  process.stdout.write(
    JSON.stringify({
      error_message: error instanceof Error ? error.message : String(error),
    })
  );
  process.exit(1);
});
