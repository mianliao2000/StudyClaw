import fs from "fs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ projectId: string; fileId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { projectId, fileId } = await params;

  const project = await prisma.learningProject.findFirst({
    where: { id: projectId, userId: session.user.id },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const file = await prisma.planningFileUpload.findFirst({
    where: { id: fileId, projectId },
  });

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  if (file.filePath) {
    try { fs.unlinkSync(file.filePath); } catch { /* file may already be gone */ }
  }

  await prisma.planningFileUpload.delete({ where: { id: fileId } });

  return NextResponse.json({ success: true });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ projectId: string; fileId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { projectId, fileId } = await params;

  const file = await prisma.planningFileUpload.findFirst({
    where: {
      id: fileId,
      projectId,
      project: { userId: session.user.id },
    },
    select: { id: true, status: true, summary: true, summaryEn: true },
  });

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return NextResponse.json(file);
}
