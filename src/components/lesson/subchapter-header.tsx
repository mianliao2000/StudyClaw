"use client";

import { useLanguage } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/i18n/translations";

const pageTitleKeys: Record<string, TranslationKey> = {
  main: "content.main",
  summary: "content.summary",
  quiz: "content.quiz",
};

interface SubchapterHeaderProps {
  contentType: "main" | "summary" | "quiz";
  chapterTitle: string;
  subchapterTitle: string;
  learningObjective?: string | null;
}

export function SubchapterHeader({
  contentType,
  chapterTitle,
  subchapterTitle,
  learningObjective,
}: SubchapterHeaderProps) {
  const { t } = useLanguage();

  if (contentType === "main") {
    return (
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">{chapterTitle}</p>
        <h1 className="text-xl font-bold">{subchapterTitle}</h1>
        {learningObjective && (
          <p className="text-sm text-muted-foreground mt-1">
            {t("lesson.goal")}: {learningObjective}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <p className="text-sm text-muted-foreground">
        {chapterTitle} / {subchapterTitle}
      </p>
      <h1 className="text-xl font-bold">{t(pageTitleKeys[contentType])}</h1>
    </div>
  );
}
