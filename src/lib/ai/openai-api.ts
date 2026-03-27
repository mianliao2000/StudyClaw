import OpenAI from "openai";
import type { AIProvider, AIMessage, AIOptions } from "./provider";
import { createThinkTagStreamSanitizer, stripThinkTags } from "./response-cleaning";

export class OpenAIAPIProvider implements AIProvider {
  private client: OpenAI;
  private defaultModel: string;

  constructor() {
    const isOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
    const isMiniMax = Boolean(process.env.MINIMAX_API_KEY);
    const apiKey =
      process.env.OPENROUTER_API_KEY || process.env.MINIMAX_API_KEY || process.env.OPENAI_API_KEY;
    const baseURL =
      process.env.OPENAI_BASE_URL ||
      process.env.OPENROUTER_BASE_URL ||
      process.env.MINIMAX_BASE_URL ||
      (isOpenRouter ? "https://openrouter.ai/api/v1" : undefined) ||
      (isMiniMax ? "https://api.minimax.io/v1" : undefined);
    const defaultHeaders = isOpenRouter
      ? {
          ...(process.env.OPENROUTER_SITE_URL && {
            "HTTP-Referer": process.env.OPENROUTER_SITE_URL,
          }),
          ...(process.env.OPENROUTER_APP_NAME && {
            "X-Title": process.env.OPENROUTER_APP_NAME,
          }),
        }
      : undefined;

    this.defaultModel =
      process.env.OPENROUTER_MODEL ||
      process.env.MINIMAX_MODEL ||
      process.env.OPENAI_MODEL ||
      (isOpenRouter ? "openai/gpt-4o" : undefined) ||
      (isMiniMax ? "MiniMax-M2.5" : "gpt-4o");

    this.client = new OpenAI({
      apiKey,
      baseURL,
      defaultHeaders,
    });
  }

  async chat(messages: AIMessage[], options?: AIOptions): Promise<ReadableStream<Uint8Array>> {
    const model = options?.model || this.defaultModel;
    const response = await this.client.chat.completions.create({
      model,
      messages,
      stream: true,
      ...(options?.reasoning && { reasoning_effort: options.reasoning }),
    });

    const encoder = new TextEncoder();
    const sanitizer = createThinkTagStreamSanitizer();
    return new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            const cleaned = sanitizer.push(text);
            if (cleaned) {
              controller.enqueue(encoder.encode(cleaned));
            }
          }
        }
        const remaining = sanitizer.flush();
        if (remaining) {
          controller.enqueue(encoder.encode(remaining));
        }
        controller.close();
      },
    });
  }

  async generate(messages: AIMessage[], options?: AIOptions): Promise<string> {
    const model = options?.model || this.defaultModel;
    const response = await this.client.chat.completions.create({
      model,
      messages,
      ...(options?.reasoning && { reasoning_effort: options.reasoning }),
    });
    return stripThinkTags(response.choices[0]?.message?.content || "");
  }
}
