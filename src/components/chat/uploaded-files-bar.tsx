"use client";

import { useEffect, useRef } from "react";
import { FileText, Loader2, AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedFileInfo {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: string;
  summary?: string | null;
  summaryEn?: string | null;
}

interface UploadedFilesBarProps {
  projectId: string;
  files: UploadedFileInfo[];
  lang: "zh" | "en";
  onRefresh: () => void;
  onDelete: (fileId: string) => void;
}

const STATUS_CONFIG: Record<
  string,
  { icon: typeof FileText; label: { zh: string; en: string }; color: string }
> = {
  pending: {
    icon: Loader2,
    label: { zh: "等待中", en: "Pending" },
    color: "text-muted-foreground",
  },
  extracting: {
    icon: Loader2,
    label: { zh: "提取中", en: "Extracting" },
    color: "text-blue-500",
  },
  summarizing: {
    icon: Loader2,
    label: { zh: "摘要中", en: "Summarizing" },
    color: "text-blue-500",
  },
  ready: {
    icon: CheckCircle2,
    label: { zh: "就绪", en: "Ready" },
    color: "text-green-500",
  },
  error: {
    icon: AlertCircle,
    label: { zh: "失败", en: "Error" },
    color: "text-destructive",
  },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function UploadedFilesBar({
  files,
  lang,
  onRefresh,
  onDelete,
}: UploadedFilesBarProps) {
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasProcessing = files.some(
    (f) => f.status === "pending" || f.status === "extracting" || f.status === "summarizing",
  );

  useEffect(() => {
    if (hasProcessing) {
      pollRef.current = setInterval(onRefresh, 3000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [hasProcessing, onRefresh]);

  if (files.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border/30 bg-muted/20 px-4 py-2 dark:border-white/10 dark:bg-white/[0.03]">
      <span className="text-xs font-medium text-muted-foreground">
        {lang === "en" ? "Files" : "文件"} ({files.length}/3)
      </span>
      {files.map((file) => {
        const config = STATUS_CONFIG[file.status] || STATUS_CONFIG.pending;
        const StatusIcon = config.icon;
        const isSpinning = file.status !== "ready" && file.status !== "error";

        return (
          <div
            key={file.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background/80 px-2.5 py-1 text-xs dark:border-white/15 dark:bg-white/[0.06]"
          >
            <StatusIcon
              className={cn(
                "h-3 w-3",
                config.color,
                isSpinning && "animate-spin",
              )}
            />
            <span className="max-w-[120px] truncate" title={file.fileName}>
              {file.fileName}
            </span>
            <span className="text-muted-foreground">
              {formatFileSize(file.fileSize)}
            </span>
            <span className={cn("text-[10px]", config.color)}>
              {config.label[lang]}
            </span>
            <button
              type="button"
              onClick={() => onDelete(file.id)}
              className="ml-0.5 rounded-full p-0.5 text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
              title={lang === "en" ? "Remove" : "删除"}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
