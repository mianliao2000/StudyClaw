"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import {
  detectConversationLanguage,
  type ConversationLanguage,
} from "@/lib/ai/conversation-language";
import type { ChatMessage } from "@/types";

interface TutoringChatProps {
  threadId?: string;
  projectId: string;
  chapterId: string;
  subchapterId: string;
  projectTitle: string;
  chapterTitle: string;
  subchapterTitle: string;
  learningObjective: string;
  lessonContent: string;
  initialMessages: ChatMessage[];
  conversationLanguage?: ConversationLanguage | null;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const CHAT_HISTORY_STORAGE_PREFIX = "studyclaw:tutoring-history:";

function serializeMessages(messages: ChatMessage[]) {
  return JSON.stringify(
    messages.map((message) => ({
      ...message,
      createdAt: message.createdAt.toISOString(),
    }))
  );
}

function deserializeMessages(raw: string): ChatMessage[] {
  try {
    const parsed = JSON.parse(raw) as Array<{
      id: string;
      role: "user" | "assistant" | "system";
      content: string;
      createdAt: string;
    }>;

    return parsed.map((message) => ({
      ...message,
      createdAt: new Date(message.createdAt),
    }));
  } catch {
    return [];
  }
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

function getTutorTitle(language: ConversationLanguage) {
  return language === "en" ? "AI Tutor" : "AI 辅导助手";
}

function getTutorSubtitle(language: ConversationLanguage) {
  return language === "en"
    ? "Ask me anything about this lesson"
    : "关于本节内容有任何问题都可以问我";
}

function getTutorExpandLabel(isExpanded: boolean, language: ConversationLanguage) {
  if (language === "en") {
    return isExpanded ? "Restore lesson layout" : "Expand AI assistant";
  }

  return isExpanded ? "恢复课程布局" : "展开 AI 辅导助手";
}

export function TutoringChat({
  threadId,
  projectId,
  chapterId,
  subchapterId,
  projectTitle,
  chapterTitle,
  subchapterTitle,
  learningObjective,
  lessonContent,
  initialMessages,
  conversationLanguage,
  isExpanded,
  onToggleExpanded,
}: TutoringChatProps) {
  const { lang } = useLanguage();
  const fallbackLanguage = (lang === "en" ? "en" : "zh") as ConversationLanguage;
  const [threadLanguage, setThreadLanguage] = useState<ConversationLanguage | null>(
    conversationLanguage ?? null
  );
  const storageKey = useMemo(
    () => `${CHAT_HISTORY_STORAGE_PREFIX}${projectId}:${chapterId}:${subchapterId}`,
    [projectId, chapterId, subchapterId]
  );
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setThreadLanguage(conversationLanguage ?? null);
  }, [conversationLanguage]);

  useEffect(() => {
    const cachedMessages = window.localStorage.getItem(storageKey);
    if (cachedMessages) {
      const restoredMessages = deserializeMessages(cachedMessages);
      if (restoredMessages.length > 0) {
        setVisibleMessages(restoredMessages);
        return;
      }
    }

    setVisibleMessages(initialMessages);
  }, [initialMessages, storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, serializeMessages(visibleMessages));
  }, [storageKey, visibleMessages]);

  const activeLanguage = threadLanguage ?? fallbackLanguage;

  const handleSend = useCallback(
    async (text: string) => {
      if (!threadId) return;

      const resolvedLanguage = threadLanguage ?? detectConversationLanguage(text);
      setThreadLanguage((prev) => prev ?? resolvedLanguage);

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        createdAt: new Date(),
      };
      setVisibleMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            threadId,
            message: text,
            mode: "tutoring",
            context: {
              projectTitle,
              chapterTitle,
              subchapterTitle,
              learningObjective,
              lessonContent: lessonContent.slice(0, 4000),
            },
          }),
        });

        if (!res.ok) {
          let errorMessage = getTutorFallbackMessage(resolvedLanguage);
          try {
            const data = (await res.json()) as { error?: string };
            if (data.error) errorMessage = data.error;
          } catch {
            // Ignore malformed error responses and keep the fallback message.
          }
          throw new Error(errorMessage);
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        const assistantId = crypto.randomUUID();

        setVisibleMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "", createdAt: new Date() },
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
      } catch (error) {
        setVisibleMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              error instanceof Error && error.message
                ? error.message
                : getTutorFallbackMessage(resolvedLanguage),
            createdAt: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      chapterTitle,
      learningObjective,
      lessonContent,
      projectTitle,
      subchapterTitle,
      threadId,
      threadLanguage,
    ]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold">{getTutorTitle(activeLanguage)}</h3>
          <p className="text-xs text-muted-foreground">
            {getTutorSubtitle(activeLanguage)}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={onToggleExpanded}
          aria-label={getTutorExpandLabel(isExpanded, activeLanguage)}
        >
          {isExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ChatPanel
        messages={visibleMessages}
        onSend={handleSend}
        isLoading={isLoading}
        placeholder={
          activeLanguage === "en" ? "Ask a question..." : "问个问题..."
        }
        suggestions={getTutorSuggestions(activeLanguage)}
        className="flex-1"
      />
    </div>
  );
}
