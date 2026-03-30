"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Sparkles, Target } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type ReviewSubchapter = {
  id: string;
  title: string;
  titleEn?: string | null;
  learningObjective?: string | null;
  learningObjectiveEn?: string | null;
};

type ReviewChapter = {
  id: string;
  title: string;
  titleEn?: string | null;
  subchapters: ReviewSubchapter[];
};

interface PlanReviewContentProps {
  projectId: string;
  title: string;
  titleEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  goals: string[];
  goalsEn?: string[];
  chapters: ReviewChapter[];
}

export function PlanReviewContent({
  projectId,
  title,
  titleEn,
  description,
  descriptionEn,
  goals,
  goalsEn,
  chapters,
}: PlanReviewContentProps) {
  const { lang } = useLanguage();
  const [isConfirming, setIsConfirming] = useState(false);

  const displayTitle = lang === "en" && titleEn ? titleEn : title;
  const displayDescription = lang === "en" && descriptionEn ? descriptionEn : description;
  const displayGoals = lang === "en" && goalsEn?.length ? goalsEn : goals;

  const handleConfirm = async () => {
    if (isConfirming) return;
    setIsConfirming(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/confirm`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to confirm plan");
      }

      const data = (await res.json()) as { redirectTo?: string };
      // Use a hard navigation to avoid extension-mutated DOM breaking
      // client-side route transitions during this confirmation step.
      window.location.assign(data.redirectTo || `/projects/${projectId}`);
    } catch (error) {
      console.error(error);
      setIsConfirming(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8">
      <div className="rounded-3xl border border-border/50 bg-gradient-to-br from-background via-background to-emerald-50/60 p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 shadow-none hover:bg-emerald-100">
              {lang === "en" ? "Review Plan" : "确认计划"}
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">{displayTitle}</h1>
              {displayDescription && (
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                  {displayDescription}
                </p>
              )}
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              {lang === "en"
                ? "Review the chapter structure first. Content generation will not start until you confirm the plan."
                : "先确认课程结构。点击“确认计划”之前，不会开始生成课程正文内容。"}
            </p>
          </div>

          <div className="flex flex-col gap-3 md:min-w-52">
            <Button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="h-11 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {lang === "en" ? "Opening course..." : "正在进入课程..."}
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {lang === "en" ? "Confirm Plan" : "确认计划"}
                </>
              )}
            </Button>

            <Link
              href={`/projects/${projectId}/plan?revise=1`}
              className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-2xl")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {lang === "en" ? "Back to Planning" : "返回上一页修改"}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              {lang === "en" ? "Chapters" : "章节数"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-emerald-600">{chapters.length}</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              {lang === "en" ? "Sections" : "小节数"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-emerald-600">
              {chapters.reduce((sum, chapter) => sum + chapter.subchapters.length, 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              {lang === "en" ? "After Confirming" : "确认后的动作"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
            {lang === "en"
              ? "The app will jump into the first lesson and generate only chapter 1 section 1 main content automatically."
              : "系统会跳转到第一章第一节，并只自动生成这一节的正文内容。"}
          </CardContent>
        </Card>
      </div>

      {displayGoals.length > 0 && (
        <Card className="rounded-3xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-emerald-600" />
              {lang === "en" ? "Learning Goals" : "学习目标"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {displayGoals.map((goal, index) => (
              <div key={`${goal}-${index}`} className="flex items-start gap-3 text-sm leading-7">
                <span className="mt-1 text-xs font-medium text-emerald-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{goal}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold">
            {lang === "en" ? "Chapter Directory" : "章节目录"}
          </h2>
        </div>

        <div className="grid gap-4">
          {chapters.map((chapter, index) => (
            <Card key={chapter.id} className="rounded-3xl border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {index + 1}. {lang === "en" && chapter.titleEn ? chapter.titleEn : chapter.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {chapter.subchapters.map((subchapter, subIndex) => (
                  <div
                    key={subchapter.id}
                    className="rounded-2xl border border-border/40 bg-muted/30 px-4 py-3"
                  >
                    <div className="text-sm font-medium">
                      {index + 1}.{subIndex + 1}{" "}
                      {lang === "en" && subchapter.titleEn ? subchapter.titleEn : subchapter.title}
                    </div>
                    {(subchapter.learningObjective || subchapter.learningObjectiveEn) && (
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {lang === "en" && subchapter.learningObjectiveEn
                          ? subchapter.learningObjectiveEn
                          : subchapter.learningObjective}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
