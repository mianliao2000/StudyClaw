import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const projects = await prisma.learningProject.findMany({
    where: { userId: session.user.id, status: { not: "planning" } },
    include: { progress: true },
  });

  const activeProjects = projects.filter((p) => p.status === "active").length;

  let completedItems = 0;
  let percentSum = 0;
  let percentCount = 0;

  for (const project of projects) {
    if (!project.progress) continue;
    try {
      const items = JSON.parse(project.progress.completedItems ?? "[]");
      if (Array.isArray(items)) completedItems += items.length;
    } catch {
      // ignore malformed JSON
    }
    percentSum += project.progress.completionPercent;
    percentCount += 1;
  }

  const overallPercent =
    percentCount > 0 ? Math.round(percentSum / percentCount) : 0;

  return Response.json({ activeProjects, completedItems, overallPercent });
}
