"use client";

import { CourseOverviewContent } from "@/components/course/course-overview-content";

interface ContentItem {
  id: string;
  contentType: string;
  status: string;
}

interface Subchapter {
  id: string;
  title: string;
  titleEn?: string | null;
  orderIndex: number;
  contents: ContentItem[];
}

interface Chapter {
  id: string;
  title: string;
  titleEn?: string | null;
  orderIndex: number;
  subchapters: Subchapter[];
}

interface ProjectOverviewContentProps {
  projectId: string;
  title: string;
  titleEn?: string | null;
  description: string | null;
  descriptionEn?: string | null;
  chapters: Chapter[];
  progress: { completionPercent: number } | null;
  goals: string[];
  goalsEn?: string[];
  totalItems: number;
}

export function ProjectOverviewContent({
  projectId,
  title,
  titleEn,
  description,
  descriptionEn,
  chapters,
  progress,
  goals,
  goalsEn,
  totalItems,
}: ProjectOverviewContentProps) {
  return (
    <CourseOverviewContent
      mode="project"
      courseId={projectId}
      title={title}
      titleEn={titleEn}
      description={description}
      descriptionEn={descriptionEn}
      chapters={chapters}
      progress={progress}
      goals={goals}
      goalsEn={goalsEn}
      totalItems={totalItems}
      buildLessonHref={(chapter, subchapter) =>
        `/projects/${projectId}/chapters/${chapter.id}/subchapters/${subchapter.id}/main`
      }
      reviewHref={`/projects/${projectId}/review`}
    />
  );
}
