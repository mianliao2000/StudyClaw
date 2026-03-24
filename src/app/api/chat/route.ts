import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getAIProvider } from "@/lib/ai/provider";
import {
  detectConversationLanguage,
  type ConversationLanguage,
} from "@/lib/ai/conversation-language";
import {
  fillTemplate,
  getPlanningSystemPrompt,
  getTutoringSystemPrompt,
} from "@/lib/ai/prompts";
import type { AIMessage } from "@/lib/ai/provider";

type StoredChatMessage = {
  role: string;
  content: string;
};

type SharedTutoringMemoryItem = {
  role: string;
  content: string;
  createdAt: Date;
  thread: {
    project: {
      title: string;
    };
    relatedSubchapter: {
      title: string;
      chapter: {
        title: string;
      };
    } | null;
  };
};

type PlanningStateContext = {
  currentQuestionIndex?: number;
  isFreeMode?: boolean;
  stage?: "guided" | "free" | "divergence_only" | "decision_with_create";
  selections?: Record<string, string>;
  freeformNotes?: string[];
  decisionTrail?: string[];
  decisionOptionsHistory?: string[][];
  pendingQuestion?: {
    prompt: string;
    options: string[];
  } | null;
  hasEnoughInformation?: boolean;
};

function createPlanSummaryFallback(
  rawResponse: string,
  language: ConversationLanguage
) {
  const titleMatch = rawResponse.match(/"title"\s*:\s*"([^"]+)"/);
  const title = titleMatch?.[1];

  if (language === "en") {
    return title
      ? `Plan generated: ${title}. Open the review page to inspect the structure.`
      : "Plan generated. Open the review page to inspect the structure.";
  }

  return title
    ? `计划已生成：${title}。请前往确认计划页面查看结构。`
    : "计划已生成。请前往确认计划页面查看结构。";
}

function getUnavailableMessage(language: ConversationLanguage) {
  return language === "en"
    ? "AI service is temporarily unavailable. Please check the server configuration."
    : "AI 服务暂时不可用，请检查服务器配置。";
}

function buildPlanningStateSystemMessage(planningState?: PlanningStateContext) {
  if (!planningState) return null;

  const selectionLines = Object.entries(planningState.selections ?? {})
    .map(([key, value]) => `- ${key}: ${value}`)
    .join("\n");

  const noteLines = (planningState.freeformNotes ?? [])
    .filter(Boolean)
    .map((note, index) => `${index + 1}. ${note}`)
    .join("\n");

  const decisionTrailLines = (planningState.decisionTrail ?? [])
    .filter(Boolean)
    .map((choice, index) => `${index + 1}. ${choice}`)
    .join("\n");

  const previousDecisionOptions = (planningState.decisionOptionsHistory ?? [])
    .filter((options) => options.length > 0)
    .map((options, index) => `Round ${index + 1}: ${options.join(" | ")}`)
    .join("\n");

  const pendingQuestion = planningState.pendingQuestion
    ? [
        `Current frontend question: ${planningState.pendingQuestion.prompt}`,
        "Allowed options:",
        ...planningState.pendingQuestion.options.map((option) => `- ${option}`),
      ].join("\n")
    : "Current frontend question: none";

  return [
    "Hidden planning state from the frontend:",
    `- Guided question index: ${planningState.currentQuestionIndex ?? 0}`,
    `- Free mode: ${planningState.isFreeMode ? "yes" : "no"}`,
    `- Current stage: ${planningState.stage ?? "guided"}`,
    `- Enough information collected: ${planningState.hasEnoughInformation ? "yes" : "no"}`,
    pendingQuestion,
    "Collected single-choice answers:",
    selectionLines || "- none yet",
    "User freeform notes:",
    noteLines || "none",
    "Decision-loop choices already selected:",
    decisionTrailLines || "none",
    "Previous decision-loop option sets:",
    previousDecisionOptions || "none",
    "Use this state to decide the next single question or whether [PLAN_READY] should be returned.",
  ].join("\n");
}

function buildSharedTutoringMemory(items: SharedTutoringMemoryItem[]) {
  if (items.length === 0) return null;

  const lines = items
    .map((item) => {
      const chapterTitle =
        item.thread.relatedSubchapter?.chapter.title || "Unknown Chapter";
      const sectionTitle =
        item.thread.relatedSubchapter?.title || "Unknown Section";
      const trimmedContent =
        item.content.length > 240
          ? `${item.content.slice(0, 240)}...`
          : item.content;

      return `- [Project: ${item.thread.project.title}] [Chapter: ${chapterTitle}] [Section: ${sectionTitle}] ${item.role}: ${trimmedContent}`;
    })
    .join("\n");

  return [
    "Shared tutoring memory from the user's wider learning history.",
    "Use it as background context only.",
    "Do not quote it unless it is directly relevant to the current question.",
    lines,
  ].join("\n");
}

export async function POST(req: Request) {
  try { // outer catch for unhandled errors
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { threadId, message, mode, context, model, reasoning } =
    await req.json();

  const thread = await prisma.projectChatThread.findUnique({
    where: { id: threadId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!thread) {
    return new Response("Thread not found", { status: 404 });
  }

  let conversationLanguage =
    (thread.conversationLanguage as ConversationLanguage | null) ?? null;

  if (!conversationLanguage) {
    const firstUserMessage = thread.messages.find(
      (messageItem: StoredChatMessage) =>
        messageItem.role === "user" && messageItem.content !== "[GENERATE_PLAN]"
    );

    if (firstUserMessage) {
      conversationLanguage = detectConversationLanguage(firstUserMessage.content);
    } else if (message !== "[GENERATE_PLAN]") {
      conversationLanguage = detectConversationLanguage(message);
    } else {
      conversationLanguage = "zh";
    }

    await prisma.projectChatThread.update({
      where: { id: thread.id },
      data: { conversationLanguage },
    });
  }

  const sharedTutoringMemory =
    mode === "tutoring"
      ? await prisma.projectChatMessage
          .findMany({
            where: {
              threadId: { not: thread.id },
              thread: {
                mode: "tutoring",
                project: { userId: session.user.id },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 18,
            include: {
              thread: {
                select: {
                  project: { select: { title: true } },
                  relatedSubchapter: {
                    select: {
                      title: true,
                      chapter: { select: { title: true } },
                    },
                  },
                },
              },
            },
          })
          .then((items) => items.reverse())
      : [];

  if (!(mode === "planning" && message === "[GENERATE_PLAN]")) {
    await prisma.projectChatMessage.create({
      data: { threadId: thread.id, role: "user", content: message },
    });
  }

  let systemPrompt = getPlanningSystemPrompt(conversationLanguage);
  if (mode === "tutoring" && context) {
    systemPrompt = fillTemplate(getTutoringSystemPrompt(conversationLanguage), {
      projectTitle: context.projectTitle || "",
      chapterTitle: context.chapterTitle || "",
      subchapterTitle: context.subchapterTitle || "",
      learningObjective: context.learningObjective || "",
      lessonContent: context.lessonContent || "",
    });
  }

  const aiMessages: AIMessage[] = [
    { role: "system", content: systemPrompt },
    ...(mode === "tutoring" && sharedTutoringMemory.length > 0
      ? [
          {
            role: "system" as const,
            content: buildSharedTutoringMemory(sharedTutoringMemory) || "",
          },
        ]
      : []),
    ...(mode === "planning" && context?.planningState
      ? [
          {
            role: "system" as const,
            content:
              buildPlanningStateSystemMessage(
                context.planningState as PlanningStateContext
              ) || "",
          },
        ]
      : []),
    ...thread.messages
      .filter(
        (messageItem: StoredChatMessage) =>
          !(mode === "planning" && messageItem.content === "[GENERATE_PLAN]") &&
          !(mode === "planning" && messageItem.content.includes("```json"))
      )
      .map((messageItem: StoredChatMessage) => ({
        role: messageItem.role as AIMessage["role"],
        content: messageItem.content,
      })),
    { role: "user" as const, content: message },
  ];

  try {
    const provider = getAIProvider();
    const stream = await provider.chat(aiMessages, { model, reasoning });
    const [streamForClient, streamForSave] = stream.tee();
    const decoder = new TextDecoder();

    void (async () => {
      const reader = streamForSave.getReader();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullResponse += decoder.decode(value);
      }

      await prisma.projectChatMessage.create({
        data: {
          threadId: thread.id,
          role: "assistant",
          content:
            mode === "planning" && message === "[GENERATE_PLAN]"
              ? createPlanSummaryFallback(fullResponse, conversationLanguage)
              : fullResponse,
        },
      });
    })();

    return new Response(streamForClient, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("AI chat error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : getUnavailableMessage(conversationLanguage);

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  } catch (outerError) {
    console.error("Chat route unhandled error:", outerError);
    const msg = outerError instanceof Error ? outerError.message : String(outerError);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
