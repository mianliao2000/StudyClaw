import type { ConversationLanguage } from "@/lib/ai/conversation-language";

const NETWORK_ERROR_PATTERNS = [
  /failed to fetch/i,
  /load failed/i,
  /networkerror/i,
  /network request failed/i,
];

const DEFAULT_CHAT_REQUEST_TIMEOUT_MS = 60_000;

function createChatTimeoutError() {
  const error = new Error("Chat request timed out.");
  error.name = "ChatTimeoutError";
  return error;
}

export function isNetworkFetchError(error: unknown) {
  if (error instanceof TypeError) return true;
  if (!(error instanceof Error)) return false;

  return NETWORK_ERROR_PATTERNS.some((pattern) => pattern.test(error.message));
}

export function isChatTimeoutError(error: unknown) {
  return (
    error instanceof Error &&
    (error.name === "ChatTimeoutError" || /timed out/i.test(error.message))
  );
}

export function getFriendlyChatNetworkError(language: ConversationLanguage) {
  return language === "en"
    ? "The request did not reach the server. Please try again in a moment."
    : "请求没有成功到达服务器，请稍后再试。";
}

export function getFriendlyChatTimeoutError(language: ConversationLanguage) {
  return language === "en"
    ? "The AI response took too long. Please try again."
    : "AI 响应超时了，请重试。";
}

export async function postChatRequestWithRetry(
  payload: unknown,
  options?: { endpoint?: string; timeoutMs?: number }
) {
  const endpoint = options?.endpoint ?? "/api/chat";
  const timeoutMs = options?.timeoutMs ?? DEFAULT_CHAT_REQUEST_TIMEOUT_MS;
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (error) {
      lastError =
        error instanceof DOMException && error.name === "AbortError"
          ? createChatTimeoutError()
          : error;

      if (!isNetworkFetchError(error) || attempt === 1) {
        throw lastError;
      }
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  throw lastError ?? new Error("Unknown chat request failure");
}
