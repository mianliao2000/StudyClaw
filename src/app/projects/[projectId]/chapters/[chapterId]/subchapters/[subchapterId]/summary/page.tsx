import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LessonContent } from "@/components/lesson/lesson-content";
import { LearningPageShell } from "@/components/lesson/learning-page-shell";
import { SubchapterHeader } from "@/components/lesson/subchapter-header";

type SubchapterContentItem = {
  id: string;
  body: string;
  status: string;
  contentType: string;
  lang: string;
  diagramBase64?: string | null;
};

type TutoringThreadMessage = {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
};

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
      chatThreads: {
        where: { mode: "tutoring" },
        select: {
          id: true,
          conversationLanguage: true,
          messages: { orderBy: { createdAt: "asc" } },
        },
      },
    },
  });

  if (!subchapter || subchapter.chapter.project.userId !== session.user.id) {
    redirect("/dashboard");
  }

  const summaryZh = subchapter.contents.find(
    (c: SubchapterContentItem) =>
      c.contentType === "summary" && c.lang === "zh"
  );
  const summaryEn = subchapter.contents.find(
    (c: SubchapterContentItem) =>
      c.contentType === "summary" && c.lang === "en"
  );
  const summary =
    summaryZh ??
    subchapter.contents.find(
      (c: SubchapterContentItem) => c.contentType === "summary"
    );
  if (!summary) redirect(`/projects/${projectId}`);

  const progress = await prisma.progressState.findUnique({
    where: { projectId },
    select: { completedItems: true },
  });
  const completedItems: string[] = progress?.completedItems
    ? JSON.parse(progress.completedItems)
    : [];
  const isCompleted = completedItems.includes(summary.id);

  const thread = subchapter.chatThreads[0];

  return (
    <LearningPageShell
      content={
        <div className="p-5 sm:p-6 xl:px-8 xl:py-7">
          <div className="mx-auto w-full max-w-5xl 2xl:max-w-6xl">
            <SubchapterHeader
              contentType="summary"
              chapterTitle={subchapter.chapter.title}
              chapterTitleEn={subchapter.chapter.titleEn}
              chapterOrderIndex={subchapter.chapter.orderIndex}
              subchapterTitle={subchapter.title}
              subchapterTitleEn={subchapter.titleEn}
              subchapterOrderIndex={subchapter.orderIndex}
            />
            <LessonContent
              contentId={summary.id}
              body={summary.body}
              bodyEn={summaryEn?.body}
              status={summary.status}
              contentType="summary"
              isCompleted={isCompleted}
              diagramBase64={summary.diagramBase64}
            />
          </div>
        </div>
      }
      tutoring={{
        threadId: thread?.id,
        projectId,
        chapterId: subchapter.chapterId,
        subchapterId,
        projectTitle: subchapter.chapter.project.title,
        chapterTitle: subchapter.chapter.title,
        subchapterTitle: subchapter.title,
        learningObjective: subchapter.learningObjective || "",
        lessonContent: summary.status === "ready" ? summary.body : "",
        conversationLanguage: thread?.conversationLanguage as "zh" | "en" | null | undefined,
        initialMessages:
          thread?.messages.map((message: TutoringThreadMessage) => ({
            id: message.id,
            role: message.role as "user" | "assistant" | "system",
            content: message.content,
            createdAt: message.createdAt,
          })) || [],
      }}
    />
  );
}
