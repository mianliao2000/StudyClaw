"use client";

import { useParams } from "next/navigation";
import { CourseSidebar } from "@/components/course/course-sidebar";
import type { ChapterWithSubchapters } from "@/types";

interface ProjectSidebarProps {
  projectTitle: string;
  projectTitleEn?: string;
  chapters: ChapterWithSubchapters[];
  completedItems: string[];
  quizScores?: Record<string, number>;
}

export function ProjectSidebar({
  projectTitle,
  projectTitleEn,
  chapters,
  completedItems,
  quizScores = {},
}: ProjectSidebarProps) {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <CourseSidebar
      courseTitle={projectTitle}
      courseTitleEn={projectTitleEn}
      chapters={chapters}
      completedItems={completedItems}
      quizScores={quizScores}
      overviewHref={`/projects/${projectId}`}
      getContentHref={(chapter, subchapter, type) =>
        `/projects/${projectId}/chapters/${chapter.id}/subchapters/${subchapter.id}/${type}`
      }
      storageKey={`studyclaw:sidebar-expanded:${projectId}`}
      mode="project"
    />
  );
}
