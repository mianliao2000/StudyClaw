export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIOptions {
  model?: string;
  reasoning?: "low" | "medium" | "high";
}

export interface AIProvider {
  chat(messages: AIMessage[], options?: AIOptions): Promise<ReadableStream<Uint8Array>>;
  generate(messages: AIMessage[], options?: AIOptions): Promise<string>;
}

let _provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (_provider) return _provider;

  // Prefer the ChatGPT OAuth bridge when both the bridge script and credentials exist.
  if (
    process.env.CHATGPT_BRIDGE_SCRIPT &&
    (process.env.CHATGPT_OAUTH_FILE || process.env.CHATGPT_OAUTH_TOKEN)
  ) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { ChatGPTOAuthProvider } = require("./chatgpt-oauth");
    _provider = new ChatGPTOAuthProvider();
  } else if (
    process.env.OPENROUTER_API_KEY ||
    process.env.MINIMAX_API_KEY ||
    process.env.OPENAI_API_KEY
  ) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { OpenAIAPIProvider } = require("./openai-api");
    _provider = new OpenAIAPIProvider();
  } else {
    throw new Error(
      "AI provider is not configured. Set OPENROUTER_API_KEY, MINIMAX_API_KEY, or OPENAI_API_KEY, or configure CHATGPT_BRIDGE_SCRIPT with CHATGPT_OAUTH_FILE/CHATGPT_OAUTH_TOKEN."
    );
  }

  return _provider!;
}
