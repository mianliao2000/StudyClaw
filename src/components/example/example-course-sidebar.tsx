"use client";

import { CourseSidebar } from "@/components/course/course-sidebar";
import {
  getExampleLessonHref,
  getExampleOverviewHref,
} from "@/lib/examples/catalog";
import type { ExampleCourse } from "@/types";

export function ExampleCourseSidebar({ course }: { course: ExampleCourse }) {
  return (
    <CourseSidebar
      courseTitle={course.title}
      courseTitleEn={course.titleEn}
      chapters={course.chapters}
      overviewHref={getExampleOverviewHref(course.slug)}
      getContentHref={(chapter, subchapter, lessonType) =>
        getExampleLessonHref(
          course.slug,
          chapter.slug ?? chapter.id,
          subchapter.slug ?? subchapter.id,
          lessonType
        )
      }
      storageKey={`studyclaw:example-sidebar-expanded:${course.slug}`}
      mode="example"
    />
  );
}
