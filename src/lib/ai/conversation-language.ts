export type ConversationLanguage = "zh" | "en";

const CHINESE_CHARACTER_PATTERN = /[\u3400-\u9fff]/u;

export function detectConversationLanguage(text: string): ConversationLanguage {
  return CHINESE_CHARACTER_PATTERN.test(text) ? "zh" : "en";
}

export function getConversationLanguageName(language: ConversationLanguage) {
  return language === "zh" ? "Chinese" : "English";
}

export function getCreateCourseLabel(language: ConversationLanguage) {
  return language === "zh" ? "创建课程" : "Create Course";
}

export function getCreateCourseOption(language: ConversationLanguage) {
  return `A. ${getCreateCourseLabel(language)}`;
}

export function isCreateCourseOption(
  value: string,
  language?: ConversationLanguage | null
) {
  const normalized = value.trim().toLowerCase();

  if (language) {
    return normalized.includes(getCreateCourseLabel(language).toLowerCase());
  }

  return ["创建课程", "create course"].some((label) =>
    normalized.includes(label.toLowerCase())
  );
}
