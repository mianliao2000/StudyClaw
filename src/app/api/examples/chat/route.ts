import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  detectConversationLanguage,
  type ConversationLanguage,
} from "@/lib/ai/conversation-language";
import { resolveModelForReasoning } from "@/lib/ai/model-routing";
import { fillTemplate, getTutoringSystemPrompt } from "@/lib/ai/prompts";
import { getAIProvider, getActiveProviderInfo, type AIMessage } from "@/lib/ai/provider";
import {
  resolveReasoningForTask,
  type ReasoningLevel,
} from "@/lib/ai/reasoning";
import { getUserPreferencesOrDefault } from "@/lib/user-preferences";
import { getExampleLessonBySlugs } from "@/lib/examples/catalog";
import type { ContentType } from "@/types";

type ExampleHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

function getUnavailableMessage(language: ConversationLanguage) {
  return language === "en"
    ? "AI service is temporarily unavailable. Please check the server configuration."
    : "AI 服务暂时不可用，请检查服务器配置。";
}

function buildCanonicalLessonContext(
  lessonType: ContentType,
  mainLessonBody: string,
  currentLessonBody: string,
  language: ConversationLanguage
) {
  if (lessonType === "main") {
    return mainLessonBody;
  }

  const label =
    lessonType === "summary"
      ? language === "en"
        ? "Current summary content"
        : "当前总结内容"
      : language === "en"
        ? "Current quiz content"
        : "当前测验内容";

  return `${mainLessonBody}\n\n## ${label}\n\n${currentLessonBody}`;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const {
    courseSlug,
    chapterSlug,
    subchapterSlug,
    lessonType,
    message,
    history,
    model,
    reasoning,
  } = (await req.json().catch(() => ({}))) as {
    courseSlug?: string;
    chapterSlug?: string;
    subchapterSlug?: string;
    lessonType?: ContentType;
    message?: string;
    history?: ExampleHistoryItem[];
    model?: string;
    reasoning?: ReasoningLevel;
  };

  if (
    !courseSlug ||
    !chapterSlug ||
    !subchapterSlug ||
    !lessonType ||
    !["main", "summary", "quiz"].includes(lessonType)
  ) {
    return NextResponse.json({ error: "Invalid example lesson." }, { status: 400 });
  }

  const trimmedMessage = message?.trim();
  if (!trimmedMessage) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const exampleLesson = getExampleLessonBySlugs(
    courseSlug,
    chapterSlug,
    subchapterSlug,
    lessonType
  );

  if (!exampleLesson) {
    return NextResponse.json({ error: "Example lesson not found." }, { status: 404 });
  }

  const sanitizedHistory = Array.isArray(history)
    ? history
        .filter(
          (item): item is ExampleHistoryItem =>
            (item.role === "user" || item.role === "assistant") &&
            typeof item.content === "string" &&
            item.content.trim().length > 0
        )
        .slice(-8)
        .map((item) => ({
          role: item.role,
          content: item.content.trim().slice(0, 4000),
        }))
    : [];

  const languageSource =
    trimmedMessage ||
    sanitizedHistory.find((item) => item.role === "user")?.content ||
    exampleLesson.course.title;
  const conversationLanguage = detectConversationLanguage(languageSource);

  const userPrefs = await getUserPreferencesOrDefault(userId, {
    teachingStyle: true,
    reasoningLevel: true,
  });

  const useEnglishContent = conversationLanguage === "en";
  const courseTitle =
    useEnglishContent && exampleLesson.course.titleEn
      ? exampleLesson.course.titleEn
      : exampleLesson.course.title;
  const chapterTitle =
    useEnglishContent && exampleLesson.chapter.titleEn
      ? exampleLesson.chapter.titleEn
      : exampleLesson.chapter.title;
  const subchapterTitle =
    useEnglishContent && exampleLesson.subchapter.titleEn
      ? exampleLesson.subchapter.titleEn
      : exampleLesson.subchapter.title;
  const learningObjective =
    useEnglishContent && exampleLesson.subchapter.learningObjectiveEn
      ? exampleLesson.subchapter.learningObjectiveEn
      : exampleLesson.subchapter.learningObjective;
  const mainLessonBody =
    useEnglishContent && exampleLesson.subchapter.lessons.main.bodyEn
      ? exampleLesson.subchapter.lessons.main.bodyEn
      : exampleLesson.subchapter.lessons.main.body;
  const currentLessonBody =
    useEnglishContent && exampleLesson.lesson.bodyEn
      ? exampleLesson.lesson.bodyEn
      : exampleLesson.lesson.body;

  const canonicalLessonContent = buildCanonicalLessonContext(
    lessonType,
    mainLessonBody,
    currentLessonBody,
    conversationLanguage
  );

  const systemPrompt = fillTemplate(
    getTutoringSystemPrompt(conversationLanguage, userPrefs?.teachingStyle),
    {
      projectTitle: courseTitle,
      chapterTitle,
      subchapterTitle,
      learningObjective,
      lessonContent: canonicalLessonContent.slice(0, 4000),
    }
  );

  const aiMessages: AIMessage[] = [
    { role: "system", content: systemPrompt },
    ...sanitizedHistory.map((item) => ({
      role: item.role,
      content: item.content,
    })),
    { role: "user", content: trimmedMessage.slice(0, 4000) },
  ];

  try {
    const provider = getAIProvider();
    const explicitReasoning =
      reasoning === "low" || reasoning === "medium" || reasoning === "high"
        ? reasoning
        : undefined;
    const resolvedReasoning = resolveReasoningForTask({
      task: "tutoring-chat",
      userPreference: userPrefs?.reasoningLevel,
      explicitReasoning,
    });
    const resolvedModel = resolveModelForReasoning({
      explicitModel: model,
      reasoning: resolvedReasoning,
    });
    const activeProvider = getActiveProviderInfo();

    console.log(
      `[AI example chat] provider=${activeProvider.provider} model=${resolvedModel || activeProvider.defaultModel || "unknown"} reasoning=${resolvedReasoning || "default"} course=${courseSlug} lesson=${lessonType}`
    );

    const stream = await provider.chat(aiMessages, {
      model: resolvedModel,
      reasoning: resolvedReasoning,
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Example AI chat error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : getUnavailableMessage(conversationLanguage),
      },
      { status: 500 }
    );
  }
}
