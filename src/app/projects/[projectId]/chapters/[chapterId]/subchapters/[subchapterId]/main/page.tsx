import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LessonContent } from "@/components/lesson/lesson-content";
import { TutoringChat } from "@/components/lesson/tutoring-chat";
import { SubchapterHeader } from "@/components/lesson/subchapter-header";

type SubchapterContentItem = {
  id: string;
  body: string;
  status: string;
  contentType: string;
  lang: string;
};

type TutoringThreadMessage = {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
};

export default async function MainContentPage({
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

  const { projectId, chapterId, subchapterId } = await params;

  const subchapter = await prisma.subchapter.findUnique({
    where: { id: subchapterId },
    include: {
      chapter: { include: { project: true } },
      contents: true,
      chatThreads: {
        where: { mode: "tutoring" },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      },
    },
  });

  if (!subchapter || subchapter.chapter.project.userId !== session.user.id) {
    redirect("/dashboard");
  }

  const mainZh = subchapter.contents.find(
    (c: SubchapterContentItem) => c.contentType === "main" && c.lang === "zh"
  );
  const mainEn = subchapter.contents.find(
    (c: SubchapterContentItem) => c.contentType === "main" && c.lang === "en"
  );

  // Fall back to first "main" if no zh-specific one exists
  const mainContent =
    mainZh ??
    subchapter.contents.find(
      (c: SubchapterContentItem) => c.contentType === "main"
    );
  if (!mainContent) redirect(`/projects/${projectId}`);

  const thread = subchapter.chatThreads[0];

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <SubchapterHeader
            contentType="main"
            chapterTitle={subchapter.chapter.title}
            subchapterTitle={subchapter.title}
            learningObjective={subchapter.learningObjective}
          />
          <LessonContent
            contentId={mainContent!.id}
            body={mainContent!.body}
            bodyEn={mainEn?.body}
            status={mainContent!.status}
            contentType="main"
          />
        </div>
      </div>

      <div className="w-80 border-l flex flex-col">
        <TutoringChat
          threadId={thread?.id}
          projectTitle={subchapter.chapter.project.title}
          chapterTitle={subchapter.chapter.title}
          subchapterTitle={subchapter.title}
          learningObjective={subchapter.learningObjective || ""}
          lessonContent={
            mainContent!.status === "ready" ? mainContent!.body : ""
          }
          initialMessages={
            thread?.messages.map((m: TutoringThreadMessage) => ({
              id: m.id,
              role: m.role as "user" | "assistant" | "system",
              content: m.content,
              createdAt: m.createdAt,
            })) || []
          }
        />
      </div>
    </div>
  );
}
