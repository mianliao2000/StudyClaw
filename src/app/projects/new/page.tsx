"use client";

import { useEffect, useRef, useState } from "react";

export default function NewProjectPage() {
  const hasStartedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const initialPrompt =
      new URLSearchParams(window.location.search).get("prompt")?.trim() || "";

    const createProject = async () => {
      try {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: initialPrompt || "New Learning Project",
            topic: initialPrompt || "TBD",
          }),
        });

        if (response.status === 401) {
          const nextPath = `${window.location.pathname}${window.location.search}`;
          window.location.replace(`/login?next=${encodeURIComponent(nextPath)}`);
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to create project: ${response.status}`);
        }

        const project = (await response.json()) as { id?: string };
        if (!project?.id) {
          throw new Error("Project id missing from create response");
        }

        const nextUrl = initialPrompt
          ? `/projects/${project.id}/plan?start=${encodeURIComponent(initialPrompt)}`
          : `/projects/${project.id}/plan`;

        // This page is only a transient launcher, so a hard redirect is
        // more reliable than a client-side transition here.
        window.location.replace(nextUrl);
      } catch (cause) {
        console.error("[projects/new] Failed to create project:", cause);
        setError(
          cause instanceof Error
            ? cause.message
            : "Failed to create project. Please retry."
        );
        hasStartedRef.current = false;
      }
    };

    void createProject();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-3 text-center">
        <p className="text-muted-foreground">
          Creating project and starting conversation...
        </p>
        {error ? (
          <div className="space-y-2">
            <p className="text-sm text-destructive">{error}</p>
            <button
              type="button"
              className="text-sm underline underline-offset-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
