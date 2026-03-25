"use client";

import { useLanguage } from "@/lib/i18n";
import { formatChapterLabel, formatSubchapterLabel } from "@/lib/course-labels";
import type { TranslationKey } from "@/lib/i18n/translations";

const pageTitleKeys: Record<string, TranslationKey> = {
  main: "content.main",
  summary: "content.summary",
  quiz: "content.quiz",
};

interface SubchapterHeaderProps {
  contentType: "main" | "summary" | "quiz";
  chapterTitle: string;
  chapterTitleEn?: string | null;
  chapterOrderIndex: number;
  subchapterTitle: string;
  subchapterTitleEn?: string | null;
  subchapterOrderIndex: number;
  learningObjective?: string | null;
}

export function SubchapterHeader({
  contentType,
  chapterTitle,
  chapterTitleEn,
  chapterOrderIndex,
  subchapterTitle,
  subchapterTitleEn,
  subchapterOrderIndex,
  learningObjective,
}: SubchapterHeaderProps) {
  const { t, lang } = useLanguage();
  const displayChapterTitle = formatChapterLabel(
    chapterTitle,
    chapterTitleEn,
    chapterOrderIndex,
    lang
  );
  const displaySubchapterTitle = `${formatSubchapterLabel(
    chapterOrderIndex,
    subchapterOrderIndex
  )} ${lang === "en" && subchapterTitleEn ? subchapterTitleEn : subchapterTitle}`;

  if (contentType === "main") {
    return (
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">{displayChapterTitle}</p>
        <h1 className="text-xl font-bold">{displaySubchapterTitle}</h1>
        {learningObjective && (
          <p className="mt-1 text-sm text-muted-foreground">
            {t("lesson.goal")}: {learningObjective}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <p className="text-sm text-muted-foreground">
        {displayChapterTitle} / {displaySubchapterTitle}
      </p>
      <h1 className="text-xl font-bold">{t(pageTitleKeys[contentType])}</h1>
    </div>
  );
}
