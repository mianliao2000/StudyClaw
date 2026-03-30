"use client";

import { BookOpenCheck } from "lucide-react";
import { ExampleAddButton } from "@/components/example/example-add-button";
import { useLanguage } from "@/lib/i18n";

type ExampleLessonBannerProps = {
  courseSlug: string;
  target: {
    chapterSlug: string;
    subchapterSlug: string;
    lessonType: "main" | "summary" | "quiz";
  };
};

export function ExampleLessonBanner({
  courseSlug,
  target,
}: ExampleLessonBannerProps) {
  const { lang } = useLanguage();

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-primary/15 bg-gradient-to-r from-primary/8 via-background to-accent/8 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BookOpenCheck className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {lang === "en" ? "Official sample lesson" : "官方示例课内容"}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {lang === "en"
              ? "You can read everything here immediately. Add it to My Projects when you want saved progress and a persistent AI tutor."
              : "这里的课程内容现在就可以完整阅读。想保存进度并启用持久 AI 导师时，再把它加入“我的项目”。"}
          </p>
        </div>
      </div>

      <ExampleAddButton
        courseSlug={courseSlug}
        target={target}
        size="lg"
        className="shrink-0"
      />
    </div>
  );
}
