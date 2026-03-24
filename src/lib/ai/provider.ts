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

  // 优先使用 ChatGPT OAuth 桥接（需要桥脚本 + 凭证）
  if (
    process.env.CHATGPT_BRIDGE_SCRIPT &&
    (process.env.CHATGPT_OAUTH_FILE || process.env.CHATGPT_OAUTH_TOKEN)
  ) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { ChatGPTOAuthProvider } = require("./chatgpt-oauth");
    _provider = new ChatGPTOAuthProvider();
  } else if (process.env.OPENAI_API_KEY) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { OpenAIAPIProvider } = require("./openai-api");
    _provider = new OpenAIAPIProvider();
  } else {
    throw new Error(
      "未配置 AI 服务。请设置 OPENAI_API_KEY，或同时设置 CHATGPT_BRIDGE_SCRIPT 与 CHATGPT_OAUTH_FILE/CHATGPT_OAUTH_TOKEN。"
    );
  }

  return _provider!;
}
