"use client";

import { ExampleTutoringChat } from "@/components/example/example-tutoring-chat";
import { LearningPageShell } from "@/components/lesson/learning-page-shell";
import type { ContentType } from "@/types";

interface ExampleLearningPageShellProps {
  content: React.ReactNode;
  tutor: {
    courseSlug: string;
    chapterSlug: string;
    subchapterSlug: string;
    lessonType: ContentType;
    projectTitle: string;
    chapterTitle: string;
    subchapterTitle: string;
    learningObjective: string;
    lessonContent: string;
  };
}

export function ExampleLearningPageShell({
  content,
  tutor,
}: ExampleLearningPageShellProps) {
  return (
    <LearningPageShell
      content={content}
      assistant={({ isExpanded, onToggleExpanded, onHide }) => (
        <ExampleTutoringChat
          {...tutor}
          isExpanded={isExpanded}
          onToggleExpanded={onToggleExpanded}
          onHide={onHide}
        />
      )}
    />
  );
}
