"use client";

import { ExampleAddButton } from "@/components/example/example-add-button";
import { CourseOverviewContent } from "@/components/course/course-overview-content";
import { getExampleLessonHref } from "@/lib/examples/catalog";
import type { ExampleCourse } from "@/types";

export function ExampleCourseOverview({ course }: { course: ExampleCourse }) {
  const totalItems = course.chapters.reduce(
    (sum, chapter) =>
      sum +
      chapter.subchapters.reduce(
        (subchapterSum, subchapter) => subchapterSum + subchapter.contents.length,
        0
      ),
    0
  );

  return (
    <CourseOverviewContent
      mode="example"
      title={course.title}
      titleEn={course.titleEn}
      description={course.description}
      descriptionEn={course.descriptionEn}
      chapters={course.chapters}
      goals={course.goals}
      goalsEn={course.goalsEn}
      totalItems={totalItems}
      buildLessonHref={(chapter, subchapter) =>
        getExampleLessonHref(
          course.slug,
          chapter.slug ?? chapter.id,
          subchapter.slug ?? subchapter.id,
          "main"
        )
      }
      cta={<ExampleAddButton courseSlug={course.slug} size="lg" />}
    />
  );
}
