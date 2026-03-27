import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const prefs = await prisma.userPreferences.findUnique({
    where: { userId: session.user.id },
  });

  return Response.json(
    prefs ?? {
      teachingStyle: "balanced",
      reasoningLevel: "medium",
      defaultModel: "",
      contentDetail: "standard",
      quizCount: 5,
      emailDigest: false,
    }
  );
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const allowed = [
    "teachingStyle",
    "reasoningLevel",
    "defaultModel",
    "contentDetail",
    "quizCount",
    "emailDigest",
  ] as const;

  const data: Record<string, string | number | boolean> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  const prefs = await prisma.userPreferences.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, ...data },
    update: data,
  });

  return Response.json(prefs);
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  await prisma.user.delete({ where: { id: session.user.id } });

  return Response.json({ ok: true });
}
