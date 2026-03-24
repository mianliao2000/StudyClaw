"use client";

import Link from "next/link";
import { BookOpen, Target, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { GenerateChapterButton } from "@/components/project/generate-chapter-button";
import { useLanguage } from "@/lib/i18n";
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
  title: string;
  titleEn?: string | null;
  contents: ContentItem[];
}

interface Chapter {
  id: string;
  title: string;
  titleEn?: string | null;
  subchapters: Subchapter[];
}

interface ProjectOverviewContentProps {
  projectId: string;
  title: string;
  titleEn?: string | null;
  description: string | null;
  descriptionEn?: string | null;
  chapters: Chapter[];
  progress: { completionPercent: number } | null;
  goals: string[];
  goalsEn?: string[];
  totalItems: number;
}

const badgeKeys: Record<string, TranslationKey> = {
  main: "misc.badgeMain",
  summary: "misc.badgeSummary",
  quiz: "misc.badgeQuiz",
};

export function ProjectOverviewContent({
  projectId,
  title,
  titleEn,
  description,
  descriptionEn,
  chapters,
  progress,
  goals,
  goalsEn,
  totalItems,
}: ProjectOverviewContentProps) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const displayTitle = lang === "en" && titleEn ? titleEn : title;
  const displayDescription = lang === "en" && descriptionEn ? descriptionEn : description;
  const displayGoals = lang === "en" && goalsEn?.length ? goalsEn : goals;

  function getChapterContentItems(ch: Chapter) {
    return ch.subchapters.flatMap((sub: Subchapter) => {
      const byType = (type: string) =>
        sub.contents.find((c: ContentItem) => c.contentType === type);
      return (["main", "summary", "quiz"] as const)
        .map((type) => byType(type))
        .filter(Boolean)
        .map((c: ContentItem | undefined) => ({ id: c!.id, contentType: c!.contentType }));
    });
  }

  function isChapterPending(ch: Chapter) {
    const items = ch.subchapters.flatMap((s: Subchapter) => s.contents);
    return items.length > 0 && items.every((c: ContentItem) => c.status === "pending");
  }

  function isChapterGenerating(ch: Chapter) {
    const items = ch.subchapters.flatMap((s: Subchapter) => s.contents);
    return items.some(
      (c: ContentItem) => c.status === "pending" || c.status === "generating"
    );
  }

  const firstChapter = chapters[0];
  const isFirstChapterGenerating = firstChapter && isChapterGenerating(firstChapter);

  // Auto-refresh every 5s when chapter 1 content is being generated
  useEffect(() => {
    if (!isFirstChapterGenerating) return;
    const timer = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(timer);
  }, [isFirstChapterGenerating, router]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold gradient-text">{displayTitle}</h1>
        <p className="text-muted-foreground mt-1">{displayDescription}</p>
      </div>

      {isFirstChapterGenerating && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
            <p className="text-sm text-muted-foreground">
              {lang === "en"
                ? "Generating chapter 1 content in the background..."
                : "正在后台生成第一章内容，完成后自动更新..."}
            </p>
          </div>
          <Link
            href={`/projects/${projectId}/plan`}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-4"
          >
            <ArrowLeft className="h-3 w-3" />
            {lang === "en" ? "Back to plan" : "返回规划"}
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
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
            <p className="text-xs text-muted-foreground mt-1">
              {totalItems} {t("project.units")}
            </p>
          </CardContent>
        </Card>

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
                    (sum: number, ch: Chapter) => sum + ch.subchapters.length,
                    0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{t("project.sections")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {goals.length > 0 && (
        <Card className="mb-8 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              {t("project.goals")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {displayGoals.map((g, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-primary/60 font-mono text-xs mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {g}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          {t("project.toc")}
        </h2>
        {chapters.map((ch, chIdx) => {
          const chapterPending = isChapterPending(ch);
          const showInlineButton = chapterPending && chIdx > 0; // ch1 auto-generates

          return (
            <Card key={ch.id} className="border-border/50 bg-card/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{lang === "en" && ch.titleEn ? ch.titleEn : ch.title}</CardTitle>
                  {showInlineButton && (
                    <GenerateChapterButton
                      chapterTitle={ch.title}
                      contentItems={getChapterContentItems(ch)}
                      variant="inline"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {ch.subchapters.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/projects/${projectId}/chapters/${ch.id}/subchapters/${sub.id}/main`}
                      className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent/50 transition-colors text-sm"
                    >
                      <span>{lang === "en" && sub.titleEn ? sub.titleEn : sub.title}</span>
                      <div className="flex gap-1">
                        {sub.contents.map((c) => (
                          <Badge
                            key={c.id}
                            variant={c.status === "ready" ? "default" : "outline"}
                            className="text-[10px]"
                          >
                            {badgeKeys[c.contentType] ? t(badgeKeys[c.contentType]) : c.contentType}
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
