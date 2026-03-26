"use client";

import { useEffect, useRef, useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

const SIDEBAR_MIN_WIDTH = 240;
const SIDEBAR_MAX_WIDTH = 420;
const DEFAULT_SIDEBAR_WIDTH = 256;
const SIDEBAR_WIDTH_STORAGE_KEY = "pandora:project-sidebar-width";

interface ProjectLayoutShellProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

function clampSidebarWidth(nextWidth: number) {
  return Math.min(Math.max(nextWidth, SIDEBAR_MIN_WIDTH), SIDEBAR_MAX_WIDTH);
}

export function ProjectLayoutShell({
  sidebar,
  children,
}: ProjectLayoutShellProps) {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const sidebarWidthRef = useRef(DEFAULT_SIDEBAR_WIDTH);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  const applySidebarWidth = (width: number) => {
    sidebarWidthRef.current = width;
    containerRef.current?.style.setProperty("--project-sidebar-width", `${width}px`);
  };

  useEffect(() => {
    const savedWidth = window.localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
    const parsedWidth = savedWidth ? Number(savedWidth) : DEFAULT_SIDEBAR_WIDTH;
    const initialWidth = Number.isNaN(parsedWidth)
      ? DEFAULT_SIDEBAR_WIDTH
      : clampSidebarWidth(parsedWidth);

    setSidebarWidth(initialWidth);
    applySidebarWidth(initialWidth);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(sidebarWidth));
  }, [sidebarWidth]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || isSidebarHidden) return;

    const pointerId = event.pointerId;
    dividerRef.current?.setPointerCapture(pointerId);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    setIsDragging(true);

    const bounds = container.getBoundingClientRect();

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const nextWidth = clampSidebarWidth(moveEvent.clientX - bounds.left);
      applySidebarWidth(nextWidth);
    };

    const finishDragging = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishDragging);
      window.removeEventListener("pointercancel", finishDragging);
      dividerRef.current?.releasePointerCapture(pointerId);
      setSidebarWidth(sidebarWidthRef.current);
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
      className="relative flex flex-1 overflow-hidden"
      style={{ ["--project-sidebar-width" as string]: `${sidebarWidth}px` }}
    >
      <div
        className="shrink-0 overflow-hidden"
        style={{ width: isSidebarHidden ? 0 : "var(--project-sidebar-width)" }}
      >
        {!isSidebarHidden && sidebar}
      </div>

      {!isSidebarHidden && (
        <>
          <div
            ref={dividerRef}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize project sidebar"
            onPointerDown={handlePointerDown}
            className="relative w-2 shrink-0 touch-none cursor-col-resize bg-transparent hover:bg-primary/10"
            data-dragging={isDragging ? "true" : "false"}
          >
            <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border/80" />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute left-[calc(var(--project-sidebar-width)+10px)] top-3 z-20 h-8 w-8 rounded-full border-border/70 bg-background/90 shadow-sm backdrop-blur"
            onClick={() => setIsSidebarHidden(true)}
            aria-label={lang === "en" ? "Hide course sidebar" : "隐藏课程目录"}
            title={lang === "en" ? "Hide course sidebar" : "隐藏课程目录"}
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </>
      )}

      <main className="min-w-0 flex-1 overflow-auto">{children}</main>

      {isSidebarHidden && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute left-3 top-3 z-20 h-8 w-8 rounded-full border-border/70 bg-background/90 shadow-sm backdrop-blur"
          onClick={() => setIsSidebarHidden(false)}
          aria-label={lang === "en" ? "Show course sidebar" : "显示课程目录"}
          title={lang === "en" ? "Show course sidebar" : "显示课程目录"}
        >
          <PanelLeftOpen className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
