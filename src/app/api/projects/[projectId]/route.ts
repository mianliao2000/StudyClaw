import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

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
