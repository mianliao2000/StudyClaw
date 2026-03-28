import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
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
    select: {
      id: true,
      title: true,
      titleEn: true,
      progress: {
        select: {
          completionPercent: true,
        },
      },
    },
  });

  if (!project) {
    return new Response("Not found", { status: 404 });
  }

  return NextResponse.json({
    id: project.id,
    title: project.title,
    titleEn: project.titleEn,
    completionPercent: Math.round(project.progress?.completionPercent ?? 0),
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { projectId } = await params;
  const body = (await req.json()) as { starred?: boolean };

  const project = await prisma.learningProject.findFirst({
    where: { id: projectId, userId: session.user.id },
  });

  if (!project) {
    return new Response("Not found", { status: 404 });
  }

  const updated = await prisma.learningProject.update({
    where: { id: projectId },
    data: { starred: body.starred ?? !project.starred },
    select: { starred: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
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
  });

  if (!project) {
    return new Response("Not found", { status: 404 });
  }

  await prisma.learningProject.delete({ where: { id: projectId } });

  return NextResponse.json({ success: true });
}
