import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateContentById } from "@/lib/ai/generate-content";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { projectId } = await params;

  const project = await prisma.learningProject.findFirst({
    where: { id: projectId, userId: session.user.id },
    include: {
      chapters: {
        orderBy: { orderIndex: "asc" },
        include: {
          subchapters: {
            orderBy: { orderIndex: "asc" },
            include: {
              contents: {
                where: { contentType: "main", lang: "zh" },
                orderBy: { createdAt: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  const firstChapter = project.chapters[0];
  const firstSubchapter = firstChapter?.subchapters[0];
  const firstMainContent = firstSubchapter?.contents[0];

  if (!firstChapter || !firstSubchapter || !firstMainContent) {
    return NextResponse.json({ error: "Plan is incomplete" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.learningProject.update({
      where: { id: projectId },
      data: { status: "active" },
    }),
    prisma.progressState.upsert({
      where: { projectId },
      update: {
        currentChapterId: firstChapter.id,
        currentSubchapterId: firstSubchapter.id,
      },
      create: {
        projectId,
        currentChapterId: firstChapter.id,
        currentSubchapterId: firstSubchapter.id,
      },
    }),
  ]);

  if (firstMainContent.status === "pending" || firstMainContent.status === "error") {
    void generateContentById(firstMainContent.id).catch((error) => {
      console.error(`Initial lesson generation failed for ${firstMainContent.id}:`, error);
    });
  }

  return NextResponse.json({
    redirectTo: `/projects/${projectId}/chapters/${firstChapter.id}/subchapters/${firstSubchapter.id}/main`,
  });
}
