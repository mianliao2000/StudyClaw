import { notFound, redirect } from "next/navigation";
import { ExampleLearningPageShell } from "@/components/example/example-learning-page-shell";
import { ExampleLessonBanner } from "@/components/example/example-lesson-banner";
import { LessonContent } from "@/components/lesson/lesson-content";
import { QuizView } from "@/components/lesson/quiz-view";
import { SubchapterHeader } from "@/components/lesson/subchapter-header";
import {
  getExampleLessonBySlugs,
  getExampleLessonStaticParams,
  resolveLegacyExampleLessonRedirect,
} from "@/lib/examples/catalog";
import type { ContentType } from "@/types";

export const dynamicParams = true;

export function generateStaticParams() {
  return getExampleLessonStaticParams();
}

export default async function ExampleLessonPage({
  params,
}: {
  params: Promise<{
    courseSlug: string;
    chapterSlug: string;
    subchapterSlug: string;
    lessonType: ContentType;
  }>;
}) {
  const { courseSlug, chapterSlug, subchapterSlug, lessonType } = await params;
  const exampleLesson = getExampleLessonBySlugs(
    courseSlug,
    chapterSlug,
    subchapterSlug,
    lessonType
  );

  if (!exampleLesson) {
    const legacyRedirect = resolveLegacyExampleLessonRedirect(
      courseSlug,
      chapterSlug,
      subchapterSlug,
      lessonType
    );

    if (legacyRedirect) {
      redirect(legacyRedirect);
    }

    notFound();
  }

  const { course, chapter, subchapter, lesson } = exampleLesson;

  const lessonNode =
    lessonType === "quiz" ? (
      <QuizView
        contentId={lesson.id}
        body={lesson.body}
        bodyEn={lesson.bodyEn}
        status={lesson.status}
        mode="example"
        allowGeneration={false}
        allowCompletionTracking={false}
        allowVisitTracking={false}
        allowLastPathPersistence={false}
        persistQuizState={false}
      />
    ) : (
      <LessonContent
        contentId={lesson.id}
        body={lesson.body}
        bodyEn={lesson.bodyEn}
        status={lesson.status}
        contentType={lessonType}
        diagramBase64={lesson.diagramBase64}
        mode="example"
        allowGeneration={false}
        allowCompletionTracking={false}
        allowVisitTracking={false}
        allowLastPathPersistence={false}
      />
    );

  return (
    <ExampleLearningPageShell
      content={
        <div className="p-5 sm:p-6 xl:px-8 xl:py-7">
          <div className="mx-auto w-full max-w-5xl 2xl:max-w-6xl">
            <ExampleLessonBanner
              courseSlug={course.slug}
              target={{ chapterSlug, subchapterSlug, lessonType }}
            />
            <SubchapterHeader
              contentType={lessonType}
              chapterTitle={chapter.title}
              chapterTitleEn={chapter.titleEn}
              chapterOrderIndex={chapter.orderIndex}
              subchapterTitle={subchapter.title}
              subchapterTitleEn={subchapter.titleEn}
              subchapterOrderIndex={subchapter.orderIndex}
              learningObjective={subchapter.learningObjective}
              learningObjectiveEn={subchapter.learningObjectiveEn}
            />
            {lessonNode}
          </div>
        </div>
      }
      tutor={{
        courseSlug: course.slug,
        chapterSlug: chapter.slug,
        subchapterSlug: subchapter.slug,
        lessonType,
        projectTitle: course.title,
        chapterTitle: chapter.title,
        subchapterTitle: subchapter.title,
        learningObjective: subchapter.learningObjective,
        lessonContent: lesson.body,
      }}
    />
  );
}
