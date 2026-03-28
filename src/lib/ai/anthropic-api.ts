import type { AIProvider, AIMessage, AIOptions } from "./provider";
import { createThinkTagStreamSanitizer, stripThinkTags } from "./response-cleaning";

type AnthropicMessage = {
  role: "user" | "assistant";
  content: Array<{ type: "text"; text: string }>;
};

function buildAnthropicPayload(messages: AIMessage[], model: string) {
  const systemParts = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content.trim())
    .filter(Boolean);

  const nonSystem = messages.filter((message) => message.role !== "system");
  const normalized: AnthropicMessage[] = [];

  for (const message of nonSystem) {
    const role = message.role === "assistant" ? "assistant" : "user";
    const last = normalized[normalized.length - 1];
    if (last && last.role === role) {
      last.content.push({ type: "text", text: message.content });
      continue;
    }

    normalized.push({
      role,
      content: [{ type: "text", text: message.content }],
    });
  }

  return {
    model,
    max_tokens: 8192,
    ...(systemParts.length > 0 ? { system: systemParts.join("\n\n") } : {}),
    messages: normalized,
  };
}

function getAuthToken() {
  return process.env.ANTHROPIC_AUTH_TOKEN || process.env.ANTHROPIC_API_KEY || "";
}

function getBaseURL() {
  return (process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com").replace(/\/+$/, "");
}

function getHeaders() {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    "x-api-key": token,
    Authorization: `Bearer ${token}`,
    "anthropic-version": "2023-06-01",
  } as Record<string, string>;
}

export class AnthropicAPIProvider implements AIProvider {
  private defaultModel: string;
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    this.defaultModel = process.env.ANTHROPIC_MODEL || process.env.ANTHROPIC_REASONING_MODEL || "claude-sonnet-4-5";
    this.baseURL = getBaseURL();
    this.headers = getHeaders();
  }

  async chat(messages: AIMessage[], options?: AIOptions): Promise<ReadableStream<Uint8Array>> {
    const model = options?.model || this.defaultModel;
    const response = await fetch(`${this.baseURL}/v1/messages`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        ...buildAnthropicPayload(messages, model),
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      const text = await response.text();
      throw new Error(`Anthropic-compatible provider returned ${response.status}: ${text}`);
    }

    const source = response.body.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const sanitizer = createThinkTagStreamSanitizer();
    let buffer = "";

    return new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await source.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const parts = buffer.split("\n\n");
            buffer = parts.pop() || "";

            for (const part of parts) {
              const lines = part.split(/\r?\n/);
              let event = "message";
              const dataLines: string[] = [];

              for (const line of lines) {
                if (line.startsWith("event:")) event = line.slice(6).trim();
                if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
              }

              if (event === "ping") continue;
              const dataText = dataLines.join("\n");
              if (!dataText || dataText === "[DONE]") continue;

              try {
                const payload = JSON.parse(dataText);
                const text =
                  payload.delta?.text ||
                  payload.content_block?.text ||
                  payload.message?.content?.[0]?.text ||
                  "";
                if (text) {
                  const cleaned = sanitizer.push(text);
                  if (cleaned) controller.enqueue(encoder.encode(cleaned));
                }
              } catch {
                // Ignore malformed SSE chunks from provider proxies and keep streaming.
              }
            }
          }

          const remaining = sanitizer.flush();
          if (remaining) controller.enqueue(encoder.encode(remaining));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });
  }

  async generate(messages: AIMessage[], options?: AIOptions): Promise<string> {
    const model = options?.model || this.defaultModel;
    const response = await fetch(`${this.baseURL}/v1/messages`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        ...buildAnthropicPayload(messages, model),
        stream: false,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Anthropic-compatible provider returned ${response.status}: ${text}`);
    }

    const payload = await response.json();
    const text = Array.isArray(payload.content)
      ? payload.content
          .filter((item: { type?: string; text?: string }) => item?.type === "text")
          .map((item: { text?: string }) => item.text || "")
          .join("\n")
      : payload.completion || "";

    return stripThinkTags(text || "");
  }
}
