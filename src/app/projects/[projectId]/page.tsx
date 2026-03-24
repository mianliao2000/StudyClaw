import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProjectOverviewContent } from "@/components/project/project-overview-content";

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
  if (project.status === "planning") redirect(`/projects/${projectId}/plan`);

  const goals: string[] = project.goals ? JSON.parse(project.goals) : [];
  const goalsEn: string[] = project.goalsEn ? JSON.parse(project.goalsEn) : [];
  const totalItems = project.chapters.reduce(
    (sum, ch) =>
      sum + ch.subchapters.reduce((s, sub) => s + sub.contents.length, 0),
    0
  );

  return (
    <ProjectOverviewContent
      projectId={projectId}
      title={project.title}
      titleEn={project.titleEn}
      description={project.description}
      descriptionEn={project.descriptionEn}
      chapters={project.chapters.map((ch) => ({
        id: ch.id,
        title: ch.title,
        titleEn: ch.titleEn,
        subchapters: ch.subchapters.map((sub) => ({
          id: sub.id,
          title: sub.title,
          titleEn: sub.titleEn,
          contents: sub.contents.map((c) => ({
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
