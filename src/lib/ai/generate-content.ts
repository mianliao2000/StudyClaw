import { prisma } from "@/lib/db";
import { getAIProvider } from "@/lib/ai/provider";
import {
  CONTENT_GENERATION_PROMPT,
  SUMMARY_GENERATION_PROMPT,
  QUIZ_GENERATION_PROMPT,
  fillTemplate,
  getContentDetailInstruction,
} from "@/lib/ai/prompts";

const SUMMARY_CHAPTER_TITLE_ZH = "课程总结";
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
    zh: zhMatch?.[1]?.trim() || result.trim(),
    en: enMatch?.[1]?.trim() || result.trim(),
  };
}

/**
 * Generate content for a single LessonContent record (zh primary).
 * Saves both zh and en versions to the database.
 * Throws on failure after marking the content as "error".
 */
export async function generateContentById(
  contentId: string,
  userPrefs?: { contentDetail?: string; quizCount?: number } | null,
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
            `# ${item.subchapter.chapter.title} / ${item.subchapter.title}\n${item.body}`
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
        throw new Error("Main content not ready");
      }

      vars.lessonContent =
        isSummaryChapter && courseWideLessonContent
          ? courseWideLessonContent
          : mainContent.body;
      prompt =
        content.contentType === "summary"
          ? fillTemplate(SUMMARY_GENERATION_PROMPT, vars)
          : fillTemplate(QUIZ_GENERATION_PROMPT, vars);
    }

    const result = await provider.generate([{ role: "user", content: prompt }]);
    const { zh, en } = parseBilingualOutput(result);

    await prisma.lessonContent.update({
      where: { id: contentId },
      data: { body: zh, status: "ready", lang: "zh" },
    });

    await prisma.lessonContent.upsert({
      where: {
        subchapterId_contentType_lang: {
          subchapterId: subchapter.id,
          contentType: content.contentType,
          lang: "en",
        },
      },
      update: { body: en, status: "ready" },
      create: {
        subchapterId: subchapter.id,
        contentType: content.contentType,
        lang: "en",
        body: en,
        status: "ready",
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
