"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";

export default function NewProjectPage() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const initialPrompt =
      new URLSearchParams(window.location.search).get("prompt")?.trim() || "";

    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: initialPrompt || "新学习项目",
        topic: initialPrompt || "待定",
      }),
    })
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/login");
          return null;
        }

        return response.json();
      })
      .then((project) => {
        if (!project?.id) return;

        const nextUrl = initialPrompt
          ? `/projects/${project.id}/plan?start=${encodeURIComponent(initialPrompt)}`
          : `/projects/${project.id}/plan`;

        router.replace(nextUrl);
      });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">
        {t("misc.creatingProject")}
      </p>
    </div>
  );
}
