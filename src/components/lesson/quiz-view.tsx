"use client";

import { useState } from "react";
import { Loader2, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
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
  const [content, setContent] = useState(body);
  const [contentEnState, setContentEnState] = useState(bodyEn || "");
  const [status, setStatus] = useState(initialStatus);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

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
            <CardTitle className="text-sm">
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
                    "w-full text-left px-3 py-2 rounded-md border text-sm transition-colors",
                    isSelected && !submitted && "border-primary bg-primary/5",
                    isCorrect && "border-green-500 bg-green-50",
                    isWrong && "border-red-500 bg-red-50",
                    !submitted && !isSelected && "hover:bg-accent"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {isCorrect && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {isWrong && <XCircle className="h-4 w-4 text-red-500" />}
                    {opt}
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
