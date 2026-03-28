export type QuizScoreState = "success" | "warning" | "danger";

function normalizePercent(percent: number) {
  return Math.max(0, Math.min(100, Math.round(percent)));
}

export function getQuizScoreStateFromPercent(percent: number): QuizScoreState {
  const normalized = normalizePercent(percent);

  if (normalized >= 100) return "success";
  if (normalized >= 60) return "warning";
  return "danger";
}

export function getQuizScoreState(score: number, total: number): QuizScoreState {
  const percent = total > 0 ? (score / total) * 100 : 0;
  return getQuizScoreStateFromPercent(percent);
}

export function getQuizScoreTextClass(state: QuizScoreState) {
  switch (state) {
    case "success":
      return "text-green-600 dark:text-green-400";
    case "warning":
      return "text-amber-600 dark:text-amber-400";
    case "danger":
      return "text-red-600 dark:text-red-400";
  }
}

export function getQuizScoreIconClass(state: QuizScoreState) {
  switch (state) {
    case "success":
      return "text-green-500";
    case "warning":
      return "text-amber-500";
    case "danger":
      return "text-red-500";
  }
}

export function getQuizScoreBadgeClass(state: QuizScoreState) {
  switch (state) {
    case "success":
      return "border-green-500/30 bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400";
    case "warning":
      return "border-amber-500/30 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
    case "danger":
      return "border-red-500/30 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";
  }
}

export function getQuizScoreEmoji(state: QuizScoreState) {
  switch (state) {
    case "success":
      return "😄";
    case "warning":
      return "😐";
    case "danger":
      return "😢";
  }
}

export function getQuizScoreFeedback(
  score: number,
  total: number,
  lang: "zh" | "en"
) {
  const state = getQuizScoreState(score, total);

  if (state === "success") {
    return lang === "en"
      ? "Perfect score. You've mastered this section."
      : "太棒了，这一节你已经完全掌握了";
  }

  if (state === "warning") {
    return lang === "en"
      ? "You're close. Review the explanations below and polish the weak spots."
      : "已经很接近了，看看下面的解析，把薄弱点再补一补";
  }

  return lang === "en"
    ? "Review the lesson content and try again."
    : "建议先回顾正文内容，再试一次";
}
