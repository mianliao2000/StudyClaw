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
  learningObjectiveEn?: string | null;
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
  learningObjectiveEn,
}: SubchapterHeaderProps) {
  const { t, lang } = useLanguage();
  const pageTypeLabel = t(pageTitleKeys[contentType]);
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

  return (
    <div className="mb-6">
      <p className="text-base font-semibold text-muted-foreground sm:text-lg">
        {displayChapterTitle}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {displaySubchapterTitle}
      </h1>
      <p className="mt-2 text-sm font-semibold text-primary sm:text-base">
        {pageTypeLabel}
      </p>
      {contentType === "main" && (learningObjective || learningObjectiveEn) && (
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          {t("lesson.goal")}:{" "}
          {lang === "en" && learningObjectiveEn ? learningObjectiveEn : learningObjective}
        </p>
      )}
    </div>
  );
}
