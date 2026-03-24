import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LessonContent } from "@/components/lesson/lesson-content";
import { SubchapterHeader } from "@/components/lesson/subchapter-header";

export default async function SummaryPage({
  params,
}: {
  params: Promise<{
    projectId: string;
    chapterId: string;
    subchapterId: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { projectId, subchapterId } = await params;

  const subchapter = await prisma.subchapter.findUnique({
    where: { id: subchapterId },
    include: {
      chapter: { include: { project: true } },
      contents: true,
    },
  });

  if (!subchapter || subchapter.chapter.project.userId !== session.user.id) {
    redirect("/dashboard");
  }

  const summaryZh = subchapter.contents.find(
    (c) => c.contentType === "summary" && c.lang === "zh"
  );
  const summaryEn = subchapter.contents.find(
    (c) => c.contentType === "summary" && c.lang === "en"
  );
  const summary = summaryZh ?? subchapter.contents.find((c) => c.contentType === "summary");
  if (!summary) redirect(`/projects/${projectId}`);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <SubchapterHeader
        contentType="summary"
        chapterTitle={subchapter.chapter.title}
        subchapterTitle={subchapter.title}
      />
      <LessonContent
        contentId={summary!.id}
        body={summary!.body}
        bodyEn={summaryEn?.body}
        status={summary!.status}
        contentType="summary"
      />
    </div>
  );
}
