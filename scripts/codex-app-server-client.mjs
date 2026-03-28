import { EventEmitter } from "node:events";
import { spawn } from "node:child_process";
import readline from "node:readline";
import { resolveCodexBinary } from "./chatgpt-oauth-common.mjs";

export class CodexAppServerClient {
  constructor(options = {}) {
    this.clientInfo = options.clientInfo || {
      name: "studyclaw",
      version: "0.1.0",
    };
    this.pending = new Map();
    this.events = new EventEmitter();
    this.nextId = 1;
    this.started = false;
    this.stderr = "";
    this.codexBinary = options.codexBinary || resolveCodexBinary();
  }

  async start() {
    if (this.started) {
      return;
    }

    this.child = spawn(this.codexBinary, ["app-server"], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    this.child.stderr.on("data", (chunk) => {
      this.stderr += chunk.toString();
    });

    this.child.on("exit", (code) => {
      const error = new Error(
        `codex app-server exited unexpectedly with code ${code ?? "unknown"}${this.stderr ? `\n${this.stderr}` : ""}`
      );
      for (const { reject } of this.pending.values()) {
        reject(error);
      }
      this.pending.clear();
    });

    const rl = readline.createInterface({ input: this.child.stdout });
    rl.on("line", (line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return;
      }

      let message;
      try {
        message = JSON.parse(trimmed);
      } catch {
        return;
      }

      if (typeof message.id !== "undefined") {
        const pending = this.pending.get(message.id);
        if (!pending) {
          return;
        }
        this.pending.delete(message.id);
        if (message.error) {
          pending.reject(
            new Error(
              message.error.message || JSON.stringify(message.error)
            )
          );
        } else {
          pending.resolve(message.result);
        }
        return;
      }

      if (message.method) {
        this.events.emit(message.method, message.params);
      }
    });

    await this.request("initialize", {
      clientInfo: this.clientInfo,
      capabilities: {
        experimentalApi: true,
      },
    });

    this.started = true;
  }

  request(method, params) {
    const id = this.nextId++;
    const payload = {
      jsonrpc: "2.0",
      id,
      method,
      ...(typeof params !== "undefined" ? { params } : {}),
    };

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.child.stdin.write(`${JSON.stringify(payload)}\n`);
    });
  }

  waitForNotification(method, predicate = () => true, timeoutMs = 300000) {
    return new Promise((resolve, reject) => {
      const onEvent = (params) => {
        try {
          if (!predicate(params)) {
            return;
          }
          cleanup();
          resolve(params);
        } catch (error) {
          cleanup();
          reject(error);
        }
      };

      const timer = setTimeout(() => {
        cleanup();
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeoutMs);

      const cleanup = () => {
        clearTimeout(timer);
        this.events.off(method, onEvent);
      };

      this.events.on(method, onEvent);
    });
  }

  close() {
    if (!this.child || this.child.killed) {
      return;
    }
    try {
      this.child.kill();
    } catch {
      // ignore
    }
  }
}
