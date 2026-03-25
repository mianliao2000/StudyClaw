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
import type { ChapterWithSubchapters } from "@/types";

interface ProjectSidebarProps {
  projectTitle: string;
  projectTitleEn?: string;
  chapters: ChapterWithSubchapters[];
  completedItems: string[];
}

export function ProjectSidebar({
  projectTitle,
  projectTitleEn,
  chapters,
  completedItems,
}: ProjectSidebarProps) {
  const params = useParams();
  const pathname = usePathname();
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    chapters.forEach((ch) => {
      map[ch.id] = ch.subchapters.some((s) =>
        pathname.includes(s.id)
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

  const getChapterLabel = (
    chapterTitle: string,
    chapterTitleEn: string | null | undefined,
    chapterIndex: number
  ) => {
    const isSummaryChapter =
      chapterTitle === "课程总结" || chapterTitleEn === "Course Summary";

    if (lang === "en") {
      const baseTitle = chapterTitleEn || chapterTitle;
      return isSummaryChapter ? baseTitle : `Chapter ${chapterIndex + 1}: ${baseTitle}`;
    }

    return isSummaryChapter ? chapterTitle : `第${chapterIndex + 1}章：${chapterTitle}`;
  };

  return (
    <aside className="w-64 shrink-0 border-r border-border/50 bg-sidebar flex flex-col h-full">
      <div className="p-4 border-b">
        <Link href={`/projects/${projectId}`}>
          <h2 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors">
            {lang === "en" && projectTitleEn ? projectTitleEn : projectTitle}
          </h2>
        </Link>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <nav className="p-2">
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapter.id} className="mb-1">
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="flex items-center gap-1 w-full px-2 py-1.5 text-sm font-medium rounded-md hover:bg-accent transition-colors text-left"
              >
                {expanded[chapter.id] ? (
                  <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="line-clamp-2">
                  {getChapterLabel(chapter.title, chapter.titleEn, chapterIndex)}
                </span>
              </button>

              {expanded[chapter.id] && (
                <div className="ml-3 border-l pl-2">
                  {chapter.subchapters.map((sub, subIndex) => (
                    <div key={sub.id} className="mb-0.5">
                      <p className="px-2 py-1 text-xs font-medium text-muted-foreground line-clamp-1">
                        <span className="mr-1.5 text-primary/60 font-mono">
                          {chapterIndex + 1}.{subIndex + 1}
                        </span>
                        {lang === "en" && sub.titleEn ? sub.titleEn : sub.title}
                      </p>
                      <div className="space-y-0.5">
                        {(["main", "summary", "quiz"] as const).map((type) => {
                          const Icon = contentIcons[type];
                          const contentItem = sub.contents.find(
                            (c) => c.contentType === type
                          );
                          const isCompleted =
                            contentItem &&
                            completedItems.includes(contentItem.id);
                          const href = `/projects/${projectId}/chapters/${chapter.id}/subchapters/${sub.id}/${type}`;
                          const isActive = pathname === href;

                          return (
                            <Link
                              key={type}
                              href={href}
                              className={cn(
                                "flex items-center gap-2 px-2 py-1 text-xs rounded-md transition-colors",
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-accent"
                              )}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                              ) : (
                                <Icon className="h-3 w-3" />
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
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
