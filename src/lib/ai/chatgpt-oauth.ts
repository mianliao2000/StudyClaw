import { spawn } from "child_process";
import { existsSync } from "fs";
import path from "path";
import type { AIMessage, AIOptions, AIProvider } from "./provider";
import { stripThinkTags } from "./response-cleaning";

const BRIDGE_SCRIPT = process.env.CHATGPT_BRIDGE_SCRIPT
  ? path.resolve(
      /* turbopackIgnore: true */ process.cwd(),
      process.env.CHATGPT_BRIDGE_SCRIPT
    )
  : path.join(process.cwd(), "scripts", "chatgpt-oauth-bridge.mjs");

const MODEL = process.env.CHATGPT_MODEL || "gpt-5.4-mini";

export class ChatGPTOAuthProvider implements AIProvider {
  private async callBridge(
    messages: AIMessage[],
    options?: AIOptions
  ): Promise<string> {
    if (!existsSync(BRIDGE_SCRIPT)) {
      throw new Error(
        `ChatGPT bridge script not found at ${BRIDGE_SCRIPT}. Set CHATGPT_BRIDGE_SCRIPT to a valid local bridge.`
      );
    }

    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({
        model: options?.model || MODEL,
        messages,
        session_id: "studyclaw-chatgpt",
        ...(options?.reasoning && { reasoning_effort: options.reasoning }),
      });

      const child = spawn("node", [BRIDGE_SCRIPT], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });

      child.on("close", (code) => {
        if (code !== 0) {
          reject(
            new Error(
              [
                `ChatGPT bridge exited with code ${code ?? "unknown"}`,
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
          const result = JSON.parse(stdout.trim());
          if (result.error_message) {
            reject(new Error(result.error_message));
            return;
          }

          resolve(stripThinkTags(result.content || ""));
        } catch {
          reject(new Error(`Bridge output parse error: ${stdout}`));
        }
      });

      child.stdin.write(payload);
      child.stdin.end();
    });
  }

  async chat(
    messages: AIMessage[],
    options?: AIOptions
  ): Promise<ReadableStream<Uint8Array>> {
    const fullText = await this.callBridge(messages, options);
    const encoder = new TextEncoder();

    return new ReadableStream({
      start(controller) {
        const chunkSize = 10;
        let index = 0;
        const interval = setInterval(() => {
          if (index >= fullText.length) {
            clearInterval(interval);
            controller.close();
            return;
          }

          controller.enqueue(
            encoder.encode(fullText.slice(index, index + chunkSize))
          );
          index += chunkSize;
        }, 10);
      },
    });
  }

  async generate(messages: AIMessage[], options?: AIOptions): Promise<string> {
    return this.callBridge(messages, options);
  }
}
