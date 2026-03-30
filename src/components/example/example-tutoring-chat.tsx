"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Maximize2, Minimize2, PanelRightClose, Trash2 } from "lucide-react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { Button } from "@/components/ui/button";
import {
  detectConversationLanguage,
  type ConversationLanguage,
} from "@/lib/ai/conversation-language";
import {
  getFriendlyChatNetworkError,
  isNetworkFetchError,
  postChatRequestWithRetry,
} from "@/lib/chat-request";
import { useLanguage } from "@/lib/i18n";
import type { ChatMessage, ContentType } from "@/types";

interface ExampleTutoringChatProps {
  courseSlug: string;
  chapterSlug: string;
  subchapterSlug: string;
  lessonType: ContentType;
  projectTitle: string;
  chapterTitle: string;
  subchapterTitle: string;
  learningObjective: string;
  lessonContent: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onHide: () => void;
}

function getTutorFallbackMessage(language: ConversationLanguage) {
  return language === "en"
    ? "Sorry, unable to answer right now. Please try again."
    : "抱歉，暂时无法回答，请稍后重试。";
}

function getTutorSuggestions(language: ConversationLanguage) {
  return language === "en"
    ? ["Explain simply", "Give an example", "Quiz me"]
    : ["用简单的话解释一下", "给我一个例子", "考考我"];
}

function getTutorExpandLabel(
  isExpanded: boolean,
  language: ConversationLanguage
) {
  if (language === "en") {
    return isExpanded ? "Restore lesson layout" : "Expand AI assistant";
  }

  return isExpanded ? "恢复课程布局" : "展开 AI 辅导助手";
}

function getTutorHideLabel(language: ConversationLanguage) {
  return language === "en" ? "Hide AI assistant" : "隐藏 AI 辅导助手";
}

function getTutorClearLabel(language: ConversationLanguage) {
  return language === "en" ? "Clear chat history" : "清空聊天记录";
}

export function ExampleTutoringChat({
  courseSlug,
  chapterSlug,
  subchapterSlug,
  lessonType,
  projectTitle,
  chapterTitle,
  subchapterTitle,
  learningObjective,
  lessonContent,
  isExpanded,
  onToggleExpanded,
  onHide,
}: ExampleTutoringChatProps) {
  const { lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const fallbackLanguage = (lang === "en" ? "en" : "zh") as ConversationLanguage;
  const [threadLanguage, setThreadLanguage] = useState<ConversationLanguage | null>(null);
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setVisibleMessages([]);
    setThreadLanguage(null);
    setIsLoading(false);
  }, [courseSlug, chapterSlug, subchapterSlug, lessonType]);

  const activeLanguage = threadLanguage ?? fallbackLanguage;
  const loginHref = useMemo(() => {
    const query = searchParams.toString();
    const nextPath = query ? `${pathname}?${query}` : pathname;
    return `/login?next=${encodeURIComponent(nextPath)}`;
  }, [pathname, searchParams]);

  const handleClearHistory = useCallback(() => {
    setVisibleMessages([]);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      if (!session?.user) {
        router.push(loginHref);
        return;
      }

      const resolvedLanguage = threadLanguage ?? detectConversationLanguage(text);
      setThreadLanguage((prev) => prev ?? resolvedLanguage);

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        createdAt: new Date(),
      };

      const history = visibleMessages
        .filter((message) => message.role === "user" || message.role === "assistant")
        .slice(-8)
        .map((message) => ({
          role: message.role,
          content: message.content,
        }));

      setVisibleMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await postChatRequestWithRetry(
          {
            courseSlug,
            chapterSlug,
            subchapterSlug,
            lessonType,
            message: text,
            history,
            context: {
              projectTitle,
              chapterTitle,
              subchapterTitle,
              learningObjective,
              lessonContent: lessonContent.slice(0, 4000),
            },
          },
          { endpoint: "/api/examples/chat" }
        );

        if (!response.ok) {
          let errorMessage = getTutorFallbackMessage(resolvedLanguage);
          try {
            const data = (await response.json()) as { error?: string };
            if (data.error) errorMessage = data.error;
          } catch {
            // Keep the localized fallback.
          }

          if (response.status === 401) {
            router.push(loginHref);
            return;
          }

          throw new Error(errorMessage);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error(getTutorFallbackMessage(resolvedLanguage));
        }

        const decoder = new TextDecoder();
        const assistantId = crypto.randomUUID();
        let fullText = "";

        setVisibleMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content: "",
            createdAt: new Date(),
          },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value);
          setVisibleMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? { ...message, content: fullText }
                : message
            )
          );
        }
      } catch (caughtError) {
        setVisibleMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: isNetworkFetchError(caughtError)
              ? getFriendlyChatNetworkError(resolvedLanguage)
              : caughtError instanceof Error && caughtError.message
                ? caughtError.message
                : getTutorFallbackMessage(resolvedLanguage),
            createdAt: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      chapterSlug,
      chapterTitle,
      courseSlug,
      learningObjective,
      lessonContent,
      lessonType,
      loginHref,
      projectTitle,
      router,
      session?.user,
      subchapterSlug,
      subchapterTitle,
      threadLanguage,
      visibleMessages,
    ]
  );

  const footerSlot =
    status === "loading" ? (
      <div className="flex min-h-9 items-center px-2 text-sm text-muted-foreground">
        {lang === "en" ? "Checking your session..." : "正在检查你的会话状态..."}
      </div>
    ) : !session?.user ? (
      <div className="flex min-h-9 flex-col gap-2 px-2 py-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {lang === "en"
            ? "Sign in or try guest mode to chat with the AI tutor."
            : "登录或游客试用后，即可和 AI 导师继续对话。"}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.push(loginHref)}
          className="shrink-0"
        >
          {lang === "en" ? "Log In or Try Guest" : "登录或游客试用"}
        </Button>
      </div>
    ) : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <ChatPanel
        messages={visibleMessages}
        onSend={handleSend}
        isLoading={isLoading}
        placeholder={activeLanguage === "en" ? "Ask a question..." : "问个问题..."}
        suggestions={session?.user ? getTutorSuggestions(activeLanguage) : undefined}
        className="flex-1 min-h-0"
        wideLayout={isExpanded}
        footerSlot={footerSlot}
        hideComposer={!session?.user}
        headerSlot={
          <div className="flex shrink-0 items-center gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={handleClearHistory}
              aria-label={getTutorClearLabel(activeLanguage)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={onToggleExpanded}
              aria-label={getTutorExpandLabel(isExpanded, activeLanguage)}
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={onHide}
              aria-label={getTutorHideLabel(activeLanguage)}
            >
              <PanelRightClose className="h-4 w-4" />
            </Button>
          </div>
        }
      />
    </div>
  );
}
