"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewProjectPage() {
  const router = useRouter();

  useEffect(() => {
    // 创建新项目并跳转到规划页面
    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "新学习项目", topic: "待定" }),
    })
      .then((r) => r.json())
      .then((project) => {
        router.replace(`/projects/${project.id}/plan`);
      });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">正在创建项目...</p>
    </div>
  );
}
