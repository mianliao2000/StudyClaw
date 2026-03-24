"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/i18n/translations";

interface LessonContentProps {
  contentId: string;
  body: string;
  bodyEn?: string;
  status: string;
  contentType: string;
}

const typeKeys: Record<string, TranslationKey> = {
  main: "content.main",
  summary: "content.summary",
  quiz: "content.quiz",
};

export function LessonContent({
  contentId,
  body,
  bodyEn,
  status: initialStatus,
  contentType,
}: LessonContentProps) {
  const { t, lang } = useLanguage();
  const [content, setContent] = useState(body);
  const [contentEnState, setContentEnState] = useState(bodyEn || "");
  const [status, setStatus] = useState(initialStatus);

  const displayContent = lang === "en" && contentEnState ? contentEnState : content;
  const typeLabel = typeKeys[contentType] ? t(typeKeys[contentType]) : contentType;

  const handleGenerate = async () => {
    setStatus("generating");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId }),
      });

      if (res.ok) {
        const data = await res.json();
        setContent(data.body ?? data.bodyZh ?? "");
        setContentEnState(data.bodyEn ?? "");
        setStatus("ready");
      } else {
        const err = await res.json();
        alert(err.error || t("content.error"));
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "generating") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>{t("content.generating")}{typeLabel}...</p>
      </div>
    );
  }

  if (status === "pending" || status === "error" || !content) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">
          {status === "error"
            ? t("content.error")
            : `${typeLabel}${t("content.notReady")}`}
        </p>
        <Button onClick={handleGenerate}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {status === "error" ? t("content.regenerate") : t("content.generate")}
        </Button>
      </div>
    );
  }

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
    </div>
  );
}
