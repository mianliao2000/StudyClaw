"use client";

import Link from "next/link";
import { BookOpen, Sparkles, Target, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { GenerateChapterButton } from "@/components/project/generate-chapter-button";
import { useLanguage } from "@/lib/i18n";
import { formatChapterLabel, formatSubchapterLabel } from "@/lib/course-labels";
import type { TranslationKey } from "@/lib/i18n/translations";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ContentItem {
  id: string;
  contentType: string;
  status: string;
}

interface Subchapter {
  id: string;
  slug?: string;
  title: string;
  titleEn?: string | null;
  orderIndex: number;
  contents: ContentItem[];
}

interface Chapter {
  id: string;
  slug?: string;
  title: string;
  titleEn?: string | null;
  orderIndex: number;
  subchapters: Subchapter[];
}

interface CourseOverviewContentProps {
  mode: "project" | "example";
  courseId?: string;
  title: string;
  titleEn?: string | null;
  description: string | null;
  descriptionEn?: string | null;
  chapters: Chapter[];
  progress?: { completionPercent: number } | null;
  goals: string[];
  goalsEn?: string[];
  totalItems: number;
  buildLessonHref: (chapter: Chapter, subchapter: Subchapter) => string;
  reviewHref?: string;
  cta?: React.ReactNode;
}

const badgeKeys: Record<string, TranslationKey> = {
  main: "misc.badgeMain",
  summary: "misc.badgeSummary",
  quiz: "misc.badgeQuiz",
};

export function CourseOverviewContent({
  mode,
  title,
  titleEn,
  description,
  descriptionEn,
  chapters,
  progress = null,
  goals,
  goalsEn,
  totalItems,
  buildLessonHref,
  reviewHref,
  cta,
}: CourseOverviewContentProps) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const displayTitle = lang === "en" && titleEn ? titleEn : title;
  const displayDescription =
    lang === "en" && descriptionEn ? descriptionEn : description;
  const displayGoals = lang === "en" && goalsEn?.length ? goalsEn : goals;
  const isProjectMode = mode === "project";

  function getChapterContentItems(chapter: Chapter) {
    return chapter.subchapters.flatMap((subchapter: Subchapter) => {
      const byType = (type: string) =>
        subchapter.contents.find((content: ContentItem) => content.contentType === type);

      return (["main", "summary", "quiz"] as const)
        .map((type) => byType(type))
        .filter(Boolean)
        .map((content: ContentItem | undefined) => ({
          id: content!.id,
          contentType: content!.contentType,
        }));
    });
  }

  function isChapterPending(chapter: Chapter) {
    const items = chapter.subchapters.flatMap((subchapter: Subchapter) => subchapter.contents);
    return items.length > 0 && items.every((content: ContentItem) => content.status === "pending");
  }

  const firstChapter = chapters[0];
  const firstLessonMain = firstChapter?.subchapters[0]?.contents.find(
    (content: ContentItem) => content.contentType === "main"
  );
  const isInitialLessonGenerating =
    isProjectMode && firstLessonMain?.status === "generating";

  useEffect(() => {
    if (!isInitialLessonGenerating) return;
    const timer = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(timer);
  }, [isInitialLessonGenerating, router]);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="gradient-text text-2xl font-bold">{displayTitle}</h1>
        <p className="mt-1 text-muted-foreground">{displayDescription}</p>
      </div>

      {isInitialLessonGenerating && reviewHref ? (
        <div className="mb-8 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {lang === "en"
                ? "Generating chapter 1 section 1 main content in the background..."
                : "正在后台生成第一章第一节的正文内容，完成后会自动刷新..."}
            </p>
          </div>
          <Link
            href={reviewHref}
            className="ml-4 flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            {lang === "en" ? "Back to review" : "返回确认计划"}
          </Link>
        </div>
      ) : null}

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {isProjectMode ? (
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("project.progress")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {Math.round(progress?.completionPercent || 0)}%
              </div>
              <Progress value={progress?.completionPercent || 0} className="mt-2" />
              <p className="mt-1 text-xs text-muted-foreground">
                {totalItems} {t("project.units")}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                {lang === "en" ? "Official Sample Course" : "官方示例课程"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-6 text-muted-foreground">
                {lang === "en"
                  ? "Browse every lesson now. Add it to My Projects whenever you want saved progress and a persistent AI tutor."
                  : "现在就可以完整浏览全部内容。想保存进度并拥有持久 AI 导师时，再加入“我的项目”。"}
              </p>
              {cta}
            </CardContent>
          </Card>
        )}

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("project.structure")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <div>
                <div className="text-2xl font-bold text-[oklch(0.68_0.18_300)]">
                  {chapters.length}
                </div>
                <p className="text-xs text-muted-foreground">{t("project.chapters")}</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-[oklch(0.72_0.15_60)]">
                  {chapters.reduce(
                    (sum: number, chapter: Chapter) => sum + chapter.subchapters.length,
                    0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{t("project.sections")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {displayGoals.length > 0 && (
        <Card className="mb-8 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-primary" />
              {t("project.goals")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {displayGoals.map((goal, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 font-mono text-xs text-primary/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {goal}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <BookOpen className="h-5 w-5 text-primary" />
          {t("project.toc")}
        </h2>

        {chapters.map((chapter, chapterIndex) => {
          const chapterPending = isChapterPending(chapter);
          const showInlineButton = isProjectMode && chapterPending && chapterIndex > 0;

          return (
            <Card key={chapter.id} className="border-border/50 bg-card/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-base">
                    {formatChapterLabel(
                      chapter.title,
                      chapter.titleEn,
                      chapter.orderIndex,
                      lang
                    )}
                  </CardTitle>

                  {showInlineButton ? (
                    <GenerateChapterButton
                      chapterTitle={chapter.title}
                      contentItems={getChapterContentItems(chapter)}
                      variant="inline"
                    />
                  ) : isProjectMode ? null : (
                    <Badge variant="outline" className="shrink-0">
                      {lang === "en" ? "Ready to study" : "可直接学习"}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-1">
                  {chapter.subchapters.map((subchapter) => (
                    <Link
                      key={subchapter.id}
                      href={buildLessonHref(chapter, subchapter)}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent/50"
                    >
                      <span>
                        <span className="mr-2 font-mono text-xs text-primary/60">
                          {formatSubchapterLabel(
                            chapter.orderIndex,
                            subchapter.orderIndex
                          )}
                        </span>
                        {lang === "en" && subchapter.titleEn
                          ? subchapter.titleEn
                          : subchapter.title}
                      </span>

                      <div className="flex gap-1">
                        {subchapter.contents.map((content) => (
                          <Badge
                            key={content.id}
                            variant={content.status === "ready" ? "default" : "outline"}
                            className="text-[10px]"
                          >
                            {badgeKeys[content.contentType]
                              ? t(badgeKeys[content.contentType])
                              : content.contentType}
                          </Badge>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
