const SUMMARY_CHAPTER_TITLE_ZH = "课程总结";
const SUMMARY_CHAPTER_TITLE_EN = "Course Summary";

export function isSummaryChapter(
  chapterTitle: string,
  chapterTitleEn?: string | null
) {
  return (
    chapterTitle === SUMMARY_CHAPTER_TITLE_ZH ||
    chapterTitleEn === SUMMARY_CHAPTER_TITLE_EN
  );
}

export function formatChapterLabel(
  chapterTitle: string,
  chapterTitleEn: string | null | undefined,
  orderIndex: number,
  lang: "zh" | "en"
) {
  const displayTitle = lang === "en" ? chapterTitleEn || chapterTitle : chapterTitle;

  if (isSummaryChapter(chapterTitle, chapterTitleEn)) {
    return displayTitle;
  }

  return lang === "en"
    ? `Chapter ${orderIndex + 1}: ${displayTitle}`
    : `第${orderIndex + 1}章：${displayTitle}`;
}

export function formatSubchapterLabel(
  chapterOrderIndex: number,
  subchapterOrderIndex: number
) {
  return `${chapterOrderIndex + 1}.${subchapterOrderIndex + 1}`;
}
