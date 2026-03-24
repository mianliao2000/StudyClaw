import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getAIProvider } from "@/lib/ai/provider";
import { PLANNING_SYSTEM_PROMPT, TUTORING_SYSTEM_PROMPT, fillTemplate } from "@/lib/ai/prompts";
import type { AIMessage } from "@/lib/ai/provider";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { threadId, message, mode, context, model, reasoning } = await req.json();

  // 获取或创建聊天线程
  let thread;
  if (threadId) {
    thread = await prisma.projectChatThread.findUnique({
      where: { id: threadId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
  }

  if (!thread) {
    return new Response("Thread not found", { status: 404 });
  }

  // 保存用户消息
  await prisma.projectChatMessage.create({
    data: { threadId: thread.id, role: "user", content: message },
  });

  // 构建 AI 消息
  let systemPrompt = PLANNING_SYSTEM_PROMPT;
  if (mode === "tutoring" && context) {
    systemPrompt = fillTemplate(TUTORING_SYSTEM_PROMPT, {
      projectTitle: context.projectTitle || "",
      chapterTitle: context.chapterTitle || "",
      subchapterTitle: context.subchapterTitle || "",
      learningObjective: context.learningObjective || "",
      lessonContent: context.lessonContent || "",
    });
  }

  const aiMessages: AIMessage[] = [
    { role: "system", content: systemPrompt },
    ...thread.messages.map((m) => ({
      role: m.role as AIMessage["role"],
      content: m.content,
    })),
    { role: "user" as const, content: message },
  ];

  try {
    const provider = getAIProvider();
    const aiOptions = { model, reasoning };
    const stream = await provider.chat(aiMessages, aiOptions);

    // 收集完整响应并保存
    const [streamForClient, streamForSave] = stream.tee();
    const decoder = new TextDecoder();

    // 后台保存完整响应
    (async () => {
      const reader = streamForSave.getReader();
      let fullResponse = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullResponse += decoder.decode(value);
      }
      await prisma.projectChatMessage.create({
        data: {
          threadId: thread!.id,
          role: "assistant",
          content: fullResponse,
        },
      });
    })();

    return new Response(streamForClient, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response(
      JSON.stringify({ error: "AI 服务暂时不可用，请检查配置" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
