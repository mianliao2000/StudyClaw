import fs from "fs";
import path from "path";
import os from "os";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { processUploadedFile } from "@/lib/files/process-upload";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_FILES_PER_PROJECT = 3;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
  "text/csv",
]);

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "text/plain": ".txt",
    "text/markdown": ".md",
    "text/csv": ".csv",
  };
  return map[mimeType] || ".bin";
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { projectId } = await params;

  const project = await prisma.learningProject.findFirst({
    where: { id: projectId, userId: session.user.id, status: "planning" },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found or not in planning status" }, { status: 404 });
  }

  const existingCount = await prisma.planningFileUpload.count({
    where: { projectId },
  });

  if (existingCount >= MAX_FILES_PER_PROJECT) {
    return NextResponse.json(
      { error: `Maximum ${MAX_FILES_PER_PROJECT} files allowed per project` },
      { status: 400 },
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File size exceeds 100MB limit" },
      { status: 413 },
    );
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Allowed: PDF, DOCX, TXT, MD, CSV" },
      { status: 400 },
    );
  }

  const uploadDir = path.join(os.tmpdir(), "studyclaw-uploads", projectId);
  fs.mkdirSync(uploadDir, { recursive: true });

  const fileId = crypto.randomUUID();
  const ext = getExtension(file.type);
  const filePath = path.join(uploadDir, `${fileId}${ext}`);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  const record = await prisma.planningFileUpload.create({
    data: {
      projectId,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      filePath,
      status: "pending",
    },
  });

  void processUploadedFile(record.id).catch((error) => {
    console.error(`[file-upload] Processing failed for ${record.id}:`, error);
  });

  return NextResponse.json({
    id: record.id,
    fileName: record.fileName,
    fileSize: record.fileSize,
    mimeType: record.mimeType,
    status: record.status,
  });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { projectId } = await params;

  const project = await prisma.learningProject.findFirst({
    where: { id: projectId, userId: session.user.id },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const files = await prisma.planningFileUpload.findMany({
    where: { projectId },
    select: {
      id: true,
      fileName: true,
      fileSize: true,
      mimeType: true,
      status: true,
      summary: true,
      summaryEn: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(files);
}
