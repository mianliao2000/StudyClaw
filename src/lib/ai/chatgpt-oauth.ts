import { spawn } from "child_process";
import type { AIProvider, AIMessage, AIOptions } from "./provider";

const BRIDGE_SCRIPT = process.env.CHATGPT_BRIDGE_SCRIPT;

const AUTH_FILE = process.env.CHATGPT_OAUTH_FILE;
const AUTH_TOKEN = process.env.CHATGPT_OAUTH_TOKEN;

const MODEL = process.env.CHATGPT_MODEL || "gpt-4o";

/**
 * ChatGPT OAuth 桥接实现
 * 通过调用 chatgpt_oauth_bridge.mjs 子进程与 ChatGPT Codex 后端通信
 */
export class ChatGPTOAuthProvider implements AIProvider {
  private async callBridge(messages: AIMessage[], options?: AIOptions): Promise<string> {
    if (!BRIDGE_SCRIPT) {
      throw new Error("CHATGPT_BRIDGE_SCRIPT is required when using the ChatGPT OAuth provider.");
    }

    if (!AUTH_FILE && !AUTH_TOKEN) {
      throw new Error(
        "Set CHATGPT_OAUTH_FILE or CHATGPT_OAUTH_TOKEN when using the ChatGPT OAuth provider."
      );
    }

    return new Promise((resolve, reject) => {
      const model = options?.model || MODEL;
      const payload = JSON.stringify({
        ...(AUTH_FILE && { auth_file: AUTH_FILE }),
        ...(AUTH_TOKEN && { auth_token: AUTH_TOKEN }),
        model,
        messages,
        session_id: "diy-learn-web",
        ...(options?.reasoning && { reasoning_effort: options.reasoning }),
      });

      const child = spawn("node", [BRIDGE_SCRIPT], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (d) => (stdout += d.toString()));
      child.stderr.on("data", (d) => (stderr += d.toString()));

      child.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Bridge exited ${code}: ${stderr}`));
          return;
        }
        try {
          const result = JSON.parse(stdout.trim());
          if (result.error_message) {
            reject(new Error(result.error_message));
          } else {
            resolve(result.content || "");
          }
        } catch {
          reject(new Error(`Bridge output parse error: ${stdout}`));
        }
      });

      child.stdin.write(payload);
      child.stdin.end();
    });
  }

  async chat(messages: AIMessage[], options?: AIOptions): Promise<ReadableStream<Uint8Array>> {
    // 桥接是非流式的，调用完成后模拟流式输出
    const fullText = await this.callBridge(messages, options);
    const encoder = new TextEncoder();

    return new ReadableStream({
      start(controller) {
        // 分块发送，模拟流式效果
        const chunkSize = 10;
        let i = 0;
        const interval = setInterval(() => {
          if (i >= fullText.length) {
            clearInterval(interval);
            controller.close();
            return;
          }
          controller.enqueue(encoder.encode(fullText.slice(i, i + chunkSize)));
          i += chunkSize;
        }, 10);
      },
    });
  }

  async generate(messages: AIMessage[], options?: AIOptions): Promise<string> {
    return this.callBridge(messages, options);
  }
}
