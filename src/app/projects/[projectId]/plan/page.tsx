"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import type { ChatMessage, PlanStructure } from "@/types";

export default function PlanPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const projectId = params.projectId as string;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [planReady, setPlanReady] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [model, setModel] = useState("gpt-5.4-mini");
  const [reasoning, setReasoning] = useState("medium");

  const extractPlan = (fullText: string): PlanStructure | null => {
    let jsonStr: string | null = null;

    const jsonFenceMatch = fullText.match(/```json\s*([\s\S]*?)```/i);
    if (jsonFenceMatch) jsonStr = jsonFenceMatch[1];

    if (!jsonStr) {
      const fenceMatch = fullText.match(/```\s*([\s\S]*?)```/);
      if (fenceMatch && fenceMatch[1].trim().startsWith("{")) {
        jsonStr = fenceMatch[1];
      }
    }

    if (!jsonStr) {
      const start = fullText.indexOf("{");
      const end = fullText.lastIndexOf("}");
      if (start !== -1 && end > start) {
        jsonStr = fullText.slice(start, end + 1);
      }
    }

    if (!jsonStr) return null;

    try {
      const plan = JSON.parse(jsonStr) as PlanStructure;
      if (plan.title && Array.isArray(plan.chapters)) {
        return plan;
      }
    } catch (error) {
      console.error("[Plan] JSON parse failed:", error);
    }

    return null;
  };

  const createProjectFromPlan = useCallback(
    async (plan: PlanStructure) => {
      const putRes = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, plan }),
      });

      if (!putRes.ok) {
        let errorMessage = "Failed to save generated plan";
        try {
          const data = (await putRes.json()) as { error?: string };
          if (data.error) errorMessage = data.error;
        } catch {
          // Ignore malformed error responses and keep the fallback message.
        }
        throw new Error(errorMessage);
      }

      router.push(`/projects/${projectId}`);
    },
    [projectId, router]
  );

  useEffect(() => {
    fetch(`/api/projects/${projectId}/thread`)
      .then((r) => r.json())
      .then((data) => {
        if (data.threadId) setThreadId(data.threadId);
        if (data.messages) {
          const loaded = data.messages.map(
            (m: { id: string; role: string; content: string; createdAt: string }) => ({
              ...m,
              createdAt: new Date(m.createdAt),
            })
          );
          setMessages(loaded);
          const hasReady = loaded.some(
            (m: ChatMessage) => m.role === "assistant" && m.content.includes("[PLAN_READY]")
          );
          if (hasReady) setPlanReady(true);
        }
      });
  }, [projectId]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!threadId) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            threadId,
            message: text,
            mode: "planning",
            model,
            reasoning,
          }),
        });

        if (!res.ok) {
          let errorMessage = "Chat failed";
          try {
            const data = (await res.json()) as { error?: string };
            if (data.error) errorMessage = data.error;
          } catch {
            // Ignore malformed error responses and keep the fallback message.
          }
          throw new Error(errorMessage);
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        const assistantId = crypto.randomUUID();

        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "", createdAt: new Date() },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: fullText } : m
            )
          );
        }

        if (fullText.includes("[PLAN_READY]")) {
          setPlanReady(true);
        }

        const plan = extractPlan(fullText);
        if (plan) {
          await createProjectFromPlan(plan);
          return;
        }

        if (text === "[GENERATE_PLAN]") {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content:
                "课程结构生成失败了。请再点击一次“创建课程”，如果还是不行，我可以继续帮你排查模型返回格式。",
              createdAt: new Date(),
            },
          ]);
          setIsCreating(false);
        }
      } catch (error) {
        console.error(error);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              error instanceof Error && error.message
                ? error.message
                : t("tutor.error"),
            createdAt: new Date(),
          },
        ]);
        setIsCreating(false);
      } finally {
        setIsLoading(false);
      }
    },
    [threadId, model, reasoning, t, createProjectFromPlan]
  );

  const handleCreateCourse = async () => {
    if (!threadId || isLoading || isCreating) return;
    setIsCreating(true);
    await handleSend("[GENERATE_PLAN]");
  };

  const suggestions =
    t("plan.placeholder") === "Tell AI what you want to learn..."
      ? ["Learn AI Agent development", "Plan a Power Electronics course", "React full-stack development", "System Design intro to advanced"]
      : ["我想学习 AI Agent 开发", "帮我规划电力电子学课程", "我想学 React 全栈开发", "系统设计入门到进阶"];

  return (
    <>
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className="border-b border-border/50 px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-semibold">{t("plan.title")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("plan.subtitle")}
            </p>
          </div>
          <Button
            onClick={handleCreateCourse}
            disabled={!planReady || isLoading || isCreating}
            className={planReady && !isCreating ? "animate-pulse-glow" : ""}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("plan.creating")}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {t("plan.create")}
              </>
            )}
          </Button>
        </div>

        {planReady && !isCreating && (
          <div className="px-4 py-3 border-b border-primary/30 bg-primary/10 text-center animate-pulse-glow">
            <p className="text-sm font-medium text-primary">{t("plan.readyBanner")}</p>
          </div>
        )}
        {!planReady && messages.length > 0 && (
          <div className="px-4 py-2 text-xs text-muted-foreground text-center border-b border-border/30 bg-muted/20">
            {t("plan.hint")}
          </div>
        )}

        <ChatPanel
          messages={messages}
          onSend={handleSend}
          isLoading={isLoading}
          placeholder={t("plan.placeholder")}
          suggestions={suggestions}
          className="flex-1"
          showModelSelector
          model={model}
          onModelChange={setModel}
          reasoning={reasoning}
          onReasoningChange={setReasoning}
        />
      </main>
    </>
  );
}
