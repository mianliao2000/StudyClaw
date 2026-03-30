import type { ConversationLanguage } from "@/lib/ai/conversation-language";

const NETWORK_ERROR_PATTERNS = [
  /failed to fetch/i,
  /load failed/i,
  /networkerror/i,
  /network request failed/i,
];

export function isNetworkFetchError(error: unknown) {
  if (error instanceof TypeError) return true;
  if (!(error instanceof Error)) return false;

  return NETWORK_ERROR_PATTERNS.some((pattern) => pattern.test(error.message));
}

export function getFriendlyChatNetworkError(language: ConversationLanguage) {
  return language === "en"
    ? "The request did not reach the server. Please try again in a moment."
    : "请求没有成功到达服务器，请稍后再试。";
}

export async function postChatRequestWithRetry(
  payload: unknown,
  options?: { endpoint?: string }
) {
  const endpoint = options?.endpoint ?? "/api/chat";
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      lastError = error;
      if (!isNetworkFetchError(error) || attempt === 1) {
        throw error;
      }
    }
  }

  throw lastError ?? new Error("Unknown chat request failure");
}
