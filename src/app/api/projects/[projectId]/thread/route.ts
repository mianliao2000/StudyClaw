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

  const thread = await prisma.projectChatThread.findFirst({
    where: {
      projectId,
      mode: "planning",
      project: { userId: session.user.id },
    },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!thread) {
    return NextResponse.json({ threadId: null, messages: [] });
  }

  return NextResponse.json({
    threadId: thread.id,
    conversationLanguage: thread.conversationLanguage,
    messages: thread.messages,
  });
}
