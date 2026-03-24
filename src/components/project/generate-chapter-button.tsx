"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/lib/i18n";

interface ContentItem {
  id: string;
  contentType: string;
}

interface GenerateChapterButtonProps {
  chapterTitle: string;
  contentItems: ContentItem[];
  variant?: "banner" | "inline";
}

export function GenerateChapterButton({
  chapterTitle,
  contentItems,
  variant = "inline",
}: GenerateChapterButtonProps) {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const total = contentItems.length;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setCurrent(0);

    for (let i = 0; i < contentItems.length; i++) {
      setCurrent(i);
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contentId: contentItems[i].id }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `${t("project.genFailed")} (${res.status})`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t("project.genFailed"));
        setIsGenerating(false);
        return;
      }
    }

    setCurrent(total);
    setIsGenerating(false);
    router.refresh();
  };

  if (isGenerating) {
    const percent = total > 0 ? Math.round((current / total) * 100) : 0;
    const generatingLabel = lang === "zh"
      ? `正在生成「${chapterTitle}」... (${current} / ${total})`
      : `Generating "${chapterTitle}"... (${current} / ${total})`;

    if (variant === "banner") {
      return (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 mb-8 glow-border">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="font-medium">{generatingLabel}</span>
          </div>
          <Progress value={percent} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {t("project.genWait")}
          </p>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-sm text-primary">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>{current}/{total}</span>
        <Progress value={percent} className="h-1 w-20" />
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mb-8 animate-pulse-glow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{t("project.planReady")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("project.confirmHintFirst")}
            </p>
          </div>
          <Button onClick={handleGenerate} size="lg">
            <Sparkles className="mr-2 h-4 w-4" />
            {t("project.confirm")}
          </Button>
        </div>
        {error && <p className="text-sm text-destructive mt-3">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handleGenerate}
        className="border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40 text-xs h-7"
      >
        <Sparkles className="mr-1.5 h-3 w-3" />
        {t("project.generateChapter")}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
