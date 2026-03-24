import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PlanReviewContent } from "@/components/project/plan-review-content";

export default async function ProjectReviewPage({
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
          },
        },
      },
    },
  });

  if (!project) redirect("/dashboard");
  if (project.status !== "planning") redirect(`/projects/${projectId}`);
  if (project.chapters.length === 0) redirect(`/projects/${projectId}/plan`);

  return (
    <PlanReviewContent
      projectId={projectId}
      title={project.title}
      titleEn={project.titleEn}
      description={project.description}
      descriptionEn={project.descriptionEn}
      goals={project.goals ? JSON.parse(project.goals) : []}
      goalsEn={project.goalsEn ? JSON.parse(project.goalsEn) : []}
      chapters={project.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        titleEn: chapter.titleEn,
        subchapters: chapter.subchapters.map((subchapter) => ({
          id: subchapter.id,
          title: subchapter.title,
          titleEn: subchapter.titleEn,
          learningObjective: subchapter.learningObjective,
          learningObjectiveEn: subchapter.learningObjectiveEn,
        })),
      }))}
    />
  );
}
