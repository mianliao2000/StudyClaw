"use client";

import { useState, useCallback } from "react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { useLanguage } from "@/lib/i18n";
import type { ChatMessage } from "@/types";

interface TutoringChatProps {
  threadId?: string;
  projectTitle: string;
  chapterTitle: string;
  subchapterTitle: string;
  learningObjective: string;
  lessonContent: string;
  initialMessages: ChatMessage[];
}

export function TutoringChat({
  threadId,
  projectTitle,
  chapterTitle,
  subchapterTitle,
  learningObjective,
  lessonContent,
  initialMessages,
}: TutoringChatProps) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = useCallback(
    async (text: string) => {
      if (!threadId) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
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
          let errorMessage = t("tutor.error");
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

        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "", createdAt: new Date() },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: fullText } : m
            )
          );
        }
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              error instanceof Error && error.message
                ? error.message
                : t("tutor.error"),
            createdAt: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [threadId, projectTitle, chapterTitle, subchapterTitle, learningObjective, lessonContent, t]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b">
        <h3 className="text-sm font-semibold">{t("tutor.title")}</h3>
        <p className="text-xs text-muted-foreground">
          {t("tutor.subtitle")}
        </p>
      </div>
      <ChatPanel
        messages={messages}
        onSend={handleSend}
        isLoading={isLoading}
        placeholder={t("tutor.placeholder")}
        suggestions={[t("tutor.explain"), t("tutor.example"), t("tutor.quizMe")]}
        className="flex-1"
      />
    </div>
  );
}
