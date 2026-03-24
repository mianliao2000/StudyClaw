"use client";

import { useEffect, useRef, useState } from "react";

const ASSISTANT_MIN_WIDTH = 300;
const CONTENT_MIN_WIDTH = 520;
const DEFAULT_ASSISTANT_WIDTH = 360;
const WIDTH_STORAGE_KEY = "studyclaw:assistant-width";

interface LearningWorkspaceProps {
  content: React.ReactNode;
  assistant: React.ReactNode;
  isAssistantExpanded: boolean;
}

function clampWidth(nextWidth: number, totalWidth: number) {
  const maxWidth = Math.max(ASSISTANT_MIN_WIDTH, totalWidth - CONTENT_MIN_WIDTH);
  return Math.min(Math.max(nextWidth, ASSISTANT_MIN_WIDTH), maxWidth);
}

export function LearningWorkspace({
  content,
  assistant,
  isAssistantExpanded,
}: LearningWorkspaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pendingWidthRef = useRef<number | null>(null);
  const currentWidthRef = useRef(DEFAULT_ASSISTANT_WIDTH);
  const previousLayoutWidthRef = useRef(DEFAULT_ASSISTANT_WIDTH);
  const isDraggingRef = useRef(false);
  const wasExpandedRef = useRef(isAssistantExpanded);
  const [assistantWidth, setAssistantWidth] = useState(DEFAULT_ASSISTANT_WIDTH);

  const applyAssistantWidth = (width: number) => {
    currentWidthRef.current = width;
    containerRef.current?.style.setProperty("--assistant-width", `${width}px`);
  };

  const scheduleWidthUpdate = (width: number) => {
    pendingWidthRef.current = width;
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(() => {
      if (pendingWidthRef.current !== null) {
        applyAssistantWidth(pendingWidthRef.current);
      }
      pendingWidthRef.current = null;
      frameRef.current = null;
    });
  };

  useEffect(() => {
    const savedWidth = window.localStorage.getItem(WIDTH_STORAGE_KEY);
    const parsedWidth = savedWidth ? Number(savedWidth) : DEFAULT_ASSISTANT_WIDTH;
    const initialWidth = Number.isNaN(parsedWidth) ? DEFAULT_ASSISTANT_WIDTH : parsedWidth;

    setAssistantWidth(initialWidth);
    previousLayoutWidthRef.current = initialWidth;
    applyAssistantWidth(initialWidth);
  }, []);

  useEffect(() => {
    if (!isAssistantExpanded) {
      window.localStorage.setItem(WIDTH_STORAGE_KEY, String(assistantWidth));
    }
  }, [assistantWidth, isAssistantExpanded]);

  useEffect(() => {
    if (isAssistantExpanded && !wasExpandedRef.current) {
      previousLayoutWidthRef.current = currentWidthRef.current;
    }

    if (!isAssistantExpanded && wasExpandedRef.current) {
      applyAssistantWidth(previousLayoutWidthRef.current);
      setAssistantWidth(previousLayoutWidthRef.current);
    }

    wasExpandedRef.current = isAssistantExpanded;
  }, [isAssistantExpanded]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isAssistantExpanded) return;
    isDraggingRef.current = true;
    dividerRef.current?.setPointerCapture(event.pointerId);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || isAssistantExpanded) return;

    const container = containerRef.current;
    if (!container) return;

    const bounds = container.getBoundingClientRect();
    const nextWidth = clampWidth(bounds.right - event.clientX, bounds.width);
    scheduleWidthUpdate(nextWidth);
  };

  const finishDragging = (pointerId?: number) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    if (pointerId !== undefined && dividerRef.current?.hasPointerCapture(pointerId)) {
      dividerRef.current.releasePointerCapture(pointerId);
    }

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (pendingWidthRef.current !== null) {
      applyAssistantWidth(pendingWidthRef.current);
      pendingWidthRef.current = null;
    }

    setAssistantWidth(currentWidthRef.current);
    previousLayoutWidthRef.current = currentWidthRef.current;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  return (
    <div
      ref={containerRef}
      className="flex h-full min-w-0"
      style={{ ["--assistant-width" as string]: `${assistantWidth}px` }}
    >
      <div
        className="min-w-0 overflow-auto transition-[width,opacity] duration-200"
        style={{
          width: isAssistantExpanded ? 0 : "calc(100% - var(--assistant-width))",
          opacity: isAssistantExpanded ? 0 : 1,
        }}
      >
        {!isAssistantExpanded && content}
      </div>

      {!isAssistantExpanded && (
        <div
          ref={dividerRef}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize assistant panel"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(event) => finishDragging(event.pointerId)}
          onPointerCancel={(event) => finishDragging(event.pointerId)}
          className="relative w-2 shrink-0 touch-none cursor-col-resize bg-transparent transition-colors hover:bg-primary/10"
        >
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border/80" />
        </div>
      )}

      <div
        className="shrink-0 border-l bg-background transition-[width] duration-200"
        style={{ width: isAssistantExpanded ? "100%" : "var(--assistant-width)" }}
      >
        <div className="h-full min-w-[300px]">{assistant}</div>
      </div>
    </div>
  );
}
