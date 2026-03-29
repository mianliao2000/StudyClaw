"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRightCircle,
  Blocks,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
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
import { normalizeMarkdownMath } from "@/lib/markdown-math";
import { cn } from "@/lib/utils";
import { useMarkCompleted } from "@/lib/use-mark-completed";

interface LessonContentProps {
  contentId: string;
  body: string;
  bodyEn?: string;
  status: string;
  contentType: string;
  isCompleted?: boolean;
  diagramBase64?: string | null;
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
    terms: [
      "what this section is about",
      "core ideas",
      "\u672c\u8282\u5728\u8bb2\u4ec0\u4e48",
      "\u672c\u8282\u6838\u5fc3\u95ee\u9898",
      "\u6838\u5fc3\u8981\u70b9",
    ],
  },
  {
    kind: "importance",
    terms: ["why it matters", "\u4e3a\u4ec0\u4e48\u91cd\u8981", "\u91cd\u8981\u6027", "\u610f\u4e49"],
  },
  {
    kind: "connection",
    terms: [
      "how this connects to the course",
      "\u4e0e\u8bfe\u7a0b\u7684\u5173\u7cfb",
      "\u627f\u4e0a\u542f\u4e0b",
      "\u8fde\u63a5\u5230\u8bfe\u7a0b",
    ],
  },
  {
    kind: "intuition",
    terms: ["intuitive explanation", "\u76f4\u89c9\u7406\u89e3", "\u76f4\u89c2\u7406\u89e3"],
  },
  {
    kind: "core",
    terms: ["core concepts", "\u6838\u5fc3\u6982\u5ff5", "\u6982\u5ff5\u62c6\u89e3"],
  },
  {
    kind: "misunderstandings",
    terms: [
      "common misunderstandings",
      "common confusions",
      "\u5e38\u89c1\u8bef\u533a",
      "\u5e38\u89c1\u6df7\u6dc6",
    ],
  },
  {
    kind: "examples",
    terms: [
      "minimal examples for understanding",
      "\u6700\u5c0f\u53ef\u7406\u89e3\u4f8b\u5b50",
      "\u7406\u89e3\u4f8b\u5b50",
      "\u4f8b\u5b50",
    ],
  },
  {
    kind: "scenarios",
    terms: [
      "real-world or engineering scenarios",
      "\u771f\u5b9e\u573a\u666f",
      "\u5de5\u7a0b\u573a\u666f",
      "\u5e94\u7528\u573a\u666f",
    ],
  },
  {
    kind: "next",
    terms: [
      "what this prepares you for next",
      "\u4e3a\u4e0b\u4e00\u8282\u505a\u4ec0\u4e48\u51c6\u5907",
      "\u63a5\u4e0b\u6765\u4f1a\u5b66\u5230\u4ec0\u4e48",
    ],
  },
  {
    kind: "takeaway",
    terms: [
      "key takeaway",
      "one-sentence takeaway",
      "\u4e00\u53e5\u8bdd\u603b\u7ed3",
      "\u672c\u8282\u5c0f\u7ed3",
    ],
  },
  {
    kind: "terms",
    terms: ["key terms", "\u5173\u952e\u672f\u8bed"],
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
    zh: "\u672c\u8282\u8bb2\u4ec0\u4e48",
    en: "What this section is about",
  },
  importance: {
    zh: "\u4e3a\u4ec0\u4e48\u91cd\u8981",
    en: "Why it matters",
  },
  connection: {
    zh: "\u4e0e\u8bfe\u7a0b\u7684\u5173\u7cfb",
    en: "How this connects to the course",
  },
  intuition: {
    zh: "\u76f4\u89c9\u7406\u89e3",
    en: "Intuitive explanation",
  },
  core: {
    zh: "\u6838\u5fc3\u6982\u5ff5",
    en: "Core concepts",
  },
  misunderstandings: {
    zh: "\u5e38\u89c1\u8bef\u533a",
    en: "Common misunderstandings",
  },
  examples: {
    zh: "\u7406\u89e3\u4f8b\u5b50",
    en: "Minimal examples for understanding",
  },
  scenarios: {
    zh: "\u771f\u5b9e\u573a\u666f",
    en: "Real-world or engineering scenarios",
  },
  next: {
    zh: "\u4e0b\u4e00\u6b65\u4f1a\u5b66\u4ec0\u4e48",
    en: "What this prepares you for next",
  },
  takeaway: {
    zh: "\u4e00\u53e5\u8bdd\u603b\u7ed3",
    en: "Key takeaway",
  },
  terms: {
    zh: "\u5173\u952e\u672f\u8bed",
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
  const normalizedMarkdown = useMemo(() => normalizeMarkdownMath(markdown), [markdown]);

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
        : "\u590d\u4e60\u5bfc\u8bfb"
      : lang === "en"
        ? "Learning guide"
        : "\u5b66\u4e60\u5bfc\u8bfb";

  const description =
    contentType === "summary"
      ? lang === "en"
        ? "Use this page to quickly review the core ideas, key terms, and common confusions before moving on."
        : "\u628a\u8fd9\u4e00\u9875\u5f53\u4f5c\u5feb\u901f\u590d\u4e60\u5361\uff0c\u5148\u6293\u4f4f\u6838\u5fc3\u6982\u5ff5\u3001\u5173\u952e\u672f\u8bed\u548c\u5e38\u89c1\u8bef\u533a\uff0c\u518d\u7ee7\u7eed\u5b66\u4e60\u3002"
      : lang === "en"
        ? "Read this section from intuition to scenarios, and treat the highlighted concepts as the ideas to remember first."
        : "\u5efa\u8bae\u5148\u4ece\u76f4\u89c9\u7406\u89e3\u8bfb\u8d77\uff0c\u518d\u770b\u573a\u666f\u548c\u8bef\u533a\uff1b\u9ad8\u4eae\u7684\u5173\u952e\u6982\u5ff5\u5c31\u662f\u8fd9\u4e00\u8282\u6700\u503c\u5f97\u5148\u8bb0\u4f4f\u7684\u5185\u5bb9\u3002";

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
  compact = false,
}: {
  section: LessonSection;
  lang: SupportedLanguage;
  compact?: boolean;
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
              <div className="mt-4 max-w-[80ch]">
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
      <CardContent className={cn("px-5 sm:px-6 lg:px-7", compact ? "py-4" : "py-5")}>
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
              <div className="mt-4 max-w-[80ch]">
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
      <div className="max-w-[80ch] pl-5 pr-1 text-muted-foreground italic sm:pl-6">
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
  isCompleted: initialCompleted = false,
  diagramBase64,
}: LessonContentProps) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const projectId = params.projectId as string;
  const chapterId = params.chapterId as string;
  const subchapterId = params.subchapterId as string;
  const [content, setContent] = useState(body);
  const [contentEnState, setContentEnState] = useState(bodyEn || "");
  const [status, setStatus] = useState(initialStatus);
  const [diagramData, setDiagramData] = useState(diagramBase64 || null);

  const { isCompleted, isMarking, markCompleted } = useMarkCompleted(contentId, initialCompleted);

  const displayContent = lang === "en" && contentEnState ? contentEnState : content;
  const typeLabel = typeKeys[contentType] ? t(typeKeys[contentType]) : contentType;
  const parsedContent = useMemo(() => parseLessonContent(displayContent), [displayContent]);

  useEffect(() => {
    setContent(body);
    setContentEnState(bodyEn || "");
    setStatus(initialStatus);
    setDiagramData(diagramBase64 || null);
  }, [body, bodyEn, diagramBase64, initialStatus]);

  useEffect(() => {
    if (status !== "generating") return;

    const timer = window.setInterval(() => {
      router.refresh();
    }, 4000);

    return () => clearInterval(timer);
  }, [router, status]);

  useEffect(() => {
    if (!contentId || !projectId || !chapterId || !subchapterId) return;

    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentId,
        projectId,
        chapterId,
        subchapterId,
        trackOnly: true,
      }),
    }).catch(() => {
      // Silent ? visit tracking is best-effort
    });
  }, [chapterId, contentId, projectId, subchapterId]);

  useEffect(() => {
    if (typeof window === "undefined" || !projectId || !pathname) return;
    window.localStorage.setItem(`studyclaw:last-project-path:${projectId}`, pathname);
  }, [pathname, projectId]);

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
        setDiagramData(data.diagramBase64 || null);
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
        <p>
          {t("content.generating")}
          {typeLabel}...
        </p>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground/85">
          {t("content.generatingHint")}
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
          <p className="mb-4 text-muted-foreground">
            {status === "error" ? t("content.error") : `${typeLabel}${t("content.notReady")}`}
          </p>
        )}
        <Button onClick={handleGenerate}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {status === "error" ? t("content.regenerate") : t("content.generate")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {diagramData && contentType === "main" ? (
        <Card className="overflow-hidden border-primary/15">
          <CardContent className="flex flex-col items-center px-4 py-5 sm:px-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <GitBranch className="h-4 w-4" />
              <span>{lang === "en" ? "Visual Guide" : "\u8bb2\u89e3\u56fe"}</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/png;base64,${diagramData}`}
              alt={lang === "en" ? "Lesson diagram" : "\u6b63\u6587\u8bb2\u89e3\u56fe"}
              className="max-h-[500px] w-full max-w-3xl object-contain"
            />
          </CardContent>
        </Card>
      ) : null}
      <LessonGuide contentType={contentType} lang={lang} />

      {parsedContent.intro && parsedContent.sections.length > 0 ? (
        <FallbackLessonBody intro={parsedContent.intro} />
      ) : null}

      {parsedContent.sections.length > 0 ? (
        <div className="space-y-6">
          {parsedContent.sections.map((section) => (
            <LessonSectionCard
              key={`${section.kind}:${section.title}`}
              section={section}
              lang={lang}
              compact={contentType === "summary"}
            />
          ))}
        </div>
      ) : (
        <FallbackLessonBody intro={parsedContent.intro || displayContent} />
      )}

      <div className="flex justify-center pt-4 pb-2">
        {isCompleted ? (
          <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-50 px-5 py-2.5 text-sm font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            {lang === "en" ? "Completed" : "\u5df2\u5b8c\u6210"}
          </div>
        ) : (
          <Button
            onClick={() => markCompleted()}
            disabled={isMarking}
            className="gap-2 rounded-full px-6"
          >
            {isMarking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {lang === "en" ? "Mark as Read" : "\u6807\u8bb0\u4e3a\u5df2\u8bfb"}
          </Button>
        )}
      </div>
    </div>
  );
}

