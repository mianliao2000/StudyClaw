"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import {
  getQuizScoreBadgeClass,
  getQuizScoreEmoji,
  getQuizScoreFeedback,
  getQuizScoreState,
  getQuizScoreTextClass,
} from "@/lib/quiz-score";
import { useMarkCompleted } from "@/lib/use-mark-completed";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizViewProps {
  contentId: string;
  body: string;
  bodyEn?: string;
  status: string;
  isCompleted?: boolean;
}

function parseQuiz(text: string): QuizQuestion[] {
  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : text;
    const parsed = JSON.parse(jsonStr);
    return parsed.questions || [];
  } catch {
    return [];
  }
}

const QUIZ_STATE_PREFIX = "studyclaw:quiz-state:";

function loadQuizState(contentId: string) {
  try {
    const raw = window.localStorage.getItem(`${QUIZ_STATE_PREFIX}${contentId}`);
    if (!raw) return null;
    return JSON.parse(raw) as { answers: Record<number, number>; submitted: boolean };
  } catch {
    return null;
  }
}

function saveQuizState(contentId: string, answers: Record<number, number>, submitted: boolean) {
  window.localStorage.setItem(
    `${QUIZ_STATE_PREFIX}${contentId}`,
    JSON.stringify({ answers, submitted })
  );
}

export function QuizView({ contentId, body, bodyEn, status: initialStatus, isCompleted: initialCompleted = false }: QuizViewProps) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  const [content, setContent] = useState(body);
  const [contentEnState, setContentEnState] = useState(bodyEn || "");
  const [status, setStatus] = useState(initialStatus);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const { isCompleted, markCompleted } = useMarkCompleted(contentId, initialCompleted);

  // Restore saved quiz state on mount; always sync score to DB via direct fetch
  useEffect(() => {
    const saved = loadQuizState(contentId);
    if (!saved?.submitted) return;
    setAnswers(saved.answers);
    setSubmitted(true);
    const qs = parseQuiz(body);
    if (qs.length === 0 || !contentId || !projectId) return;
    const correct = qs.filter((q) => saved.answers[q.id] === q.correctAnswer).length;
    const pct = Math.round((correct / qs.length) * 100);
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentId, projectId, quizScore: pct }),
    }).then((res) => {
      if (res.ok) router.refresh();
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId]);

  // Persist quiz state when answers or submitted change
  useEffect(() => {
    if (submitted) {
      saveQuizState(contentId, answers, submitted);
    }
  }, [contentId, answers, submitted]);

  useEffect(() => {
    setContent(body);
    setContentEnState(bodyEn || "");
    setStatus(initialStatus);
  }, [body, bodyEn, initialStatus]);

  useEffect(() => {
    if (status !== "generating") return;

    const timer = window.setInterval(() => {
      router.refresh();
    }, 4000);

    return () => clearInterval(timer);
  }, [router, status]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setStatus("generating");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId, lang }),
      });

      if (res.ok) {
        const data = await res.json();
        setContent(data.body ?? data.bodyZh ?? "");
        setContentEnState(data.bodyEn ?? "");
        setStatus("ready");
        router.refresh();
      } else {
        const err = await res.json();
        setErrorMessage(err.error || null);
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "generating") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
        <Loader2 className="mb-4 h-8 w-8 animate-spin" />
        <p>{t("quiz.generating")}</p>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground/85">
          {t("quiz.generatingHint")}
        </p>
      </div>
    );
  }

  if (status === "pending" || status === "error" || !content) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        {status === "error" && errorMessage ? (
          <p className="mb-4 max-w-2xl text-center text-base font-semibold leading-7 text-red-600 dark:text-red-400 sm:text-lg">
            {errorMessage}
          </p>
        ) : (
          <p className="text-muted-foreground mb-4">
            {status === "error" ? t("quiz.error") : t("quiz.pending")}
          </p>
        )}
        <Button onClick={handleGenerate}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("quiz.generate")}
        </Button>
      </div>
    );
  }

  const displayBody = lang === "en" && contentEnState ? contentEnState : content;
  const questions = parseQuiz(displayBody);

  if (questions.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>{t("quiz.formatError")}</p>
        <Button onClick={handleGenerate} variant="outline" className="mt-4">
          {t("quiz.regenerate")}
        </Button>
      </div>
    );
  }

  const score = submitted
    ? questions.filter((q) => answers[q.id] === q.correctAnswer).length
    : 0;
  const quizScoreState = getQuizScoreState(score, questions.length);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId, regenerate: true, lang }),
      });
      if (res.ok) {
        const data = await res.json();
        setContent(data.body ?? data.bodyZh ?? "");
        setContentEnState(data.bodyEn ?? "");
        setAnswers({});
        setSubmitted(false);
        window.localStorage.removeItem(`${QUIZ_STATE_PREFIX}${contentId}`);
        router.refresh();
      }
    } catch {
      // Silent
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          disabled={!submitted || isRegenerating}
          onClick={handleRegenerate}
        >
          {isRegenerating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          {lang === "en" ? "New Quiz" : "生成新测验"}
        </Button>
      </div>

      {submitted && (
        <Card className="dark:bg-card/80">
          <CardContent className="py-5 text-center">
            <p className={cn("text-2xl font-bold", getQuizScoreTextClass(quizScoreState))}>
              {t("quiz.score")}: {score} / {questions.length}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {getQuizScoreFeedback(score, questions.length, lang)}
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              {isCompleted && (
                <div
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-full border px-4 text-xs font-medium",
                    getQuizScoreBadgeClass(quizScoreState)
                  )}
                >
                  <span className="text-sm">{getQuizScoreEmoji(quizScoreState)}</span>
                  {lang === "en" ? "Completed" : "已完成"}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-full"
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                  window.localStorage.removeItem(`${QUIZ_STATE_PREFIX}${contentId}`);
                }}
              >
                {t("quiz.retry")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {questions.map((q) => {
        const userCorrect = submitted && answers[q.id] === q.correctAnswer;
        return (
          <Card key={q.id} className="dark:bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold leading-7 sm:text-lg">
                {q.id}. {q.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {q.options.map((opt, i) => {
                const isSelected = answers[q.id] === i;
                const isCorrect = submitted && i === q.correctAnswer;
                const isWrong = submitted && isSelected && i !== q.correctAnswer;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (!submitted) setAnswers((a) => ({ ...a, [q.id]: i }));
                    }}
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 text-left text-sm transition-all",
                      isSelected && !submitted && "border-primary bg-primary/5 shadow-sm",
                      isCorrect && "border-green-500 bg-green-50 dark:bg-green-500/10",
                      isWrong && "border-red-500 bg-red-50 dark:bg-red-500/10",
                      !submitted && !isSelected && "hover:border-primary/30 hover:bg-accent/60"
                    )}
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                          isCorrect && "border-green-500",
                          isWrong && "border-red-500",
                          !isCorrect && !isWrong && isSelected && "border-primary",
                          !isCorrect && !isWrong && !isSelected && "border-muted-foreground/35"
                        )}
                      >
                        <span
                          className={cn(
                            "h-2.5 w-2.5 rounded-full transition-colors",
                            isCorrect && "bg-green-500",
                            isWrong && "bg-red-500",
                            !isCorrect && !isWrong && isSelected && "bg-primary",
                            !isSelected && "bg-transparent"
                          )}
                        />
                      </span>
                      <span className="flex-1 leading-6">{opt}</span>
                    </span>
                  </button>
                );
              })}
              {submitted && answers[q.id] !== undefined && (
                <div
                  className={cn(
                    "mt-3 rounded-xl border-l-4 px-4 py-3 text-sm leading-6 text-muted-foreground",
                    userCorrect
                      ? "border-green-500 bg-green-50/50 dark:bg-green-500/5"
                      : "border-red-500 bg-red-50/50 dark:bg-red-500/5"
                  )}
                >
                  {q.explanation}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {!submitted && questions.length > 0 && (
        <div className="flex flex-col items-center gap-2 pt-2">
          <Button
            onClick={() => {
              setSubmitted(true);
              const correctCount = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
              const pct = Math.round((correctCount / questions.length) * 100);
              markCompleted(pct);
            }}
            disabled={Object.keys(answers).length < questions.length}
            className="rounded-full px-8 py-5 text-sm font-semibold shadow-md transition-transform hover:scale-105"
          >
            {t("quiz.submit")}
          </Button>
          {Object.keys(answers).length < questions.length && (
            <p className="text-xs text-muted-foreground/70">
              {Object.keys(answers).length} / {questions.length}{" "}
              {lang === "en" ? "answered" : "已作答"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
