import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { QuizView } from "@/components/lesson/quiz-view";
import { LearningPageShell } from "@/components/lesson/learning-page-shell";
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

export default async function QuizPage({
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

  const quizZh = subchapter.contents.find(
    (c: SubchapterContentItem) => c.contentType === "quiz" && c.lang === "zh"
  );
  const quizEn = subchapter.contents.find(
    (c: SubchapterContentItem) => c.contentType === "quiz" && c.lang === "en"
  );
  const quiz =
    quizZh ??
    subchapter.contents.find((c: SubchapterContentItem) => c.contentType === "quiz");
  if (!quiz) redirect(`/projects/${projectId}`);

  const thread = subchapter.chatThreads[0];

  return (
    <LearningPageShell
      content={
        <div className="p-6">
          <div className="max-w-3xl mx-auto">
            <SubchapterHeader
              contentType="quiz"
              chapterTitle={subchapter.chapter.title}
              subchapterTitle={subchapter.title}
            />
            <QuizView
              contentId={quiz.id}
              body={quiz.body}
              bodyEn={quizEn?.body}
              status={quiz.status}
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
        lessonContent: quiz.status === "ready" ? quiz.body : "",
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
