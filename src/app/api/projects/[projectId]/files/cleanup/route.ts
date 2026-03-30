import fs from "fs";
import path from "path";
import os from "os";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { projectId } = await params;

  const project = await prisma.learningProject.findFirst({
    where: {
      id: projectId,
      userId: session.user.id,
      status: "planning",
      chapters: { none: {} },
    },
  });

  if (!project) {
    return new Response("OK", { status: 200 });
  }

  const uploads = await prisma.planningFileUpload.findMany({
    where: { projectId },
    select: { filePath: true },
  });

  for (const upload of uploads) {
    if (upload.filePath) {
      try { fs.unlinkSync(upload.filePath); } catch { /* ignore */ }
    }
  }

  const uploadDir = path.join(os.tmpdir(), "studyclaw-uploads", projectId);
  try { fs.rmSync(uploadDir, { recursive: true, force: true }); } catch { /* ignore */ }

  await prisma.planningFileUpload.deleteMany({ where: { projectId } });

  await prisma.projectChatMessage.deleteMany({
    where: {
      thread: { projectId, mode: "planning" },
    },
  });

  return new Response("OK", { status: 200 });
}
