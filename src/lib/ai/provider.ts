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

export type ProviderKind =
  | "chatgpt"
  | "openrouter"
  | "minimax"
  | "openai"
  | "anthropic"
  | "auto";

let _provider: AIProvider | null = null;

function hasValue(value?: string) {
  return Boolean(value?.trim());
}

function hasOpenRouterConfig() {
  return (
    hasValue(process.env.OPENROUTER_API_KEY) ||
    hasValue(process.env.OPENROUTER_MODEL_STRONG) ||
    hasValue(process.env.OPENROUTER_MODEL_MEDIUM) ||
    hasValue(process.env.OPENROUTER_MODEL_WEAK) ||
    hasValue(process.env.OPENROUTER_BASE_URL)
  );
}

function hasMiniMaxConfig() {
  return (
    hasValue(process.env.MINIMAX_API_KEY) ||
    hasValue(process.env.MINIMAX_MODEL) ||
    hasValue(process.env.MINIMAX_BASE_URL)
  );
}

function hasOpenAIConfig() {
  return (
    hasValue(process.env.OPENAI_API_KEY) ||
    hasValue(process.env.OPENAI_MODEL) ||
    hasValue(process.env.OPENAI_BASE_URL)
  );
}

function hasAnthropicConfig() {
  return (
    hasValue(process.env.ANTHROPIC_AUTH_TOKEN) ||
    hasValue(process.env.ANTHROPIC_API_KEY) ||
    hasValue(process.env.ANTHROPIC_MODEL) ||
    hasValue(process.env.ANTHROPIC_BASE_URL)
  );
}

function hasChatGPTConfig() {
  return (
    hasValue(process.env.CHATGPT_BRIDGE_SCRIPT) &&
    hasValue(process.env.CHATGPT_MODEL)
  );
}

export function getProviderKind(): ProviderKind {
  if (hasOpenRouterConfig()) return "openrouter";
  if (hasMiniMaxConfig()) return "minimax";
  if (hasOpenAIConfig()) return "openai";
  if (hasAnthropicConfig()) return "anthropic";
  if (hasChatGPTConfig()) return "chatgpt";
  return "auto";
}

export function getDefaultModelForProvider(kind: ProviderKind): string | undefined {
  if (kind === "chatgpt") {
    return process.env.CHATGPT_MODEL || "gpt-5.4-mini";
  }

  if (kind === "openrouter") {
    return (
      process.env.OPENROUTER_MODEL ||
      process.env.OPENROUTER_MODEL_MEDIUM ||
      process.env.OPENROUTER_MODEL_WEAK ||
      process.env.OPENROUTER_MODEL_STRONG ||
      "openai/gpt-4o"
    );
  }

  if (kind === "minimax") {
    return process.env.MINIMAX_MODEL || "MiniMax-M2.5";
  }

  if (kind === "openai") {
    return process.env.OPENAI_MODEL || "gpt-4o";
  }

  if (kind === "anthropic") {
    return process.env.ANTHROPIC_MODEL || process.env.ANTHROPIC_REASONING_MODEL || "claude-sonnet-4-5";
  }

  return undefined;
}

export function getActiveProviderInfo() {
  const kind = getProviderKind();
  return {
    provider: kind,
    defaultModel: getDefaultModelForProvider(kind),
  };
}

export function getAIProvider(): AIProvider {
  if (_provider) return _provider;

  const kind = getProviderKind();

  if (kind === "chatgpt") {
    const { ChatGPTOAuthProvider } = require("./chatgpt-oauth");
    _provider = new ChatGPTOAuthProvider();
    return _provider!;
  }

  if (kind === "anthropic") {
    const { AnthropicAPIProvider } = require("./anthropic-api");
    _provider = new AnthropicAPIProvider();
    return _provider!;
  }

  if (kind === "openrouter" || kind === "minimax" || kind === "openai") {
    const { OpenAIAPIProvider } = require("./openai-api");
    _provider = new OpenAIAPIProvider();
    return _provider!;
  }

  throw new Error(
    "AI provider is not configured. Uncomment exactly one provider block in .env."
  );
}

