"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import {
  detectConversationLanguage,
  getCreateCourseLabel,
  getCreateCourseOption,
  isCreateCourseOption,
  type ConversationLanguage,
} from "@/lib/ai/conversation-language";
import {
  getFriendlyChatNetworkError,
  isNetworkFetchError,
  postChatRequestWithRetry,
} from "@/lib/chat-request";
import type { ChatMessage, PlanStructure } from "@/types";

type FixedQuestion = {
  id: string;
  prompt: string;
  options: [string, string, string];
};

type DecisionQuestion = {
  prompt: string;
  options: [string, string, string];
};

type DecisionLoopStage = "divergence_only" | "decision_with_create";

const MAX_GUIDED_OPTION_ROUNDS_BEFORE_CREATE = 4;

function getGuidedQuestions(language: ConversationLanguage): FixedQuestion[] {
  return language === "en"
    ? [
        {
          id: "topic-direction",
          prompt:
            "Let's first anchor the learning direction. Which topic category is closest to what you want right now?",
          options: [
            "A. Technical development, such as programming, AI, data, or system design",
            "B. Academic or research learning, such as theory-heavy courses or paper reading",
            "C. Career skill building, such as job preparation, switching tracks, or practical industry skills",
          ],
        },
        {
          id: "background-level",
          prompt: "Which description best matches your current background?",
          options: [
            "A. Beginner, and I want to start from concepts and fundamentals",
            "B. I know some basics and want a structured path toward the next level",
            "C. I already have a foundation and want to move quickly into projects or advanced topics",
          ],
        },
        {
          id: "goal-focus",
          prompt: "What result do you most want this course to help you achieve?",
          options: [
            "A. Build a solid mental model and understand the whole field clearly",
            "B. Produce projects or practical outcomes that I can actually use",
            "C. Prepare for jobs or research with stronger depth and competitiveness",
          ],
        },
        {
          id: "weekly-time",
          prompt: "How much time do you expect to spend learning each week?",
          options: [
            "A. 1-3 hours per week, with a lighter steady pace",
            "B. 4-6 hours per week, balancing structure and practice",
            "C. 7+ hours per week, with a faster pace",
          ],
        },
      ]
    : [
        {
          id: "topic-direction",
          prompt: "我们先确定你的学习方向。你现在更接近哪一种主题类型？",
          options: [
            "A. 技术开发方向，例如编程、AI、数据、系统设计",
            "B. 学术研究方向，例如专业课程、论文阅读、理论体系",
            "C. 职业技能方向，例如求职、转岗、行业实战能力",
          ],
        },
        {
          id: "background-level",
          prompt: "你目前的基础更接近哪一种？",
          options: [
            "A. 零基础，需要从概念和入门知识开始",
            "B. 有一些基础，希望系统补齐并逐步进阶",
            "C. 已有基础，希望快速进入项目或高阶专题",
          ],
        },
        {
          id: "goal-focus",
          prompt: "你更希望这门课最终帮助你达成什么结果？",
          options: [
            "A. 建立完整知识框架，系统学懂",
            "B. 做出项目或作品，强调实战输出",
            "C. 面向求职或研究，突出竞争力和深度",
          ],
        },
        {
          id: "weekly-time",
          prompt: "你期望每周花费多少时间学习？",
          options: [
            "A. 每周 1-3 小时，轻量稳步推进",
            "B. 每周 4-6 小时，平衡系统学习与练习",
            "C. 每周 7 小时以上，希望更快推进",
          ],
        },
      ];
}

function getPlanGenerationMessage(language: ConversationLanguage) {
  return language === "en"
    ? "AI is tailoring your course now. Please wait about 1 minute..."
    : "AI 正在为你定制课程中，请稍等约 1 分钟……";
}

function getPlanPendingMessage(language: ConversationLanguage) {
  return language === "en"
    ? "AI is organizing your course structure. If the page does not jump automatically, you can still refine the direction and create the course again."
    : "AI 正在为你整理课程结构，如稍后未自动跳转，你仍可以继续调整方向后再创建课程。";
}

function getPlanNotReadyMessage(language: ConversationLanguage) {
  return language === "en"
    ? 'No savable course structure was produced this time. You can keep refining the direction with the options and then click "Create Course" again.'
    : "这次还没整理出可保存的课程结构。你可以继续通过选项卡调整方向，然后再点击“创建课程”。";
}

function getCreateReadyMessage(language: ConversationLanguage) {
  return language === "en"
    ? "I already have enough information to build a course for you. Here are two extension directions, or you can create the course now."
    : "我已经具备为你生成课程的关键信息了，下面给你两个延展方向，你也可以直接创建课程。";
}

function getAssistantErrorMessage(language: ConversationLanguage) {
  return language === "en"
    ? "Sorry, something went wrong. Please try again."
    : "抱歉，刚刚出了点问题，请稍后重试。";
}

function getDecisionBannerText(
  stage: DecisionLoopStage,
  language: ConversationLanguage
) {
  if (language === "en") {
    return stage === "decision_with_create"
      ? "This is a create-or-continue round: you can create the course now, or keep expanding the current direction."
      : "This is a pure exploration round: choose one of the three concrete directions first.";
  }

  return stage === "decision_with_create"
    ? "当前是创建决策轮：你可以直接创建课程，或继续沿当前方向发散。"
    : "当前是纯发散轮：请先从三个具体探索方向里选择一个。";
}

function getPlanHint(language: ConversationLanguage) {
  return language === "en"
    ? 'Keep chatting to refine the plan. The "Create Course" button will light up when AI is ready.'
    : "继续对话以完善计划，AI 准备就绪后「创建课程」按钮将亮起";
}

function getPlanPlaceholder(language: ConversationLanguage) {
  return language === "en"
    ? "Tell AI what you want to learn..."
    : "告诉 AI 你想学什么...";
}

function extractPlan(fullText: string): PlanStructure | null {
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
}

function buildOptionsBlock(prompt: string, options: string[]) {
  return [prompt, "", "[OPTIONS]", ...options, "[/OPTIONS]"].join("\n");
}

function buildQuestionMessage(question: FixedQuestion | DecisionQuestion) {
  return buildOptionsBlock(question.prompt, [...question.options]);
}

function extractOptionsFromMessage(content: string) {
  const match = content.match(/\[OPTIONS\]\s*([\s\S]*?)(?:\s*\[\/OPTIONS\]|$)/);
  if (!match) return [] as string[];

  return match[1]
    .replace(/\s+(?=[A-C][.)]\s)/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[A-C][.)]\s/.test(line))
    .slice(0, 3);
}

function inferDecisionLoopStage(
  options: string[],
  language: ConversationLanguage,
  fallback: DecisionLoopStage = "divergence_only"
): DecisionLoopStage {
  return options.some((option) => isCreateCourseOption(option, language))
    ? "decision_with_create"
    : fallback;
}

function buildPlanReadyMessage(
  plan: PlanStructure,
  language: ConversationLanguage
) {
  const chapterCount = plan.chapters.length;
  const subchapterCount = plan.chapters.reduce(
    (sum, chapter) => sum + chapter.subchapters.length,
    0
  );

  if (language === "en") {
    return [
      "Plan generated.",
      "",
      `Course title: ${plan.titleEn || plan.title}`,
      `Chapters: ${chapterCount}`,
      `Sections: ${subchapterCount}`,
      "",
      'Click "Create Course" to open the review page. No lesson content will be generated before confirmation.',
    ].join("\n");
  }

  return [
    "计划已生成。",
    "",
    `课程标题：${plan.title}`,
    `章节数：${chapterCount}`,
    `小节数：${subchapterCount}`,
    "",
    "点击“创建课程”后会进入确认计划页面。确认前不会生成课程正文。",
  ].join("\n");
}

function sanitizeAssistantMessage(
  message: ChatMessage,
  language: ConversationLanguage
): ChatMessage {
  if (message.role !== "assistant") return message;

  const plan = extractPlan(message.content);
  if (plan) {
    return { ...message, content: buildPlanReadyMessage(plan, language) };
  }

  if (message.content.includes("[PLAN_READY]")) {
    return {
      ...message,
      content: message.content.replace(/\[PLAN_READY\]\s*$/g, "").trim(),
    };
  }

  return message;
}

function buildDecisionQuestion(args: {
  language: ConversationLanguage;
  returnedFromReview: boolean;
  selections: Record<string, string>;
  notes: string[];
  trail: string[];
}): DecisionQuestion {
  const { language, returnedFromReview, selections, notes, trail } = args;
  const createCourseOption = getCreateCourseOption(language);
  const lastChoice = trail[trail.length - 1] ?? "";
  const wantsPractice =
    selections["goal-focus"]?.match(/实战|project|practical/i) ||
    notes.some((note) => /项目|实战|案例|应用|project|practical/i.test(note));
  const needsFoundation =
    selections["background-level"]?.match(/零基础|beginner|fundamentals/i) ||
    notes.some((note) => /基础|入门|从头|beginner|fundamentals/i.test(note));

  if (returnedFromReview && trail.length === 0) {
    return language === "en"
      ? {
          prompt:
            "You came back to revise the plan. Do you want to fine-tune the current direction first, or rethink the plan more deeply?",
          options: [
            createCourseOption,
            "B. Adjust the direction, such as making it more practical, more foundational, or paced differently",
            "C. Re-plan more deeply, such as reframing the topic or rebuilding the path from scratch",
          ],
        }
      : {
          prompt:
            "你返回修改，是因为对当前课程还不够满意吗？我们可以先微调方向，也可以重新规划。",
          options: [
            createCourseOption,
            "B. 调整方向，例如更偏实战、更基础、或调整节奏",
            "C. 重新规划，例如换主题、重做路径、重新梳理目标",
          ],
        };
  }

  if (
    /调整方向|基础|adjust|foundation/i.test(lastChoice) ||
    (needsFoundation && trail.length > 0)
  ) {
    return language === "en"
      ? {
          prompt:
            "If we keep refining this course, which contrast do you want me to push harder next?",
          options: [
            createCourseOption,
            "B. Make the foundation much stronger and lower the early learning barrier",
            "C. Keep the basics, but introduce examples and application bridges earlier",
          ],
        }
      : {
          prompt: "如果继续优化这门课，你更希望我往哪个方向继续拉开差异？",
          options: [
            createCourseOption,
            "B. 更扎实地补基础，降低前期门槛",
            "C. 保留基础，但更早加入案例和应用桥接",
          ],
        };
  }

  if (/重新规划|换主题|re-plan|topic/i.test(lastChoice)) {
    return language === "en"
      ? {
          prompt: "If we re-plan, which layer should change first?",
          options: [
            createCourseOption,
            "B. Keep the broad topic, but rebuild the chapter path and sequence",
            "C. Switch to a different topic that fits your current goal better",
          ],
        }
      : {
          prompt: "如果重新规划，你更想优先动哪一层？",
          options: [
            createCourseOption,
            "B. 保留大主题，但重做章节路径和学习顺序",
            "C. 直接换一个更贴近当前目标的新主题",
          ],
        };
  }

  if (/实战|项目|project|practical/i.test(lastChoice) || wantsPractice) {
    return language === "en"
      ? {
          prompt:
            "If we keep pushing toward a practical direction, which side do you want to strengthen more?",
          options: [
            createCourseOption,
            "B. More project output and case breakdowns, with an emphasis on building real things",
            "C. More job-facing scenarios, with an emphasis on communicating applied ability",
          ],
        }
      : {
          prompt: "如果继续往实战方向扩展，你更想强化哪一边？",
          options: [
            createCourseOption,
            "B. 项目作品与案例拆解，强调做出来",
            "C. 求职与面试导向，强调能力表达和落地场景",
          ],
        };
  }

  return language === "en"
    ? {
        prompt:
          "I already have enough information to build the course. Do you want to create it now, or explore two more directions first?",
        options: [
          createCourseOption,
          wantsPractice
            ? "B. Keep the topic, but lean harder into projects and practical output"
            : "B. Keep the topic, but lean harder into systems understanding and a stronger knowledge map",
          needsFoundation
            ? "C. Keep the topic, but slow down and reinforce the fundamentals more deliberately"
            : "C. Keep the topic, but stretch into deeper and more advanced exploration",
        ],
      }
    : {
        prompt:
          "基于你当前给的信息，我已经可以开始建课。你要直接创建，还是先让我再发散两个方向？",
        options: [
          createCourseOption,
          wantsPractice
            ? "B. 保留主题，但让路径更偏项目实战和案例输出"
            : "B. 保留主题，但让路径更偏系统理解和知识框架",
          needsFoundation
            ? "C. 保留主题，但把节奏放慢、把基础铺得更稳"
            : "C. 保留主题，但拉向更高阶、更深入的专题探索",
        ],
      };
}

export default function PlanPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, lang } = useLanguage();
  const projectId = params.projectId as string;
  const isRevising = searchParams.get("revise") === "1";
  const initialPrompt = searchParams.get("start")?.trim() || "";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [coursePlan, setCoursePlan] = useState<PlanStructure | null>(null);
  const [conversationLanguage, setConversationLanguage] =
    useState<ConversationLanguage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(
    {}
  );
  const [freeformNotes, setFreeformNotes] = useState<string[]>([]);
  const [isFreeMode, setIsFreeMode] = useState(false);
  const [isInDecisionLoop, setIsInDecisionLoop] = useState(false);
  const [decisionTrail, setDecisionTrail] = useState<string[]>([]);
  const [decisionOptionsHistory, setDecisionOptionsHistory] = useState<string[][]>(
    []
  );
  const [decisionLoopStage, setDecisionLoopStage] =
    useState<DecisionLoopStage | null>(null);
  const [hasReturnedFromReview, setHasReturnedFromReview] = useState(false);
  const [hasInjectedRevisionPrompt, setHasInjectedRevisionPrompt] =
    useState(false);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);

  const fallbackLanguage = (lang === "en" ? "en" : "zh") as ConversationLanguage;
  const activeLanguage = conversationLanguage ?? fallbackLanguage;
  const guidedQuestions = useMemo(
    () => getGuidedQuestions(activeLanguage),
    [activeLanguage]
  );

  const currentGuidedQuestion = useMemo(
    () =>
      !isFreeMode && !isInDecisionLoop && currentQuestionIndex < guidedQuestions.length
        ? guidedQuestions[currentQuestionIndex]
        : null,
    [currentQuestionIndex, guidedQuestions, isFreeMode, isInDecisionLoop]
  );

  const appendAssistantMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content,
        createdAt: new Date(),
      },
    ]);
  }, []);

  const appendUserMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content,
        createdAt: new Date(),
      },
    ]);
  }, []);

  const rememberConversationLanguage = useCallback((text: string) => {
    setConversationLanguage((previous) => previous ?? detectConversationLanguage(text));
  }, []);

  const enterDecisionLoop = useCallback(
    (
      trail: string[] = [],
      returnedFromReview = false,
      overrides?: {
        selections?: Record<string, string>;
        notes?: string[];
        language?: ConversationLanguage;
      }
    ) => {
      const decisionQuestion = buildDecisionQuestion({
        language: overrides?.language ?? activeLanguage,
        returnedFromReview,
        selections: overrides?.selections ?? selectedAnswers,
        notes: overrides?.notes ?? freeformNotes,
        trail,
      });

      setIsInDecisionLoop(true);
      setHasReturnedFromReview(returnedFromReview);
      setDecisionTrail(trail);
      appendAssistantMessage(buildQuestionMessage(decisionQuestion));
      setDecisionOptionsHistory((prev) => [...prev, [...decisionQuestion.options]]);
    },
    [activeLanguage, appendAssistantMessage, freeformNotes, selectedAnswers]
  );

  const createProjectFromPlan = useCallback(
    async (plan: PlanStructure) => {
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, plan }),
      });

      if (!response.ok) {
        let errorMessage =
          activeLanguage === "en"
            ? "Failed to save generated plan"
            : "保存课程计划失败";
        try {
          const data = (await response.json()) as { error?: string };
          if (data.error) errorMessage = data.error;
        } catch {
          // Keep fallback.
        }
        throw new Error(errorMessage);
      }

      router.push(`/projects/${projectId}/review`);
    },
    [activeLanguage, projectId, router]
  );

  const runPlanningAI = useCallback(
    async (
      userText: string,
      options: {
        generatingPlan?: boolean;
        appendUser?: boolean;
        notesOverride?: string[];
        isFreeModeOverride?: boolean;
        isDecisionLoopOverride?: boolean;
        decisionLoopStageOverride?: DecisionLoopStage | null;
        currentQuestionIndexOverride?: number;
        selectionsOverride?: Record<string, string>;
        decisionTrailOverride?: string[];
        conversationLanguageOverride?: ConversationLanguage;
      } = {}
    ) => {
      if (!threadId) return;

      const {
        generatingPlan = false,
        appendUser = true,
        notesOverride,
        isFreeModeOverride,
        isDecisionLoopOverride,
        decisionLoopStageOverride,
        currentQuestionIndexOverride,
        selectionsOverride,
        decisionTrailOverride,
        conversationLanguageOverride,
      } = options;

      const nextLanguage = conversationLanguageOverride ?? activeLanguage;
      const nextNotes = notesOverride ?? freeformNotes;
      const nextSelections = selectionsOverride ?? selectedAnswers;
      const nextDecisionTrail = decisionTrailOverride ?? decisionTrail;
      const nextIsFreeMode = isFreeModeOverride ?? isFreeMode;
      const nextIsDecisionLoop = isDecisionLoopOverride ?? isInDecisionLoop;
      const nextDecisionLoopStage =
        decisionLoopStageOverride ?? decisionLoopStage;
      const nextQuestionIndex = currentQuestionIndexOverride ?? currentQuestionIndex;
      const nextGuidedQuestion =
        !nextIsFreeMode &&
        !nextIsDecisionLoop &&
        nextQuestionIndex < guidedQuestions.length
          ? guidedQuestions[nextQuestionIndex]
          : null;

      if (!generatingPlan && appendUser) {
        appendUserMessage(userText);
      }

      setIsLoading(true);

      try {
        const response = await postChatRequestWithRetry({
          threadId,
          message: userText,
          mode: "planning",
          context: {
            planningState: {
              currentQuestionIndex: nextQuestionIndex,
              isFreeMode: nextIsFreeMode,
              stage: nextIsDecisionLoop
                ? nextDecisionLoopStage ?? "divergence_only"
                : nextIsFreeMode
                  ? "free"
                  : "guided",
              selections: nextSelections,
              freeformNotes: nextNotes,
              decisionTrail: nextDecisionTrail,
              decisionOptionsHistory,
              pendingQuestion: nextGuidedQuestion
                ? {
                    prompt: nextGuidedQuestion.prompt,
                    options: [...nextGuidedQuestion.options],
                  }
                : null,
              hasEnoughInformation: nextIsDecisionLoop || Boolean(coursePlan),
            },
          },
        });

        if (!response.ok) {
          let errorMessage = getAssistantErrorMessage(nextLanguage);
          const responseText = await response.text();
          console.error(`[runPlanningAI] Server returned ${response.status}:`, responseText.slice(0, 500));
          try {
            const data = JSON.parse(responseText) as { error?: string };
            if (data.error) errorMessage = data.error;
          } catch {
            // Keep fallback.
          }
          throw new Error(errorMessage);
        }

        const assistantId = crypto.randomUUID();
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content: generatingPlan ? getPlanGenerationMessage(nextLanguage) : "",
            createdAt: new Date(),
          },
        ]);

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value);

          if (!generatingPlan) {
            setMessages((prev) =>
              prev.map((message) =>
                message.id === assistantId
                  ? { ...message, content: fullText }
                  : message
              )
            );
          }
        }

        const plan = extractPlan(fullText);
        const responseOptions = extractOptionsFromMessage(fullText);

        if (plan) {
          setCoursePlan(plan);
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? { ...message, content: buildPlanReadyMessage(plan, nextLanguage) }
                : message
            )
          );

          if (generatingPlan) {
            await createProjectFromPlan(plan);
          } else {
            enterDecisionLoop(nextDecisionTrail, hasReturnedFromReview, {
              notes: nextNotes,
              language: nextLanguage,
            });
          }
          return;
        }

        if (responseOptions.length === 3 && nextIsDecisionLoop) {
          const resolvedStage = inferDecisionLoopStage(
            responseOptions,
            nextLanguage,
            nextDecisionLoopStage ?? "divergence_only"
          );
          setDecisionLoopStage(resolvedStage);
          setDecisionOptionsHistory((prev) => [...prev, responseOptions]);
        }

        const cleanedText = fullText.replace(/\[PLAN_READY\]\s*$/g, "").trim();

        if (fullText.includes("[PLAN_READY]")) {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? {
                    ...message,
                    content: generatingPlan
                      ? getPlanPendingMessage(nextLanguage)
                      : cleanedText || getCreateReadyMessage(nextLanguage),
                  }
                : message
            )
          );

          if (!generatingPlan) {
            enterDecisionLoop(nextDecisionTrail, hasReturnedFromReview, {
              notes: nextNotes,
              language: nextLanguage,
            });
          }
          return;
        }

        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  content:
                    cleanedText ||
                    (generatingPlan
                      ? getPlanNotReadyMessage(nextLanguage)
                      : getAssistantErrorMessage(nextLanguage)),
                }
              : message
          )
        );
      } catch (error) {
        console.error("[runPlanningAI] Full error:", error);
        const displayMessage = isNetworkFetchError(error)
          ? getFriendlyChatNetworkError(nextLanguage)
          : error instanceof Error && error.message
            ? error.message
            : getAssistantErrorMessage(nextLanguage);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: displayMessage,
            createdAt: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
        if (generatingPlan) setIsCreating(false);
      }
    },
    [
      activeLanguage,
      appendUserMessage,
      coursePlan,
      createProjectFromPlan,
      currentQuestionIndex,
      decisionLoopStage,
      decisionOptionsHistory,
      decisionTrail,
      enterDecisionLoop,
      freeformNotes,
      guidedQuestions,
      hasReturnedFromReview,
      isFreeMode,
      isInDecisionLoop,
      selectedAnswers,
      threadId,
    ]
  );

  const handleCreateCourse = useCallback(async () => {
    if (isCreating || isLoading) return;

    if (coursePlan) {
      setIsCreating(true);
      try {
        await createProjectFromPlan(coursePlan);
      } finally {
        setIsCreating(false);
      }
      return;
    }

    if (!threadId) return;

    setIsCreating(true);
    await runPlanningAI("[GENERATE_PLAN]", {
      generatingPlan: true,
      conversationLanguageOverride: activeLanguage,
    });
  }, [
    activeLanguage,
    coursePlan,
    createProjectFromPlan,
    isCreating,
    isLoading,
    runPlanningAI,
    threadId,
  ]);

  const handleOptionSelect = useCallback(
    async (option: string) => {
      const trimmed = option.trim();
      if (!trimmed) return;

      if (isCreateCourseOption(trimmed, conversationLanguage)) {
        await handleCreateCourse();
        return;
      }

      const guidedQuestion = currentGuidedQuestion;
      const isGuidedOption =
        !isFreeMode &&
        guidedQuestion &&
        guidedQuestion.options.includes(trimmed as (typeof guidedQuestion.options)[number]);

      if (isGuidedOption) {
        appendUserMessage(trimmed);

        const nextAnswers = {
          ...selectedAnswers,
          [guidedQuestion.id]: trimmed.replace(/^[A-C][.)]\s*/, ""),
        };
        setSelectedAnswers(nextAnswers);

        const answeredGuidedCount = currentQuestionIndex + 1;
        const shouldOfferCreateNow =
          answeredGuidedCount >= MAX_GUIDED_OPTION_ROUNDS_BEFORE_CREATE ||
          currentQuestionIndex >= guidedQuestions.length - 1;

        if (shouldOfferCreateNow) {
          setCurrentQuestionIndex(answeredGuidedCount);
          setIsInDecisionLoop(true);
          setDecisionLoopStage("decision_with_create");
          setHasReturnedFromReview(false);
          setDecisionTrail([]);
          await runPlanningAI(trimmed, {
            appendUser: false,
            selectionsOverride: nextAnswers,
            notesOverride: freeformNotes,
            isFreeModeOverride: false,
            isDecisionLoopOverride: true,
            decisionLoopStageOverride: "decision_with_create",
            currentQuestionIndexOverride: answeredGuidedCount,
            decisionTrailOverride: [],
            conversationLanguageOverride: activeLanguage,
          });
          return;
        }

        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        appendAssistantMessage(buildQuestionMessage(guidedQuestions[nextIndex]));
        return;
      }

      if (isInDecisionLoop) {
        appendUserMessage(trimmed);
        const nextTrail = [...decisionTrail, trimmed];
        setDecisionTrail(nextTrail);
        const nextDecisionStage: DecisionLoopStage =
          decisionLoopStage === "decision_with_create"
            ? "divergence_only"
            : "decision_with_create";
        setDecisionLoopStage(nextDecisionStage);
        setHasReturnedFromReview(false);
        await runPlanningAI(trimmed, {
          appendUser: false,
          notesOverride: freeformNotes,
          isFreeModeOverride: false,
          isDecisionLoopOverride: true,
          decisionLoopStageOverride: nextDecisionStage,
          currentQuestionIndexOverride: currentQuestionIndex,
          selectionsOverride: selectedAnswers,
          decisionTrailOverride: nextTrail,
          conversationLanguageOverride: activeLanguage,
        });
        return;
      }

      await runPlanningAI(trimmed, {
        conversationLanguageOverride: activeLanguage,
      });
    },
    [
      activeLanguage,
      appendAssistantMessage,
      appendUserMessage,
      conversationLanguage,
      currentGuidedQuestion,
      currentQuestionIndex,
      decisionLoopStage,
      decisionTrail,
      freeformNotes,
      guidedQuestions,
      handleCreateCourse,
      isFreeMode,
      isInDecisionLoop,
      runPlanningAI,
      selectedAnswers,
    ]
  );

  const handleSend = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const nextLanguage = conversationLanguage ?? detectConversationLanguage(trimmed);
      rememberConversationLanguage(trimmed);

      if (isInDecisionLoop) {
        appendUserMessage(trimmed);
        const nextNotes = [...freeformNotes, trimmed];
        setFreeformNotes(nextNotes);
        setHasReturnedFromReview(false);
        await runPlanningAI(trimmed, {
          appendUser: false,
          notesOverride: nextNotes,
          isFreeModeOverride: false,
          isDecisionLoopOverride: true,
          decisionLoopStageOverride: decisionLoopStage ?? "divergence_only",
          currentQuestionIndexOverride: currentQuestionIndex,
          selectionsOverride: selectedAnswers,
          decisionTrailOverride: decisionTrail,
          conversationLanguageOverride: nextLanguage,
        });
        return;
      }

      const guidedQuestion = currentGuidedQuestion;
      const isGuidedOption =
        !isFreeMode &&
        guidedQuestion &&
        guidedQuestion.options.includes(trimmed as (typeof guidedQuestion.options)[number]);

      if (isGuidedOption) {
        await handleOptionSelect(trimmed);
        return;
      }

      setIsFreeMode(true);
      const nextNotes = [...freeformNotes, trimmed];
      setFreeformNotes(nextNotes);
      await runPlanningAI(trimmed, {
        notesOverride: nextNotes,
        conversationLanguageOverride: nextLanguage,
      });
    },
    [
      appendUserMessage,
      conversationLanguage,
      currentGuidedQuestion,
      currentQuestionIndex,
      decisionLoopStage,
      decisionTrail,
      freeformNotes,
      handleOptionSelect,
      isFreeMode,
      isInDecisionLoop,
      rememberConversationLanguage,
      runPlanningAI,
      selectedAnswers,
    ]
  );

  useEffect(() => {
    fetch(`/api/projects/${projectId}/thread`)
      .then((response) => response.json())
      .then((data) => {
        if (data.threadId) setThreadId(data.threadId);

        const loadedConversationLanguage =
          (data.conversationLanguage as ConversationLanguage | null) ??
          (() => {
            const firstUserMessage = ((data.messages ?? []) as Array<{
              role: string;
              content: string;
            }>).find(
              (message) =>
                message.role === "user" && message.content !== "[GENERATE_PLAN]"
            );

            return firstUserMessage
              ? detectConversationLanguage(firstUserMessage.content)
              : null;
          })();

        if (loadedConversationLanguage) {
          setConversationLanguage(loadedConversationLanguage);
        }

        const loadedMessages = ((data.messages ?? []) as Array<{
          id: string;
          role: string;
          content: string;
          createdAt: string;
        }>)
          .filter(
            (message) =>
              !(message.role === "user" && message.content === "[GENERATE_PLAN]")
          )
          .map((message) =>
            sanitizeAssistantMessage(
              {
                id: message.id,
                role: message.role as ChatMessage["role"],
                content: message.content,
                createdAt: new Date(message.createdAt),
              },
              loadedConversationLanguage ?? fallbackLanguage
            )
          );

        const loadedPlan =
          ((data.messages ?? []) as Array<{ content: string }>)
            .map((message) => extractPlan(message.content))
            .find(Boolean) || null;

        const lastAssistantOptions = [...loadedMessages]
          .reverse()
          .find((message) => message.role === "assistant");

        const inferredStageFromMessages = lastAssistantOptions
          ? inferDecisionLoopStage(
              extractOptionsFromMessage(lastAssistantOptions.content),
              loadedConversationLanguage ?? fallbackLanguage,
              "decision_with_create"
            )
          : null;

        if (loadedPlan) {
          setCoursePlan(loadedPlan);
          setIsInDecisionLoop(true);
          setDecisionLoopStage(inferredStageFromMessages ?? "decision_with_create");
        }

        if (loadedMessages.length > 0 && !isRevising) {
          setMessages(loadedMessages);
          setIsFreeMode(true);
          if (inferredStageFromMessages) {
            setIsInDecisionLoop(true);
            setDecisionLoopStage(inferredStageFromMessages);
          }
        }
      });
  }, [fallbackLanguage, isRevising, projectId]);

  useEffect(() => {
    if (!isRevising || hasInjectedRevisionPrompt) return;

    setMessages([]);
    setCoursePlan(null);
    setIsFreeMode(false);
    setIsInDecisionLoop(false);
    setDecisionLoopStage("decision_with_create");
    setDecisionTrail([]);
    setHasReturnedFromReview(true);
    setHasInjectedRevisionPrompt(true);
    router.replace(`/projects/${projectId}/plan`);
    enterDecisionLoop([], true, { language: activeLanguage });
  }, [
    activeLanguage,
    enterDecisionLoop,
    hasInjectedRevisionPrompt,
    isRevising,
    projectId,
    router,
  ]);

  useEffect(() => {
    if (!initialPrompt || !threadId || hasAutoStarted || isRevising) return;
    if (messages.length > 0) return;

    setHasAutoStarted(true);
    void handleSend(initialPrompt);
  }, [
    handleSend,
    hasAutoStarted,
    initialPrompt,
    isRevising,
    messages.length,
    threadId,
  ]);

  const suggestions =
    t("plan.placeholder") === "Tell AI what you want to learn..."
      ? [
          "Learn AI Agent development",
          "Plan a Power Electronics course",
          "React full-stack development",
          "System Design intro to advanced",
        ]
      : [
          "我想学习 AI Agent 开发",
          "帮我规划电力电子学课程",
          "我想学 React 全栈开发",
          "系统设计入门到进阶",
        ];

  const canCreateCourse =
    decisionLoopStage === "decision_with_create" || Boolean(coursePlan);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <div>
          <h1 className="font-semibold">{t("plan.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("plan.subtitle")}</p>
        </div>
        <Button
          onClick={handleCreateCourse}
          disabled={!canCreateCourse || isLoading || isCreating}
          className={
            decisionLoopStage === "decision_with_create" && !isCreating
              ? "animate-pulse-glow"
              : ""
          }
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {activeLanguage === "en" ? "Creating..." : "创建中..."}
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {getCreateCourseLabel(activeLanguage)}
            </>
          )}
        </Button>
      </div>

      {isInDecisionLoop && !isCreating && decisionLoopStage && (
        <div className="border-b border-primary/30 bg-primary/10 px-4 py-3 text-center">
          <p className="text-sm font-medium text-primary">
            {getDecisionBannerText(decisionLoopStage, activeLanguage)}
          </p>
        </div>
      )}

      {!isCreating && (
        <div className="border-b border-border/30 bg-muted/20 px-4 py-2 text-center text-xs text-muted-foreground">
          {conversationLanguage ? getPlanHint(activeLanguage) : t("plan.hint")}
        </div>
      )}

      <ChatPanel
        messages={messages}
        onSend={handleSend}
        onOptionSelect={handleOptionSelect}
        isLoading={isLoading}
        placeholder={
          conversationLanguage
            ? getPlanPlaceholder(activeLanguage)
            : t("plan.placeholder")
        }
        suggestions={messages.length === 0 ? suggestions : undefined}
        className="flex-1"
        animatePrimaryOption={
          decisionLoopStage === "decision_with_create" && !isLoading
        }
      />
    </main>
  );
}
