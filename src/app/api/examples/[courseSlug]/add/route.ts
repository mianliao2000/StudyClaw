import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getExampleCourseBySlug } from "@/lib/examples/catalog";
import type { ContentType } from "@/types";

type AddExampleRequest = {
  chapterSlug?: string;
  subchapterSlug?: string;
  lessonType?: ContentType;
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseSlug: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const { courseSlug } = await params;
  const course = getExampleCourseBySlug(courseSlug);

  if (!course) {
    return NextResponse.json({ error: "Example course not found." }, { status: 404 });
  }

  const body = (await req.json().catch(() => ({}))) as AddExampleRequest;
  const hasTarget =
    body.chapterSlug !== undefined ||
    body.subchapterSlug !== undefined ||
    body.lessonType !== undefined;

  if (
    hasTarget &&
    (!body.chapterSlug ||
      !body.subchapterSlug ||
      !body.lessonType ||
      !["main", "summary", "quiz"].includes(body.lessonType))
  ) {
    return NextResponse.json({ error: "Invalid target lesson." }, { status: 400 });
  }

  const targetChapter = body.chapterSlug
    ? course.chapters.find((chapter) => chapter.slug === body.chapterSlug)
    : null;
  const targetSubchapter =
    targetChapter && body.subchapterSlug
      ? targetChapter.subchapters.find(
          (subchapter) => subchapter.slug === body.subchapterSlug
        )
      : null;

  if (hasTarget && (!targetChapter || !targetSubchapter)) {
    return NextResponse.json({ error: "Target lesson not found." }, { status: 404 });
  }

  const firstChapter = course.chapters[0];
  const firstSubchapter = firstChapter?.subchapters[0];

  if (!firstChapter || !firstSubchapter) {
    return NextResponse.json({ error: "Example course is incomplete." }, { status: 400 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const project = await tx.learningProject.create({
      data: {
        userId,
        title: course.title,
        titleEn: course.titleEn ?? null,
        topic: course.topic,
        topicEn: course.topicEn ?? null,
        description: course.description,
        descriptionEn: course.descriptionEn ?? null,
        goals: JSON.stringify(course.goals),
        goalsEn: JSON.stringify(course.goalsEn ?? []),
        status: "active",
      },
      select: { id: true },
    });

    const subchapterRouteMap = new Map<
      string,
      { chapterId: string; subchapterId: string }
    >();
    let firstChapterId = "";
    let firstSubchapterId = "";

    for (const chapter of course.chapters) {
      const createdChapter = await tx.chapter.create({
        data: {
          projectId: project.id,
          title: chapter.title,
          titleEn: chapter.titleEn ?? null,
          orderIndex: chapter.orderIndex,
        },
      });

      if (!firstChapterId) {
        firstChapterId = createdChapter.id;
      }

      for (const subchapter of chapter.subchapters) {
        const createdSubchapter = await tx.subchapter.create({
          data: {
            chapterId: createdChapter.id,
            title: subchapter.title,
            titleEn: subchapter.titleEn ?? null,
            orderIndex: subchapter.orderIndex,
            learningObjective: subchapter.learningObjective,
            learningObjectiveEn: subchapter.learningObjectiveEn ?? null,
          },
        });

        if (!firstSubchapterId) {
          firstSubchapterId = createdSubchapter.id;
        }

        subchapterRouteMap.set(`${chapter.slug}:${subchapter.slug}`, {
          chapterId: createdChapter.id,
          subchapterId: createdSubchapter.id,
        });

        const lessonRows = (["main", "summary", "quiz"] as const).flatMap((type) => {
          const lesson = subchapter.lessons[type];
          const rows = [
            {
              subchapterId: createdSubchapter.id,
              contentType: type,
              lang: "zh",
              body: lesson.body,
              status: "ready",
              diagramBase64: lesson.diagramBase64 ?? null,
            },
          ];

          if (lesson.bodyEn) {
            rows.push({
              subchapterId: createdSubchapter.id,
              contentType: type,
              lang: "en",
              body: lesson.bodyEn,
              status: "ready",
              diagramBase64: lesson.diagramBase64 ?? null,
            });
          }

          return rows;
        });

        await tx.lessonContent.createMany({
          data: lessonRows,
        });

        await tx.projectChatThread.create({
          data: {
            projectId: project.id,
            mode: "tutoring",
            relatedSubchapterId: createdSubchapter.id,
          },
        });
      }
    }

    await tx.progressState.create({
      data: {
        projectId: project.id,
        currentChapterId: firstChapterId,
        currentSubchapterId: firstSubchapterId,
        completedItems: JSON.stringify([]),
        quizScores: JSON.stringify({}),
        completionPercent: 0,
      },
    });

    return {
      projectId: project.id,
      firstChapterId,
      firstSubchapterId,
      subchapterRouteMap,
    };
  });

  if (hasTarget && body.chapterSlug && body.subchapterSlug && body.lessonType) {
    const targetIds = result.subchapterRouteMap.get(
      `${body.chapterSlug}:${body.subchapterSlug}`
    );

    if (!targetIds) {
      return NextResponse.json({ error: "Target lesson not found." }, { status: 404 });
    }

    return NextResponse.json({
      redirectTo: `/projects/${result.projectId}/chapters/${targetIds.chapterId}/subchapters/${targetIds.subchapterId}/${body.lessonType}`,
    });
  }

  return NextResponse.json({
    redirectTo: `/projects/${result.projectId}`,
  });
}
