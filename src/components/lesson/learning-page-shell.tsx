"use client";

import { useState } from "react";
import { LearningWorkspace } from "@/components/lesson/learning-workspace";
import { TutoringChat } from "@/components/lesson/tutoring-chat";
import type { ConversationLanguage } from "@/lib/ai/conversation-language";
import type { ChatMessage } from "@/types";

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
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false);
  const [isAssistantHidden, setIsAssistantHidden] = useState(false);

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
          onToggleExpanded={() => setIsAssistantExpanded((prev) => !prev)}
          onHide={() => {
            setIsAssistantExpanded(false);
            setIsAssistantHidden(true);
          }}
        />
      }
    />
  );
}
