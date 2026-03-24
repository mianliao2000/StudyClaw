import type { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateContentById } from "@/lib/ai/generate-content";
import { NextResponse } from "next/server";
import type { PlanStructure } from "@/types";

// POST /api/projects - 创建新项目（规划阶段）
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { title, topic } = await req.json();

  const project = await prisma.learningProject.create({
    data: {
      userId: session.user.id,
      title: title || "新学习项目",
      topic: topic || "待定",
      status: "planning",
      chatThreads: {
        create: { mode: "planning" },
      },
    },
    include: { chatThreads: true },
  });

  // 清理该用户超过 24 小时的孤立 planning 项目（无章节）
  await prisma.learningProject.deleteMany({
    where: {
      userId: session.user.id,
      status: "planning",
      chapters: { none: {} },
      createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });

  return NextResponse.json(project);
}

// PUT /api/projects - 确认计划，生成项目结构
export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { projectId, plan }: { projectId: string; plan: PlanStructure } =
    await req.json();

  // 验证项目归属
  const project = await prisma.learningProject.findFirst({
    where: { id: projectId, userId: session.user.id },
  });

  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  let updated;
  try {
    // 事务：更新项目 + 创建章节结构 + 创建内容占位
    updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 更新项目信息
      await tx.learningProject.update({
        where: { id: projectId },
        data: {
          title: plan.title,
          titleEn: plan.titleEn,
          topic: plan.topic,
          topicEn: plan.topicEn,
          description: plan.description,
          descriptionEn: plan.descriptionEn,
          goals: JSON.stringify(plan.goals),
          goalsEn: plan.goalsEn ? JSON.stringify(plan.goalsEn) : null,
          status: "active",
        },
      });

      // 创建章节和子章节
      for (let ci = 0; ci < plan.chapters.length; ci++) {
        const ch = plan.chapters[ci];
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

          for (const contentType of ["main", "summary", "quiz"]) {
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

      await tx.progressState.create({
        data: { projectId },
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
    });
  } catch (error) {
    console.error("Project save error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to save project plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // Fire background generation for chapter 1 (don't await — return immediately)
  if (updated && updated.chapters.length > 0) {
    const firstChapter = updated.chapters[0];
    const contentIds: string[] = firstChapter.subchapters.flatMap((sub) =>
      (["main", "summary", "quiz"] as const).map((type) => {
        const c = sub.contents.find((c) => c.contentType === type && c.lang === "zh");
        return c?.id;
      }).filter((id): id is string => Boolean(id))
    );

    void (async () => {
      for (const id of contentIds) {
        try {
          await generateContentById(id);
        } catch (err) {
          console.error(`Background generation failed for ${id}:`, err);
        }
      }
    })();
  }

  return NextResponse.json(updated);
}
