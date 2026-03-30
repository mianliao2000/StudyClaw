import fs from "fs";
import path from "path";
import os from "os";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateContentById } from "@/lib/ai/generate-content";
import { getUserPreferencesOrDefault } from "@/lib/user-preferences";
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
    await prisma.lessonContent.update({
      where: { id: firstMainContent.id },
      data: { status: "generating" },
    });

    const userPrefs = await getUserPreferencesOrDefault(session.user.id, {
      contentDetail: true,
      quizCount: true,
      reasoningLevel: true,
    });
    void generateContentById(firstMainContent.id, userPrefs).catch((error) => {
      console.error(`Initial lesson generation failed for ${firstMainContent.id}:`, error);
    });
  }

  // Clean up physical files but keep summaries in the database
  void (async () => {
    const uploads = await prisma.planningFileUpload.findMany({
      where: { projectId },
      select: { id: true, filePath: true },
    });
    for (const upload of uploads) {
      if (upload.filePath) {
        try { fs.unlinkSync(upload.filePath); } catch { /* ignore */ }
      }
    }
    if (uploads.length > 0) {
      await prisma.planningFileUpload.updateMany({
        where: { projectId },
        data: { filePath: null },
      });
    }
    const uploadDir = path.join(os.tmpdir(), "studyclaw-uploads", projectId);
    try { fs.rmSync(uploadDir, { recursive: true, force: true }); } catch { /* ignore */ }
  })().catch((error) => {
    console.error("Post-confirm file cleanup failed:", error);
  });

  return NextResponse.json({
    redirectTo: `/projects/${projectId}/chapters/${firstChapter.id}/subchapters/${firstSubchapter.id}/main`,
  });
}
