"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ContentItem {
  id: string;
  contentType: string;
}

interface GenerateAllButtonProps {
  contentItems: ContentItem[];
}

export function GenerateAllButton({ contentItems }: GenerateAllButtonProps) {
  const router = useRouter();
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
          throw new Error(data.error || `生成失败 (${res.status})`);
        }
      } catch (err) {
        setError(
          `第 ${i + 1} 项生成失败: ${err instanceof Error ? err.message : "未知错误"}`
        );
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
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 mb-8 glow-border">
        <div className="flex items-center gap-3 mb-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="font-medium">
            正在生成内容... ({current} / {total})
          </span>
        </div>
        <Progress value={percent} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          生成过程可能需要几分钟，请勿关闭页面
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mb-8 animate-pulse-glow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">计划已就绪</h3>
          <p className="text-sm text-muted-foreground mt-1">
            确认后将自动为所有章节生成正文、总结和测验（共 {total} 项）
          </p>
        </div>
        <Button onClick={handleGenerate} size="lg">
          <Sparkles className="mr-2 h-4 w-4" />
          确认计划
        </Button>
      </div>
      {error && (
        <p className="text-sm text-destructive mt-3">{error}</p>
      )}
    </div>
  );
}
