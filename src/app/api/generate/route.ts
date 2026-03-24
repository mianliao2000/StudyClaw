import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateContentById } from "@/lib/ai/generate-content";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { contentId } = await req.json();

  const content = await prisma.lessonContent.findUnique({
    where: { id: contentId },
    include: {
      subchapter: {
        include: { chapter: { include: { project: true } } },
      },
    },
  });

  if (!content) return new Response("Content not found", { status: 404 });
  if (content.subchapter.chapter.project.userId !== session.user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const { zh, en } = await generateContentById(contentId);
    return NextResponse.json({ body: zh, bodyZh: zh, bodyEn: en, status: "ready" });
  } catch (error) {
    console.error("Content generation error:", error);
    return NextResponse.json({ error: "内容生成失败，请重试" }, { status: 500 });
  }
}
