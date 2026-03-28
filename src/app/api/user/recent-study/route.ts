import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(null);
  }

  // Find the most recently updated active project with progress
  const project = await prisma.learningProject.findFirst({
    where: {
      userId: session.user.id,
      status: "active",
    },
    orderBy: { updatedAt: "desc" },
    include: {
      progress: true,
      chapters: {
        orderBy: { orderIndex: "asc" },
        include: {
          subchapters: {
            orderBy: { orderIndex: "asc" },
            include: {
              contents: { select: { id: true, contentType: true } },
            },
          },
        },
      },
    },
  });

  if (!project || project.chapters.length === 0) {
    return Response.json(null);
  }

  const completedItems: string[] = project.progress?.completedItems
    ? JSON.parse(project.progress.completedItems)
    : [];

  // Find the first subchapter that has incomplete "main" content
  let targetChapter = project.chapters[0];
  let targetSubchapter = targetChapter.subchapters[0];
  let found = false;

  for (const ch of project.chapters) {
    for (const sc of ch.subchapters) {
      const mainContent = sc.contents.find((c) => c.contentType === "main");
      if (mainContent && !completedItems.includes(mainContent.id)) {
        targetChapter = ch;
        targetSubchapter = sc;
        found = true;
        break;
      }
    }
    if (found) break;
  }

  // If everything is completed, point to the last subchapter
  if (!found) {
    const lastCh = project.chapters[project.chapters.length - 1];
    if (lastCh.subchapters.length > 0) {
      targetChapter = lastCh;
      targetSubchapter = lastCh.subchapters[lastCh.subchapters.length - 1];
    }
  }

  const chapterLabel = `${targetChapter.orderIndex + 1}`;
  const subchapterLabel = `${targetChapter.orderIndex + 1}.${targetSubchapter.orderIndex + 1}`;

  return Response.json({
    projectId: project.id,
    projectTitle: project.title,
    projectTitleEn: project.titleEn,
    chapterId: targetChapter.id,
    subchapterId: targetSubchapter.id,
    chapterLabel,
    subchapterLabel,
    completionPercent: project.progress?.completionPercent ?? 0,
    href: `/projects/${project.id}/chapters/${targetChapter.id}/subchapters/${targetSubchapter.id}/main`,
  });
}
