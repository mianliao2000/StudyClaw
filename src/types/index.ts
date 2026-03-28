export type ProjectStatus = "planning" | "active" | "completed" | "archived";
export type ContentType = "main" | "summary" | "quiz";
export type ContentStatus = "pending" | "generating" | "ready" | "error";
export type ChatMode = "planning" | "tutoring";
export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

export interface ProjectWithChapters {
  id: string;
  title: string;
  topic: string;
  description: string | null;
  goals: string | null;
  status: string;
  chapters: ChapterWithSubchapters[];
  progress: {
    completionPercent: number;
    completedItems: string | null;
    currentChapterId: string | null;
    currentSubchapterId: string | null;
  } | null;
}

export interface ChapterWithSubchapters {
  id: string;
  title: string;
  titleEn?: string | null;
  orderIndex: number;
  subchapters: SubchapterInfo[];
}

export interface SubchapterInfo {
  id: string;
  title: string;
  titleEn?: string | null;
  orderIndex: number;
  learningObjective: string | null;
  learningObjectiveEn?: string | null;
  contents: {
    id: string;
    contentType: string;
    status: string;
    lang?: string;
  }[];
}

export interface PlanStructure {
  title: string;
  titleEn?: string;
  topic: string;
  topicEn?: string;
  description: string;
  descriptionEn?: string;
  goals: string[];
  goalsEn?: string[];
  chapters: {
    title: string;
    titleEn?: string;
    subchapters: {
      title: string;
      titleEn?: string;
      learningObjective: string;
      learningObjectiveEn?: string;
    }[];
  }[];
}
