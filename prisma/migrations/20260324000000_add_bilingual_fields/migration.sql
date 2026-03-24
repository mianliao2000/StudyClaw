ALTER TABLE "LearningProject" ADD COLUMN "titleEn" TEXT;
ALTER TABLE "LearningProject" ADD COLUMN "topicEn" TEXT;
ALTER TABLE "LearningProject" ADD COLUMN "descriptionEn" TEXT;
ALTER TABLE "LearningProject" ADD COLUMN "goalsEn" TEXT;

ALTER TABLE "Chapter" ADD COLUMN "titleEn" TEXT;

ALTER TABLE "Subchapter" ADD COLUMN "titleEn" TEXT;
ALTER TABLE "Subchapter" ADD COLUMN "learningObjectiveEn" TEXT;

ALTER TABLE "LessonContent" ADD COLUMN "lang" TEXT NOT NULL DEFAULT 'zh';

CREATE UNIQUE INDEX IF NOT EXISTS "LessonContent_subchapterId_contentType_lang_key"
ON "LessonContent"("subchapterId", "contentType", "lang");
