import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { contentId, projectId, quizScore, chapterId, subchapterId, trackOnly } = (await req.json()) as {
    contentId?: string;
    projectId?: string;
    quizScore?: number; // 0-100 percentage
    chapterId?: string;
    subchapterId?: string;
    trackOnly?: boolean;
  };

  if (!contentId || !projectId) {
    return Response.json({ error: "Missing contentId or projectId" }, { status: 400 });
  }

  // Verify the project belongs to this user
  const project = await prisma.learningProject.findFirst({
    where: { id: projectId, userId: session.user.id },
    include: {
      progress: true,
      chapters: {
        include: {
          subchapters: {
            include: { contents: { select: { id: true } } },
          },
        },
      },
    },
  });

  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  // Verify contentId belongs to this project
  const allContentIds = project.chapters.flatMap((ch) =>
    ch.subchapters.flatMap((sc) => sc.contents.map((c) => c.id))
  );
  if (!allContentIds.includes(contentId)) {
    return Response.json({ error: "Content not in project" }, { status: 400 });
  }

  const existing: string[] = project.progress?.completedItems
    ? JSON.parse(project.progress.completedItems)
    : [];

  if (trackOnly) {
    await prisma.progressState.upsert({
      where: { projectId },
      update: {
        currentChapterId: chapterId ?? project.progress?.currentChapterId ?? null,
        currentSubchapterId: subchapterId ?? project.progress?.currentSubchapterId ?? null,
        lastVisitedAt: new Date(),
      },
      create: {
        projectId,
        completedItems: JSON.stringify(existing),
        quizScores: JSON.stringify(project.progress?.quizScores ? JSON.parse(project.progress.quizScores) : {}),
        completionPercent: project.progress?.completionPercent ?? 0,
        currentChapterId: chapterId ?? null,
        currentSubchapterId: subchapterId ?? null,
        lastVisitedAt: new Date(),
        lastCompletedAt: project.progress?.lastCompletedAt ?? null,
      },
    });

    return Response.json({ ok: true, tracked: true });
  }

  if (existing.includes(contentId)) {
    // Still update quiz score if provided (user may retry)
    if (quizScore !== undefined && project.progress) {
      const scores: Record<string, number> = project.progress.quizScores
        ? JSON.parse(project.progress.quizScores)
        : {};
      scores[contentId] = quizScore;
      await prisma.progressState.update({
        where: { projectId },
        data: {
          quizScores: JSON.stringify(scores),
          currentChapterId: chapterId ?? project.progress.currentChapterId ?? null,
          currentSubchapterId: subchapterId ?? project.progress.currentSubchapterId ?? null,
          lastVisitedAt: new Date(),
        },
      });
    }
    return Response.json({ ok: true });
  }

  const updated = [...existing, contentId];
  const totalItems = allContentIds.length;
  const completionPercent = totalItems > 0 ? Math.round((updated.length / totalItems) * 100) : 0;

  // Update quiz scores if provided
  const existingScores: Record<string, number> = project.progress?.quizScores
    ? JSON.parse(project.progress.quizScores)
    : {};
  if (quizScore !== undefined) {
    existingScores[contentId] = quizScore;
  }

  await prisma.progressState.upsert({
    where: { projectId },
    update: {
      completedItems: JSON.stringify(updated),
      quizScores: JSON.stringify(existingScores),
      completionPercent,
      currentChapterId: chapterId ?? project.progress?.currentChapterId ?? null,
      currentSubchapterId: subchapterId ?? project.progress?.currentSubchapterId ?? null,
      lastVisitedAt: new Date(),
      lastCompletedAt: new Date(),
    },
    create: {
      projectId,
      completedItems: JSON.stringify(updated),
      quizScores: JSON.stringify(existingScores),
      completionPercent,
      currentChapterId: chapterId ?? null,
      currentSubchapterId: subchapterId ?? null,
      lastVisitedAt: new Date(),
      lastCompletedAt: new Date(),
    },
  });

  return Response.json({ ok: true, completedItems: updated });
}
