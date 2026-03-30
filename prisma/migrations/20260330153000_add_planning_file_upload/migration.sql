-- CreateTable
CREATE TABLE "PlanningFileUpload" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "filePath" TEXT,
    "summary" TEXT,
    "summaryEn" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlanningFileUpload_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "LearningProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
