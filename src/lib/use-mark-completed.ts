"use client";

import { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface UseMarkCompletedOptions {
  enabled?: boolean;
  projectId?: string;
}

export function useMarkCompleted(
  contentId: string,
  initialCompleted: boolean,
  options?: UseMarkCompletedOptions
) {
  const params = useParams();
  const router = useRouter();
  const projectId = options?.projectId ?? (params.projectId as string | undefined);
  const enabled = options?.enabled ?? true;
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isMarking, setIsMarking] = useState(false);

  const markCompleted = useCallback(async (quizScore?: number) => {
    if (!enabled) return;
    if (isMarking || !contentId || !projectId) return;
    setIsMarking(true);

    try {
      const body: Record<string, unknown> = { contentId, projectId };
      if (quizScore !== undefined) body.quizScore = quizScore;

      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setIsCompleted(true);
        window.dispatchEvent(
          new CustomEvent("studyclaw:progress-updated", {
            detail: { projectId },
          })
        );
        router.refresh();
      }
    } catch {
      // Silent — progress tracking is best-effort
    } finally {
      setIsMarking(false);
    }
  }, [contentId, enabled, isMarking, projectId, router]);

  return { isCompleted, isMarking, markCompleted };
}
