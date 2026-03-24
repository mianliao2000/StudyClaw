import OpenAI from "openai";
import type { AIProvider, AIMessage } from "./provider";

export class OpenAIAPIProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async chat(messages: AIMessage[]): Promise<ReadableStream<Uint8Array>> {
    const response = await this.client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages,
      stream: true,
    });

    const encoder = new TextEncoder();
    return new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });
  }

  async generate(messages: AIMessage[]): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages,
    });
    return response.choices[0]?.message?.content || "";
  }
}
