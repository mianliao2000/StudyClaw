"use client";

import { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export function useMarkCompleted(contentId: string, initialCompleted: boolean) {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isMarking, setIsMarking] = useState(false);

  const markCompleted = useCallback(async (quizScore?: number) => {
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
        router.refresh();
      }
    } catch {
      // Silent — progress tracking is best-effort
    } finally {
      setIsMarking(false);
    }
  }, [contentId, isMarking, projectId, router]);

  return { isCompleted, isMarking, markCompleted };
}
