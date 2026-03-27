"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

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

export function QuizView({ contentId, body, bodyEn, status: initialStatus }: QuizViewProps) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [content, setContent] = useState(body);
  const [contentEnState, setContentEnState] = useState(bodyEn || "");
  const [status, setStatus] = useState(initialStatus);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setContent(body);
    setContentEnState(bodyEn || "");
    setStatus(initialStatus);
    setAnswers({});
    setSubmitted(false);
  }, [body, bodyEn, initialStatus]);

  useEffect(() => {
    if (status !== "generating") return;

    const timer = window.setInterval(() => {
      router.refresh();
    }, 4000);

    return () => clearInterval(timer);
  }, [router, status]);

  const handleGenerate = async () => {
    setStatus("generating");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId }),
      });

      if (res.ok) {
        const data = await res.json();
        setContent(data.body ?? data.bodyZh ?? "");
        setContentEnState(data.bodyEn ?? "");
        setStatus("ready");
        router.refresh();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "generating") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>{t("quiz.generating")}</p>
      </div>
    );
  }

  if (status === "pending" || status === "error" || !content) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">
          {status === "error" ? t("quiz.error") : t("quiz.pending")}
        </p>
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

  return (
    <div className="space-y-4">
      {submitted && (
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-lg font-semibold">
              {t("quiz.score")}: {score} / {questions.length}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
            >
              {t("quiz.retry")}
            </Button>
          </CardContent>
        </Card>
      )}

      {questions.map((q) => (
        <Card key={q.id}>
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
              <p className="text-xs text-muted-foreground mt-2 px-1">
                {q.explanation}
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      {!submitted && questions.length > 0 && (
        <Button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < questions.length}
          className="w-full"
        >
          {t("quiz.submit")}
        </Button>
      )}
    </div>
  );
}
