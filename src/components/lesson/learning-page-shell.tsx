"use client";

import { useEffect, useState } from "react";
import { LearningWorkspace } from "@/components/lesson/learning-workspace";
import { TutoringChat } from "@/components/lesson/tutoring-chat";
import type { ConversationLanguage } from "@/lib/ai/conversation-language";
import type { ChatMessage } from "@/types";

const ASSISTANT_HIDDEN_STORAGE_KEY = "pandora:learning-assistant-hidden";
const ASSISTANT_EXPANDED_STORAGE_KEY = "pandora:learning-assistant-expanded";

function readStoredBoolean(key: string, fallback = false) {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (raw === null) return fallback;
  return raw === "true";
}

interface LearningPageShellProps {
  content: React.ReactNode;
  tutoring: {
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
  };
}

export function LearningPageShell({
  content,
  tutoring,
}: LearningPageShellProps) {
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(() =>
    readStoredBoolean(ASSISTANT_EXPANDED_STORAGE_KEY, false)
  );
  const [isAssistantHidden, setIsAssistantHidden] = useState(() =>
    readStoredBoolean(ASSISTANT_HIDDEN_STORAGE_KEY, false)
  );

  useEffect(() => {
    window.localStorage.setItem(
      ASSISTANT_EXPANDED_STORAGE_KEY,
      String(isAssistantExpanded)
    );
  }, [isAssistantExpanded]);

  useEffect(() => {
    window.localStorage.setItem(
      ASSISTANT_HIDDEN_STORAGE_KEY,
      String(isAssistantHidden)
    );
  }, [isAssistantHidden]);

  return (
    <LearningWorkspace
      content={content}
      isAssistantExpanded={isAssistantExpanded}
      isAssistantHidden={isAssistantHidden}
      onShowAssistant={() => setIsAssistantHidden(false)}
      assistant={
        <TutoringChat
          {...tutoring}
          isExpanded={isAssistantExpanded}
          onToggleExpanded={() =>
            setIsAssistantExpanded((prev) => {
              const next = !prev;
              if (next) {
                setIsAssistantHidden(false);
              }
              return next;
            })
          }
          onHide={() => {
            setIsAssistantExpanded(false);
            setIsAssistantHidden(true);
          }}
        />
      }
    />
  );
}
