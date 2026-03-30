"use client";

import { useRef } from "react";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const ACCEPTED_TYPES = ".pdf,.docx,.txt,.md,.csv";

interface FileUploadButtonProps {
  projectId: string;
  fileCount: number;
  maxFiles: number;
  disabled?: boolean;
  lang: "zh" | "en";
  onUploadComplete: () => void;
  onError: (message: string) => void;
}

export function FileUploadButton({
  projectId,
  fileCount,
  maxFiles,
  disabled,
  lang,
  onUploadComplete,
  onError,
}: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isAtLimit = fileCount >= maxFiles;

  const handleClick = () => {
    if (isAtLimit || disabled) return;
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be re-selected
    e.target.value = "";

    if (file.size > MAX_FILE_SIZE) {
      onError(
        lang === "en"
          ? "File size exceeds 100MB limit"
          : "文件大小超过 100MB 限制",
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/projects/${projectId}/files`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        onError(
          (data as { error?: string }).error ||
            (lang === "en" ? "Upload failed" : "上传失败"),
        );
        return;
      }

      onUploadComplete();
    } catch {
      onError(lang === "en" ? "Upload failed" : "上传失败");
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-9 w-9 shrink-0"
        onClick={handleClick}
        disabled={isAtLimit || disabled}
        title={
          isAtLimit
            ? lang === "en"
              ? `Max ${maxFiles} files`
              : `最多 ${maxFiles} 个文件`
            : lang === "en"
              ? "Upload file"
              : "上传文件"
        }
      >
        <Paperclip className="h-4 w-4" />
      </Button>
    </>
  );
}
