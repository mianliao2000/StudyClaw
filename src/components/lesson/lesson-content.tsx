"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRightCircle,
  Blocks,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  GitBranch,
  KeyRound,
  Lightbulb,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

interface LessonContentProps {
  contentId: string;
  body: string;
  bodyEn?: string;
  status: string;
  contentType: string;
}

interface LessonSection {
  title: string;
  body: string;
  kind: SectionKind;
}

type SupportedLanguage = "zh" | "en";

type SectionKind =
  | "about"
  | "importance"
  | "connection"
  | "intuition"
  | "core"
  | "misunderstandings"
  | "examples"
  | "scenarios"
  | "next"
  | "takeaway"
  | "terms"
  | "default";

const typeKeys: Record<string, TranslationKey> = {
  main: "content.main",
  summary: "content.summary",
  quiz: "content.quiz",
};

const sectionMatchers: Array<{ kind: SectionKind; terms: string[] }> = [
  {
    kind: "about",
    terms: ["what this section is about", "core ideas", "本节在讲什么", "本节核心问题", "核心要点"],
  },
  {
    kind: "importance",
    terms: ["why it matters", "为什么重要", "重要性", "意义"],
  },
  {
    kind: "connection",
    terms: ["how this connects to the course", "与课程的关系", "承上启下", "连接到课程"],
  },
  {
    kind: "intuition",
    terms: ["intuitive explanation", "直觉理解", "直观理解"],
  },
  {
    kind: "core",
    terms: ["core concepts", "核心概念", "概念拆解"],
  },
  {
    kind: "misunderstandings",
    terms: ["common misunderstandings", "common confusions", "常见误区", "常见混淆"],
  },
  {
    kind: "examples",
    terms: ["minimal examples for understanding", "最小可理解例子", "理解例子", "例子"],
  },
  {
    kind: "scenarios",
    terms: ["real-world or engineering scenarios", "真实场景", "工程场景", "应用场景"],
  },
  {
    kind: "next",
    terms: ["what this prepares you for next", "为下一节做什么准备", "接下来会学到什么"],
  },
  {
    kind: "takeaway",
    terms: ["key takeaway", "one-sentence takeaway", "一句话总结", "本节小结"],
  },
  {
    kind: "terms",
    terms: ["key terms", "关键术语"],
  },
];

const sectionMeta: Record<
  SectionKind,
  {
    icon: LucideIcon;
    cardClassName: string;
    iconClassName: string;
    variant: "plain" | "callout";
  }
> = {
  about: {
    icon: BookOpen,
    cardClassName: "border-primary/25",
    iconClassName: "bg-primary/10 text-primary",
    variant: "plain",
  },
  importance: {
    icon: Sparkles,
    cardClassName: "border-amber-400/35 bg-amber-50/90 dark:bg-amber-500/10",
    iconClassName: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
    variant: "callout",
  },
  connection: {
    icon: GitBranch,
    cardClassName: "border-sky-400/30",
    iconClassName: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200",
    variant: "plain",
  },
  intuition: {
    icon: Lightbulb,
    cardClassName: "border-cyan-400/30",
    iconClassName: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-200",
    variant: "plain",
  },
  core: {
    icon: Brain,
    cardClassName: "border-violet-400/30",
    iconClassName: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200",
    variant: "plain",
  },
  misunderstandings: {
    icon: AlertTriangle,
    cardClassName: "border-orange-400/35 bg-orange-50/90 dark:bg-orange-500/10",
    iconClassName: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-200",
    variant: "callout",
  },
  examples: {
    icon: Blocks,
    cardClassName: "border-emerald-400/30 bg-emerald-50/90 dark:bg-emerald-500/10",
    iconClassName: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
    variant: "callout",
  },
  scenarios: {
    icon: BriefcaseBusiness,
    cardClassName: "border-teal-400/30",
    iconClassName: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-200",
    variant: "plain",
  },
  next: {
    icon: ArrowRightCircle,
    cardClassName: "border-blue-400/30 bg-blue-50/90 dark:bg-blue-500/10",
    iconClassName: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200",
    variant: "callout",
  },
  takeaway: {
    icon: Target,
    cardClassName:
      "border-primary/25 bg-gradient-to-r from-primary/10 via-background to-accent/10 shadow-sm",
    iconClassName: "bg-primary/12 text-primary",
    variant: "callout",
  },
  terms: {
    icon: KeyRound,
    cardClassName: "border-fuchsia-400/30 bg-fuchsia-50/90 dark:bg-fuchsia-500/10",
    iconClassName: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-200",
    variant: "callout",
  },
  default: {
    icon: BookOpen,
    cardClassName: "border-border/70",
    iconClassName: "bg-muted text-foreground",
    variant: "plain",
  },
};

const sectionTitles: Record<
  Exclude<SectionKind, "default">,
  { zh: string; en: string }
> = {
  about: {
    zh: "本节讲什么",
    en: "What this section is about",
  },
  importance: {
    zh: "为什么重要",
    en: "Why it matters",
  },
  connection: {
    zh: "与课程的关系",
    en: "How this connects to the course",
  },
  intuition: {
    zh: "直觉理解",
    en: "Intuitive explanation",
  },
  core: {
    zh: "核心概念",
    en: "Core concepts",
  },
  misunderstandings: {
    zh: "常见误区",
    en: "Common misunderstandings",
  },
  examples: {
    zh: "理解例子",
    en: "Minimal examples for understanding",
  },
  scenarios: {
    zh: "真实场景",
    en: "Real-world or engineering scenarios",
  },
  next: {
    zh: "下一步会学什么",
    en: "What this prepares you for next",
  },
  takeaway: {
    zh: "一句话总结",
    en: "Key takeaway",
  },
  terms: {
    zh: "关键术语",
    en: "Key terms",
  },
};

const markdownComponents: Components = {
  table: ({ children }) => (
    <div className="my-5 overflow-x-auto rounded-2xl border border-border/70">
      <table className="min-w-full border-collapse bg-background/80 text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted/70">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-border/70 px-4 py-3 text-left text-sm font-semibold text-foreground">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-border/50 px-4 py-3 align-top text-sm text-foreground/90">
      {children}
    </td>
  ),
  strong: ({ children }) => (
    <strong className="rounded-md bg-primary/10 px-1.5 py-0.5 font-semibold text-foreground shadow-[inset_0_-1px_0_0_rgba(16,185,129,0.18)]">
      {children}
    </strong>
  ),
  a: ({ href, children }) => (
    <a
      className="font-medium text-primary underline decoration-primary/35 underline-offset-4 transition-colors hover:text-primary/80"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  ),
};

function looksLikeMathExpression(value: string) {
  const text = value.trim();
  if (!text || text.length > 160) return false;

  const hasLatexCommand = /\\[a-zA-Z]+/.test(text);
  const hasEquationOperator = /[=<>+\-*/^_]/.test(text);
  const hasMathToken = /[A-Za-z]\s*(?:\(|\[)|\b(?:sin|cos|tan|log|ln|max|min)\b/.test(text);

  return hasLatexCommand || (hasEquationOperator && hasMathToken);
}

function normalizeBoldMarkers(markdown: string) {
  return markdown.replace(/\*\*\s*([^*\n][^*\n]*?)\s*\*\*/g, (_, content: string) => {
    const cleaned = content.trim();
    return cleaned ? `**${cleaned}**` : _;
  });
}

function repairDanglingInlineLatex(markdown: string) {
  let result = "";

  for (let index = 0; index < markdown.length; index += 1) {
    if (markdown[index] === "\\" && markdown[index + 1] === "(") {
      const closeIndex = markdown.indexOf("\\)", index + 2);

      if (closeIndex !== -1) {
        result += markdown.slice(index, closeIndex + 2);
        index = closeIndex + 1;
        continue;
      }

      let cursor = index + 2;
      while (cursor < markdown.length) {
        const current = markdown[cursor];
        if ("\n。！？；;,.，".includes(current)) break;
        cursor += 1;
      }

      const candidate = markdown.slice(index + 2, cursor).trim();
      if (looksLikeMathExpression(candidate)) {
        result += `$${candidate}$`;
        index = cursor - 1;
        continue;
      }
    }

    result += markdown[index];
  }

  return result;
}

function normalizeInlineMath(markdown: string) {
  let normalized = normalizeBoldMarkers(markdown)
    .replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_, expr: string) => `\n\n$$${expr.trim()}$$\n\n`)
    .replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_, expr: string) => `$${expr.trim()}$`);

  normalized = repairDanglingInlineLatex(normalized);

  let result = "";

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];

    if (char !== "(") {
      result += char;
      continue;
    }

    let depth = 1;
    let cursor = index + 1;

    while (cursor < normalized.length && depth > 0) {
      const current = normalized[cursor];
      if (current === "(") depth += 1;
      if (current === ")") depth -= 1;
      cursor += 1;
    }

    if (depth !== 0) {
      result += char;
      continue;
    }

    const inner = normalized.slice(index + 1, cursor - 1);

    if (looksLikeMathExpression(inner)) {
      result += `$${inner.trim()}$`;
      index = cursor - 1;
      continue;
    }

    result += normalized.slice(index, cursor);
    index = cursor - 1;
  }

  normalized = result
    .replace(/\$\$\s+([\s\S]*?)\s+\$\$/g, (_, expr: string) => `$$${expr.trim()}$$`)
    .replace(/\$\s+([^$]*?)\s+\$/g, (_, expr: string) => `$${expr.trim()}$`);

  return normalized;
}

function normalizeHeadingTitle(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function classifySection(title: string): SectionKind {
  const normalizedTitle = normalizeHeadingTitle(title);

  for (const matcher of sectionMatchers) {
    if (matcher.terms.some((term) => normalizedTitle.includes(normalizeHeadingTitle(term)))) {
      return matcher.kind;
    }
  }

  return "default";
}

function parseLessonContent(markdown: string) {
  const headingRegex = /^##\s+(.+)$/gm;
  const matches = Array.from(markdown.matchAll(headingRegex));

  if (matches.length === 0) {
    return {
      intro: markdown.trim(),
      sections: [] as LessonSection[],
    };
  }

  const intro = markdown.slice(0, matches[0]?.index ?? 0).trim();
  const sections = matches
    .map((match, index) => {
      const title = match[1]?.trim() ?? "";
      const bodyStart = (match.index ?? 0) + match[0].length;
      const bodyEnd = matches[index + 1]?.index ?? markdown.length;
      const body = markdown.slice(bodyStart, bodyEnd).trim();

      return {
        title,
        body,
        kind: classifySection(title),
      };
    })
    .filter((section) => section.title || section.body);

  return { intro, sections };
}

function getSectionDisplayTitle(section: LessonSection, lang: SupportedLanguage) {
  if (section.kind === "default") return section.title;
  return sectionTitles[section.kind][lang];
}

function LessonMarkdown({ markdown }: { markdown: string }) {
  const normalizedMarkdown = useMemo(() => normalizeInlineMath(markdown), [markdown]);

  return (
    <div className="lesson-markdown">
      <ReactMarkdown
        components={markdownComponents}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {normalizedMarkdown}
      </ReactMarkdown>
    </div>
  );
}

function LessonGuide({
  contentType,
  lang,
}: {
  contentType: string;
  lang: "zh" | "en";
}) {
  const title =
    contentType === "summary"
      ? lang === "en"
        ? "Review guide"
        : "复习导读"
      : lang === "en"
        ? "Learning guide"
        : "学习导读";

  const description =
    contentType === "summary"
      ? lang === "en"
        ? "Use this page to quickly review the core ideas, key terms, and common confusions before moving on."
        : "把这一页当作快速复习卡，先抓住核心概念、关键术语和常见误区，再继续学习。"
      : lang === "en"
        ? "Read this section from intuition to scenarios, and treat the highlighted concepts as the ideas to remember first."
        : "建议先从直觉理解读起，再看场景和误区；高亮的关键概念就是这一节最值得先记住的内容。";

  return (
    <Card className="mb-6 border-primary/15 bg-gradient-to-r from-primary/6 via-background to-accent/6">
      <CardContent className="flex items-start gap-3 px-5 py-4 sm:px-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Target className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function LessonSectionCard({
  section,
  lang,
}: {
  section: LessonSection;
  lang: SupportedLanguage;
}) {
  const meta = sectionMeta[section.kind];
  const Icon = meta.icon;
  const displayTitle = getSectionDisplayTitle(section, lang);

  if (meta.variant === "plain") {
    return (
      <section
        className={cn(
          "rounded-3xl border-l-4 bg-transparent px-0 py-1 shadow-none",
          meta.cardClassName
        )}
      >
        <div className="flex items-start gap-4 pl-5 sm:pl-6">
          <div
            className={cn(
              "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
              meta.iconClassName
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 pr-1">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {displayTitle}
            </h2>
            {section.body ? (
              <div className="mt-4 max-w-[78ch]">
                <LessonMarkdown markdown={section.body} />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <Card className={cn("overflow-hidden border shadow-sm", meta.cardClassName)}>
      <CardContent className="px-5 py-5 sm:px-6 lg:px-7">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
              meta.iconClassName
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {displayTitle}
            </h2>
            {section.body ? (
              <div className="mt-4 max-w-[82ch]">
                <LessonMarkdown markdown={section.body} />
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FallbackLessonBody({
  intro,
}: {
  intro: string;
}) {
  return (
    <div className="rounded-3xl border-l-4 border-primary/20 bg-transparent px-0 py-1">
      <div className="max-w-[78ch] pl-5 pr-1 sm:pl-6">
        <LessonMarkdown markdown={intro} />
      </div>
    </div>
  );
}

export function LessonContent({
  contentId,
  body,
  bodyEn,
  status: initialStatus,
  contentType,
}: LessonContentProps) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [content, setContent] = useState(body);
  const [contentEnState, setContentEnState] = useState(bodyEn || "");
  const [status, setStatus] = useState(initialStatus);

  const displayContent = lang === "en" && contentEnState ? contentEnState : content;
  const typeLabel = typeKeys[contentType] ? t(typeKeys[contentType]) : contentType;
  const parsedContent = useMemo(() => parseLessonContent(displayContent), [displayContent]);

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
        const err = await res.json();
        alert(err.error || t("content.error"));
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "generating") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="mb-4 h-8 w-8 animate-spin" />
        <p>
          {t("content.generating")}
          {typeLabel}...
        </p>
      </div>
    );
  }

  if (status === "pending" || status === "error" || !content) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="mb-4 text-muted-foreground">
          {status === "error" ? t("content.error") : `${typeLabel}${t("content.notReady")}`}
        </p>
        <Button onClick={handleGenerate}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {status === "error" ? t("content.regenerate") : t("content.generate")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LessonGuide contentType={contentType} lang={lang} />

      {parsedContent.intro && parsedContent.sections.length > 0 ? (
        <FallbackLessonBody intro={parsedContent.intro} />
      ) : null}

      {parsedContent.sections.length > 0 ? (
        <div className="space-y-5">
          {parsedContent.sections.map((section) => (
            <LessonSectionCard
              key={`${section.kind}:${section.title}`}
              section={section}
              lang={lang}
            />
          ))}
        </div>
      ) : (
        <FallbackLessonBody intro={parsedContent.intro || displayContent} />
      )}
    </div>
  );
}
