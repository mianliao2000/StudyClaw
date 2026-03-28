-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "teachingStyle" TEXT NOT NULL DEFAULT 'balanced',
    "reasoningLevel" TEXT NOT NULL DEFAULT 'medium',
    "defaultModel" TEXT NOT NULL DEFAULT '',
    "contentDetail" TEXT NOT NULL DEFAULT 'standard',
    "quizCount" INTEGER NOT NULL DEFAULT 5,
    "emailDigest" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");
