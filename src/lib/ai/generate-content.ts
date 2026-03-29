import { prisma } from "@/lib/db";
import { getAIProvider } from "@/lib/ai/provider";
import {
  CONTENT_GENERATION_PROMPT,
  SUMMARY_GENERATION_PROMPT,
  QUIZ_GENERATION_PROMPT,
  DIAGRAM_CODE_GENERATION_PROMPT,
  fillTemplate,
  getContentDetailInstruction,
} from "@/lib/ai/prompts";
import { executePythonForDiagram, extractPythonCode } from "@/lib/ai/execute-python";
import { normalizeMarkdownMath } from "@/lib/markdown-math";
import { resolveModelForReasoning } from "@/lib/ai/model-routing";
import { resolveReasoningForTask } from "@/lib/ai/reasoning";

const SUMMARY_CHAPTER_TITLE_ZH = "\u8bfe\u7a0b\u603b\u7ed3";
const SUMMARY_CHAPTER_TITLE_EN = "Course Summary";

function isCourseSummaryChapter(chapter: { title: string; titleEn?: string | null }) {
  return (
    chapter.title === SUMMARY_CHAPTER_TITLE_ZH ||
    chapter.titleEn === SUMMARY_CHAPTER_TITLE_EN
  );
}

function parseBilingualOutput(result: string): { zh: string; en: string } {
  const zhMatch = result.match(/---LANG:zh---\s*([\s\S]*?)(?:---LANG:en---|$)/);
  const enMatch = result.match(/---LANG:en---\s*([\s\S]*?)$/);
  return {
    zh: normalizeMarkdownMath(zhMatch?.[1]?.trim() || result.trim()),
    en: normalizeMarkdownMath(enMatch?.[1]?.trim() || result.trim()),
  };
}

/**
 * Generate content for a single LessonContent record (zh primary).
 * Saves both zh and en versions to the database.
 * Throws on failure after marking the content as "error".
 */
export async function generateContentById(
  contentId: string,
  userPrefs?: {
    contentDetail?: string;
    quizCount?: number;
    reasoningLevel?: string;
  } | null,
): Promise<{ zh: string; en: string }> {
  const content = await prisma.lessonContent.findUnique({
    where: { id: contentId },
    include: {
      subchapter: {
        include: {
          chapter: { include: { project: true } },
        },
      },
    },
  });

  if (!content) throw new Error(`Content not found: ${contentId}`);

  await prisma.lessonContent.update({
    where: { id: contentId },
    data: { status: "generating" },
  });

  try {
    const provider = getAIProvider();
    const project = content.subchapter.chapter.project;
    const chapter = content.subchapter.chapter;
    const subchapter = content.subchapter;
    const isSummaryChapter = isCourseSummaryChapter(chapter);

    let prompt: string;
    const vars: Record<string, string> = {
      projectTitle: project.title,
      topic: project.topic,
      chapterTitle: chapter.title,
      subchapterTitle: subchapter.title,
      learningObjective: subchapter.learningObjective || "",
      lessonContent: "",
      contentDetailInstruction: getContentDetailInstruction(userPrefs?.contentDetail),
      quizCount: String(userPrefs?.quizCount ?? 5),
    };

    let courseWideLessonContent = "";
    if (isSummaryChapter) {
      const courseMainContents = await prisma.lessonContent.findMany({
        where: {
          contentType: "main",
          lang: "zh",
          status: "ready",
          subchapter: {
            chapter: {
              projectId: project.id,
              title: { not: SUMMARY_CHAPTER_TITLE_ZH },
            },
          },
        },
        include: {
          subchapter: {
            include: {
              chapter: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      courseWideLessonContent = courseMainContents
        .map(
          (item) =>
            `# ${item.subchapter.chapter.title} / ${item.subchapter.title}\n${normalizeMarkdownMath(item.body)}`,
        )
        .join("\n\n")
        .slice(0, 12000);
    }

    if (content.contentType === "main") {
      if (isSummaryChapter) {
        vars.lessonContent = courseWideLessonContent;
      }
      prompt = fillTemplate(CONTENT_GENERATION_PROMPT, vars);
    } else {
      const mainContent = await prisma.lessonContent.findFirst({
        where: {
          subchapterId: subchapter.id,
          contentType: "main",
          lang: "zh",
          status: "ready",
        },
      });

      if (!mainContent) {
        await prisma.lessonContent.update({
          where: { id: contentId },
          data: { status: "error" },
        });
        throw new Error("MAIN_NOT_READY");
      }

      vars.lessonContent =
        isSummaryChapter && courseWideLessonContent
          ? courseWideLessonContent
          : normalizeMarkdownMath(mainContent.body);

      prompt =
        content.contentType === "summary"
          ? fillTemplate(SUMMARY_GENERATION_PROMPT, vars)
          : fillTemplate(QUIZ_GENERATION_PROMPT, vars);
    }

    const reasoningTask =
      content.contentType === "main"
        ? "lesson-main"
        : content.contentType === "summary"
          ? "lesson-summary"
          : "lesson-quiz";

    const resolvedReasoning = resolveReasoningForTask({
      task: reasoningTask,
      userPreference: userPrefs?.reasoningLevel,
    });

    const result = await provider.generate([{ role: "user", content: prompt }], {
      model: resolveModelForReasoning({ reasoning: resolvedReasoning }),
      reasoning: resolvedReasoning,
    });
    const { zh, en } = parseBilingualOutput(result);

    // Only main lesson content may optionally receive a diagram.
    let diagramBase64: string | null = null;
    if (content.contentType === "main") {
      try {
        const diagramPrompt = fillTemplate(DIAGRAM_CODE_GENERATION_PROMPT, {
          lessonTitle: subchapter.title,
          lessonContent: zh,
          diagramLang: "Chinese",
        });

        const diagramResult = await provider.generate(
          [{ role: "user", content: diagramPrompt }],
          { model: resolveModelForReasoning({ reasoning: "low" }) },
        );

        const trimmed = diagramResult.trim();
        const pythonCode = trimmed === "NO_DIAGRAM" ? null : extractPythonCode(trimmed);

        if (pythonCode) {
          const imageBuffer = await executePythonForDiagram(pythonCode);
          if (imageBuffer) {
            diagramBase64 = imageBuffer.toString("base64");
          }
        }
      } catch (error) {
        console.error("[generateContentById] Diagram generation failed:", error);
        // Keep the lesson content even if the optional diagram fails.
      }
    }

    const storedDiagramBase64 = content.contentType === "main" ? diagramBase64 : null;

    await prisma.lessonContent.update({
      where: { id: contentId },
      data: {
        body: zh,
        status: "ready",
        lang: "zh",
        diagramBase64: storedDiagramBase64,
      },
    });

    await prisma.lessonContent.upsert({
      where: {
        subchapterId_contentType_lang: {
          subchapterId: subchapter.id,
          contentType: content.contentType,
          lang: "en",
        },
      },
      update: {
        body: en,
        status: "ready",
        diagramBase64: storedDiagramBase64,
      },
      create: {
        subchapterId: subchapter.id,
        contentType: content.contentType,
        lang: "en",
        body: en,
        status: "ready",
        diagramBase64: storedDiagramBase64,
      },
    });

    return { zh, en };
  } catch (error) {
    await prisma.lessonContent.update({
      where: { id: contentId },
      data: { status: "error" },
    });
    throw error;
  }
}
