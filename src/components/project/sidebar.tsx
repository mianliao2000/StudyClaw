"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  ListChecks,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { formatChapterLabel, formatSubchapterLabel } from "@/lib/course-labels";
import {
  getQuizScoreIconClass,
  getQuizScoreStateFromPercent,
  getQuizScoreTextClass,
} from "@/lib/quiz-score";
import type { ChapterWithSubchapters } from "@/types";

interface ProjectSidebarProps {
  projectTitle: string;
  projectTitleEn?: string;
  chapters: ChapterWithSubchapters[];
  completedItems: string[];
  quizScores?: Record<string, number>;
}

export function ProjectSidebar({
  projectTitle,
  projectTitleEn,
  chapters,
  completedItems,
  quizScores = {},
}: ProjectSidebarProps) {
  const params = useParams();
  const pathname = usePathname();
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    chapters.forEach((chapter) => {
      map[chapter.id] = chapter.subchapters.some((subchapter) =>
        pathname.includes(subchapter.id)
      );
    });
    if (!Object.values(map).some(Boolean) && chapters.length > 0) {
      map[chapters[0].id] = true;
    }
    return map;
  });

  const projectId = params.projectId as string;

  const toggleChapter = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const contentIcons = {
    main: FileText,
    summary: ListChecks,
    quiz: ClipboardList,
  };

  const contentLabelKeys = {
    main: "sidebar.main" as const,
    summary: "sidebar.summary" as const,
    quiz: "sidebar.quiz" as const,
  };

  function getChapterCompletionStatus(chapter: typeof chapters[number]) {
    const allContentIds = chapter.subchapters.flatMap((sc) =>
      sc.contents.filter((c) => !c.lang || c.lang === "zh").map((c) => c.id)
    );
    if (allContentIds.length === 0) return "none";
    const completedCount = allContentIds.filter((id) =>
      completedItems.includes(id)
    ).length;
    if (completedCount === 0) return "none";
    if (completedCount === allContentIds.length) return "all";
    return "partial";
  }

  const chapterStatusColors = {
    none: "text-foreground",
    partial: "text-amber-500 dark:text-amber-400",
    all: "text-green-600 dark:text-green-400",
  };

  return (
    <aside className="flex h-full w-full min-w-0 flex-col border-r border-border/50 bg-sidebar">
      <div className="border-b p-5">
        <Link href={`/projects/${projectId}`}>
          <h2 className="line-clamp-3 text-base font-bold leading-7 transition-colors hover:text-primary sm:text-lg">
            {lang === "en" && projectTitleEn ? projectTitleEn : projectTitle}
          </h2>
        </Link>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <nav className="p-3">
          {chapters.map((chapter) => {
            const chapterStatus = getChapterCompletionStatus(chapter);

            return (
              <div key={chapter.id} className="mb-2">
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-base font-semibold leading-6 transition-colors hover:bg-accent sm:text-[1.02rem]",
                    chapterStatusColors[chapterStatus]
                  )}
                >
                  {expanded[chapter.id] ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  )}
                  <span className="line-clamp-2">
                    {formatChapterLabel(
                      chapter.title,
                      chapter.titleEn,
                      chapter.orderIndex,
                      lang
                    )}
                  </span>
                </button>

                {expanded[chapter.id] && (
                  <div className="ml-3 border-l pl-3">
                    {chapter.subchapters.map((subchapter) => (
                      <div key={subchapter.id} className="mb-3">
                        <div className="grid grid-cols-[auto,1fr] items-start gap-x-2.5 px-2.5 py-1.5">
                          <span className="pt-0.5 text-xs font-mono text-primary/70 sm:text-[0.82rem]">
                            {formatSubchapterLabel(
                              chapter.orderIndex,
                              subchapter.orderIndex
                            )}
                          </span>
                          <p className="break-words text-sm font-medium leading-6 text-muted-foreground sm:text-[0.95rem]">
                            {lang === "en" && subchapter.titleEn
                              ? subchapter.titleEn
                              : subchapter.title}
                          </p>
                        </div>
                        <div className="space-y-1 pl-1.5">
                          {(["main", "summary", "quiz"] as const).map((type) => {
                            const Icon = contentIcons[type];
                            const contentItem =
                              subchapter.contents.find(
                                (content) => content.contentType === type && content.lang === "zh"
                              ) ??
                              subchapter.contents.find(
                                (content) => content.contentType === type
                              );
                            const isCompleted =
                              contentItem &&
                              completedItems.includes(contentItem.id);
                            const href = `/projects/${projectId}/chapters/${chapter.id}/subchapters/${subchapter.id}/${type}`;
                            const isActive = pathname === href;

                            const qScore =
                              contentItem && type === "quiz"
                                ? quizScores[contentItem.id]
                                : undefined;
                            const quizScoreState =
                              type === "quiz" && qScore !== undefined
                                ? getQuizScoreStateFromPercent(qScore)
                                : null;
                            const completedColor = {
                              text: quizScoreState
                                ? getQuizScoreTextClass(quizScoreState)
                                : "text-green-600 dark:text-green-400",
                              icon: quizScoreState
                                ? getQuizScoreIconClass(quizScoreState)
                                : "text-green-500",
                            };

                            return (
                              <Link
                                key={type}
                                href={href}
                                className={cn(
                                  "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                                  isActive
                                    ? "bg-primary text-primary-foreground"
                                    : isCompleted
                                      ? `${completedColor.text} hover:bg-accent`
                                      : "hover:bg-accent"
                                )}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className={cn("h-3.5 w-3.5", isActive ? "" : completedColor.icon)} />
                                ) : (
                                  <Icon className="h-3.5 w-3.5" />
                                )}
                                {t(contentLabelKeys[type])}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
