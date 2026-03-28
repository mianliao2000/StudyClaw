import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { ProjectLayoutShell } from "@/components/project/project-layout-shell";
import { ProjectSidebar } from "@/components/project/sidebar";
import type { ChapterWithSubchapters } from "@/types";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
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
            include: {
              contents: { select: { id: true, contentType: true, status: true, lang: true } },
            },
          },
        },
      },
      progress: true,
    },
  });

  if (!project) redirect("/dashboard");

  // 规划阶段不显示侧边栏，但保留 Header
  if (project.status === "planning") {
    return (
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    );
  }

  const completedItems: string[] = project.progress?.completedItems
    ? JSON.parse(project.progress.completedItems)
    : [];
  const quizScores: Record<string, number> = project.progress?.quizScores
    ? JSON.parse(project.progress.quizScores)
    : {};

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <ProjectLayoutShell
        sidebar={
          <ProjectSidebar
            projectTitle={project.title}
            projectTitleEn={project.titleEn ?? undefined}
            chapters={project.chapters as ChapterWithSubchapters[]}
            completedItems={completedItems}
            quizScores={quizScores}
          />
        }
      >
        {children}
      </ProjectLayoutShell>
    </div>
  );
}
