import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProjectOverviewContent } from "@/components/project/project-overview-content";

type ProjectContentItem = {
  id: string;
  contentType: string;
  status: string;
};

type ProjectSubchapter = {
  id: string;
  title: string;
  titleEn: string | null;
  orderIndex: number;
  contents: ProjectContentItem[];
};

type ProjectChapter = {
  id: string;
  title: string;
  titleEn: string | null;
  orderIndex: number;
  subchapters: ProjectSubchapter[];
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { projectId } = await params;

  const project = await prisma.learningProject.findFirst({
    where: { id: projectId, userId: session.user.id },
    include: {
      chapters: {
        orderBy: { orderIndex: "asc" },
        include: {
          subchapters: {
            orderBy: { orderIndex: "asc" },
            include: { contents: { where: { lang: "zh" } } },
          },
        },
      },
      progress: true,
    },
  });

  if (!project) redirect("/dashboard");
  if (project.status === "planning") {
    if (project.chapters.length > 0) {
      redirect(`/projects/${projectId}/review`);
    }
    redirect(`/projects/${projectId}/plan`);
  }

  const goals: string[] = project.goals ? JSON.parse(project.goals) : [];
  const goalsEn: string[] = project.goalsEn ? JSON.parse(project.goalsEn) : [];
  const totalItems = project.chapters.reduce(
    (sum: number, ch: ProjectChapter) =>
      sum +
      ch.subchapters.reduce(
        (subchapterSum: number, sub: ProjectSubchapter) =>
          subchapterSum + sub.contents.length,
        0
      ),
    0
  );

  return (
    <ProjectOverviewContent
      projectId={projectId}
      title={project.title}
      titleEn={project.titleEn}
      description={project.description}
      descriptionEn={project.descriptionEn}
      chapters={project.chapters.map((ch: ProjectChapter) => ({
        id: ch.id,
        title: ch.title,
        titleEn: ch.titleEn,
        orderIndex: ch.orderIndex,
        subchapters: ch.subchapters.map((sub: ProjectSubchapter) => ({
          id: sub.id,
          title: sub.title,
          titleEn: sub.titleEn,
          orderIndex: sub.orderIndex,
          contents: sub.contents.map((c: ProjectContentItem) => ({
            id: c.id,
            contentType: c.contentType,
            status: c.status,
          })),
        })),
      }))}
      progress={project.progress}
      goals={goals}
      goalsEn={goalsEn}
      totalItems={totalItems}
    />
  );
}
