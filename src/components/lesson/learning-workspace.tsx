"use client";

import { useEffect, useRef, useState } from "react";
import { PanelRightOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

const ASSISTANT_MIN_HEIGHT = 260;
const CONTENT_MIN_HEIGHT = 320;
const DEFAULT_ASSISTANT_HEIGHT = 320;
const DIVIDER_HEIGHT = 8;
const HEIGHT_STORAGE_KEY = "pandora:assistant-height";

interface LearningWorkspaceProps {
  content: React.ReactNode;
  assistant: React.ReactNode;
  isAssistantExpanded: boolean;
  isAssistantHidden: boolean;
  onShowAssistant: () => void;
}

function clampHeight(nextHeight: number, totalHeight: number) {
  const maxHeight = Math.max(
    ASSISTANT_MIN_HEIGHT,
    totalHeight - CONTENT_MIN_HEIGHT - DIVIDER_HEIGHT
  );
  return Math.min(Math.max(nextHeight, ASSISTANT_MIN_HEIGHT), maxHeight);
}

export function LearningWorkspace({
  content,
  assistant,
  isAssistantExpanded,
  isAssistantHidden,
  onShowAssistant,
}: LearningWorkspaceProps) {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const currentHeightRef = useRef(DEFAULT_ASSISTANT_HEIGHT);
  const previousLayoutHeightRef = useRef(DEFAULT_ASSISTANT_HEIGHT);
  const wasExpandedRef = useRef(isAssistantExpanded);
  const [assistantHeight, setAssistantHeight] = useState(DEFAULT_ASSISTANT_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);

  const applyAssistantHeight = (height: number) => {
    currentHeightRef.current = height;
    containerRef.current?.style.setProperty("--assistant-height", `${height}px`);
  };

  useEffect(() => {
    const savedHeight = window.localStorage.getItem(HEIGHT_STORAGE_KEY);
    const parsedHeight = savedHeight ? Number(savedHeight) : DEFAULT_ASSISTANT_HEIGHT;
    const initialHeight = Number.isNaN(parsedHeight)
      ? DEFAULT_ASSISTANT_HEIGHT
      : parsedHeight;

    setAssistantHeight(initialHeight);
    previousLayoutHeightRef.current = initialHeight;
    applyAssistantHeight(initialHeight);
  }, []);

  useEffect(() => {
    if (!isAssistantExpanded && !isAssistantHidden) {
      window.localStorage.setItem(HEIGHT_STORAGE_KEY, String(assistantHeight));
    }
  }, [assistantHeight, isAssistantExpanded, isAssistantHidden]);

  useEffect(() => {
    if (isAssistantExpanded && !wasExpandedRef.current) {
      previousLayoutHeightRef.current = currentHeightRef.current;
    }

    if (!isAssistantExpanded && wasExpandedRef.current) {
      applyAssistantHeight(previousLayoutHeightRef.current);
      setAssistantHeight(previousLayoutHeightRef.current);
    }

    wasExpandedRef.current = isAssistantExpanded;
  }, [isAssistantExpanded]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isAssistantExpanded || isAssistantHidden) return;
    const container = containerRef.current;
    if (!container) return;

    const pointerId = event.pointerId;
    dividerRef.current?.setPointerCapture(pointerId);
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
    setIsDragging(true);

    const bounds = container.getBoundingClientRect();

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const nextHeight = clampHeight(bounds.bottom - moveEvent.clientY, bounds.height);
      applyAssistantHeight(nextHeight);
    };

    const finishDragging = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishDragging);
      window.removeEventListener("pointercancel", finishDragging);
      dividerRef.current?.releasePointerCapture(pointerId);
      setAssistantHeight(currentHeightRef.current);
      previousLayoutHeightRef.current = currentHeightRef.current;
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", finishDragging);
    window.addEventListener("pointercancel", finishDragging);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden"
      style={{ ["--assistant-height" as string]: `${assistantHeight}px` }}
    >
      <div
        className="min-h-0 min-w-0 overflow-y-auto overscroll-contain transition-[height,opacity] duration-200"
        style={{
          height:
            isAssistantExpanded || isAssistantHidden
              ? "100%"
              : `calc(100% - var(--assistant-height) - ${DIVIDER_HEIGHT}px)`,
          opacity: isAssistantExpanded ? 0 : 1,
          transitionDuration: isDragging ? "0ms" : undefined,
        }}
      >
        {(!isAssistantExpanded || isAssistantHidden) && content}
      </div>

      {!isAssistantExpanded && !isAssistantHidden && (
        <div
          ref={dividerRef}
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize assistant panel"
          onPointerDown={handlePointerDown}
          className="relative h-2.5 shrink-0 touch-none cursor-row-resize bg-transparent transition-colors hover:bg-primary/10"
        >
          <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-slate-700 dark:bg-white" />
        </div>
      )}

      <div
        className="min-h-0 shrink-0 bg-background transition-[height] duration-200"
        style={{
          height: isAssistantHidden ? 0 : isAssistantExpanded ? "100%" : "var(--assistant-height)",
          transitionDuration: isDragging ? "0ms" : undefined,
        }}
      >
        {!isAssistantHidden && <div className="h-full min-h-0">{assistant}</div>}
      </div>

      {isAssistantHidden && (
        <button
          type="button"
          className="absolute bottom-4 right-4 z-20 flex items-center gap-2.5 rounded-full border border-primary/40 bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 dark:bg-primary dark:shadow-primary/20"
          onClick={onShowAssistant}
          aria-label={lang === "en" ? "Show AI assistant" : "显示 AI 辅导助手"}
        >
          <PanelRightOpen className="h-4 w-4" />
          <span>{lang === "en" ? "Open AI Tutor" : "打开 AI 助手"}</span>
        </button>
      )}
    </div>
  );
}
