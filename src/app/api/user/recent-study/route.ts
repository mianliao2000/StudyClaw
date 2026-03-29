import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(null);
  }

  const progress = await prisma.progressState.findFirst({
    where: {
      project: {
        userId: session.user.id,
        status: "active",
      },
    },
    orderBy: { lastVisitedAt: "desc" },
    include: {
      project: {
        include: {
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
      },
    },
  });

  const project = progress?.project;
  if (!project || project.chapters.length === 0) {
    return Response.json(null);
  }

  let targetChapter = project.chapters.find((chapter) => chapter.id === progress.currentChapterId) ?? project.chapters[0];
  let targetSubchapter =
    targetChapter.subchapters.find((subchapter) => subchapter.id === progress.currentSubchapterId) ??
    targetChapter.subchapters[0];

  if (!targetSubchapter) {
    const completedItems: string[] = progress?.completedItems ? JSON.parse(progress.completedItems) : [];
    let found = false;

    for (const chapter of project.chapters) {
      for (const subchapter of chapter.subchapters) {
        const mainContent = subchapter.contents.find((content) => content.contentType === "main");
        if (mainContent && !completedItems.includes(mainContent.id)) {
          targetChapter = chapter;
          targetSubchapter = subchapter;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      const lastChapter = project.chapters[project.chapters.length - 1];
      if (lastChapter?.subchapters.length) {
        targetChapter = lastChapter;
        targetSubchapter = lastChapter.subchapters[lastChapter.subchapters.length - 1];
      }
    }
  }

  if (!targetSubchapter) {
    return Response.json(null);
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
    completionPercent: progress?.completionPercent ?? 0,
    href: `/projects/${project.id}/chapters/${targetChapter.id}/subchapters/${targetSubchapter.id}/main`,
  });
}
