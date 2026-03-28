import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  DEFAULT_USER_PREFERENCES,
  getUserPreferencesOrDefault,
} from "@/lib/user-preferences";
import { Prisma } from "@prisma/client";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const prefs = await getUserPreferencesOrDefault(session.user.id);
  return Response.json(prefs ?? DEFAULT_USER_PREFERENCES);
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

  try {
    const prefs = await prisma.userPreferences.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, ...data },
      update: data,
    });

    return Response.json(prefs);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2021"
    ) {
      return Response.json(
        {
          error:
            "UserPreferences table is missing. Run prisma migrate deploy on the deployed database.",
        },
        { status: 503 }
      );
    }
    throw error;
  }
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  await prisma.user.delete({ where: { id: session.user.id } });

  return Response.json({ ok: true });
}
