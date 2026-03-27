import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import type { PlanStructure } from "@/types";

type ProjectTransactionClient = Pick<
  typeof prisma,
  | "learningProject"
  | "chapter"
  | "subchapter"
  | "lessonContent"
  | "projectChatThread"
  | "progressState"
>;

const SUMMARY_CHAPTER_TITLE_ZH = "课程总结";
const SUMMARY_CHAPTER_TITLE_EN = "Course Summary";

function ensureCourseSummaryChapter(plan: PlanStructure): PlanStructure {
  const filteredChapters = plan.chapters.filter(
    (chapter) =>
      chapter.title !== SUMMARY_CHAPTER_TITLE_ZH &&
      chapter.titleEn !== SUMMARY_CHAPTER_TITLE_EN
  );

  return {
    ...plan,
    chapters: [
      ...filteredChapters,
      {
        title: SUMMARY_CHAPTER_TITLE_ZH,
        titleEn: SUMMARY_CHAPTER_TITLE_EN,
        subchapters: [
          {
            title: "总结回顾",
            titleEn: "Course Review",
            learningObjective:
              "系统回顾整门课程的核心概念、关键方法、常见误区与实践重点。",
            learningObjectiveEn:
              "Review the full course, including core concepts, key methods, common pitfalls, and practical priorities.",
          },
          {
            title: "综合测验",
            titleEn: "Comprehensive Quiz",
            learningObjective:
              "通过覆盖整门课程范围的综合测验，检验你对整体知识体系的掌握情况。",
            learningObjectiveEn:
              "Validate your understanding of the entire course with a comprehensive quiz that spans the full curriculum.",
          },
        ],
      },
    ],
  };
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { title, topic } = await req.json();

  const project = await prisma.learningProject.create({
    data: {
      userId: session.user.id,
      title: title || "New Learning Project",
      topic: topic || "TBD",
      status: "planning",
      chatThreads: {
        create: { mode: "planning" },
      },
    },
    include: { chatThreads: true },
  });

  void prisma.learningProject.deleteMany({
    where: {
      userId: session.user.id,
      status: "planning",
      chapters: { none: {} },
      createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  }).catch((error) => {
    console.error("Stale planning project cleanup failed:", error);
  });

  return NextResponse.json(project);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { projectId, plan }: { projectId: string; plan: PlanStructure } =
    await req.json();
  const normalizedPlan = ensureCourseSummaryChapter(plan);

  const project = await prisma.learningProject.findFirst({
    where: { id: projectId, userId: session.user.id },
  });

  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  let updated;
  try {
    updated = await prisma.$transaction(
      async (tx: ProjectTransactionClient) => {
        await tx.projectChatThread.deleteMany({
          where: { projectId, mode: "tutoring" },
        });

        await tx.chapter.deleteMany({
          where: { projectId },
        });

        await tx.learningProject.update({
          where: { id: projectId },
          data: {
            title: normalizedPlan.title,
            titleEn: normalizedPlan.titleEn,
            topic: normalizedPlan.topic,
            topicEn: normalizedPlan.topicEn,
            description: normalizedPlan.description,
            descriptionEn: normalizedPlan.descriptionEn,
            goals: JSON.stringify(normalizedPlan.goals),
            goalsEn: normalizedPlan.goalsEn
              ? JSON.stringify(normalizedPlan.goalsEn)
              : null,
            status: "planning",
          },
        });

        for (let ci = 0; ci < normalizedPlan.chapters.length; ci++) {
          const ch = normalizedPlan.chapters[ci];
          const chapter = await tx.chapter.create({
            data: {
              projectId,
              title: ch.title,
              titleEn: ch.titleEn,
              orderIndex: ci,
            },
          });

          for (let si = 0; si < ch.subchapters.length; si++) {
            const sub = ch.subchapters[si];
            const subchapter = await tx.subchapter.create({
              data: {
                chapterId: chapter.id,
                title: sub.title,
                titleEn: sub.titleEn,
                orderIndex: si,
                learningObjective: sub.learningObjective,
                learningObjectiveEn: sub.learningObjectiveEn,
              },
            });

            for (const contentType of ["main", "summary", "quiz"] as const) {
              await tx.lessonContent.create({
                data: {
                  subchapterId: subchapter.id,
                  contentType,
                  status: "pending",
                },
              });
            }

            await tx.projectChatThread.create({
              data: {
                projectId,
                mode: "tutoring",
                relatedSubchapterId: subchapter.id,
              },
            });
          }
        }

        await tx.progressState.upsert({
          where: { projectId },
          update: {
            currentChapterId: null,
            currentSubchapterId: null,
            completedItems: "[]",
            completionPercent: 0,
          },
          create: { projectId },
        });

        return tx.learningProject.findUnique({
          where: { id: projectId },
          include: {
            chapters: {
              orderBy: { orderIndex: "asc" },
              include: {
                subchapters: {
                  orderBy: { orderIndex: "asc" },
                  include: { contents: true },
                },
              },
            },
          },
        });
      }
    );
  } catch (error) {
    console.error("Project save error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to save project plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json(updated);
}
