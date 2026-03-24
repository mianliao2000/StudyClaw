import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { QuizView } from "@/components/lesson/quiz-view";
import { SubchapterHeader } from "@/components/lesson/subchapter-header";

type SubchapterContentItem = {
  id: string;
  body: string;
  status: string;
  contentType: string;
  lang: string;
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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <SubchapterHeader
        contentType="quiz"
        chapterTitle={subchapter.chapter.title}
        subchapterTitle={subchapter.title}
      />
      <QuizView
        contentId={quiz!.id}
        body={quiz!.body}
        bodyEn={quizEn?.body}
        status={quiz!.status}
      />
    </div>
  );
}
