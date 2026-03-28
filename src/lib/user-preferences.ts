import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export const DEFAULT_USER_PREFERENCES = {
  teachingStyle: "balanced",
  reasoningLevel: "medium",
  defaultModel: "",
  contentDetail: "standard",
  quizCount: 5,
  emailDigest: false,
} as const;

function isMissingUserPreferencesTableError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021" &&
    typeof error.meta?.table === "string" &&
    error.meta.table.includes("UserPreferences")
  );
}

export async function getUserPreferencesOrDefault<T extends object>(
  userId: string,
  select?: T
) {
  try {
    const prefs = await prisma.userPreferences.findUnique({
      where: { userId },
      ...(select ? { select } : {}),
    });

    return prefs;
  } catch (error) {
    if (isMissingUserPreferencesTableError(error)) {
      console.warn(
        "UserPreferences table is missing. Falling back to default preferences."
      );
      return null;
    }
    throw error;
  }
}

