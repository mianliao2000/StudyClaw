"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

const content = {
  zh: {
    // About Us
    aboutLabel: "关于我们",
    aboutTitle: "AI 应该是老师，不是搜索引擎",
    aboutBody: [
      "大多数人用 AI 的方式，是把它当成一个更快的搜索框——问一个问题，得到一个答案，然后关掉页面。这没错，但我们觉得 AI 能做的远不止这些。",
      "真正的学习需要结构。你需要知道从哪里开始、每一步学什么、哪里卡住了、怎么把知识串联起来。这些事情，一个好老师才能做到。",
      "我们做 Pandora AI，就是想让 AI 扮演这个角色：帮你规划一条适合你自己的学习路径，生成内容，陪你把一个复杂主题真正学通——而不是给你一堆碎片信息，让你自己去拼。",
    ],
    // How it works
    howLabel: "工作原理",
    howTitle: "从想法到系统学习",
    steps: [
      {
        icon: MessageSquare,
        title: "对话规划",
        desc: "通过几个问题，AI 了解你的背景、目标和时间，生成一份量身定制的课程大纲。",
      },
      {
        icon: BookOpen,
        title: "生成内容",
        desc: "每一章都有课文、总结和测验，中英双语，按你的水平生成，不是模板填空。",
      },
      {
        icon: Brain,
        title: "辅导答疑",
        desc: "每节课配 AI 助教，随时解答疑问，给例子、讲类比——像有个老师在旁边一样。",
      },
    ],
    // Suitable for
    forLabel: "适合谁",
    forItems: [
      "想系统学一个新技术方向，但不知道从哪里入手",
      "看了很多资料，感觉东一块西一块，缺少整体感",
      "有具体目标（考试、项目、转行），需要定向学习路径",
      "喜欢边学边问，不想总是自己去搜索",
    ],
    ctaButton: "开始学习",
    footerAuthor: "作者 / Created by Jackson Liao",
  },
  en: {
    aboutLabel: "About Us",
    aboutTitle: "AI should be a teacher, not a search engine",
    aboutBody: [
      "Most people use AI like a faster search box — ask a question, get an answer, close the tab. That works. But we think AI can do far more than that.",
      "Real learning needs structure. You need to know where to start, what to learn at each step, where you're getting stuck, and how to connect the pieces together. That's what a good teacher does.",
      "We built Pandora AI to let AI play that role: plan a learning path tailored to you, generate the content, and guide you through a complex topic from start to finish — instead of handing you a pile of fragments and leaving you to figure it out.",
    ],
    howLabel: "How It Works",
    howTitle: "From idea to systematic learning",
    steps: [
      {
        icon: MessageSquare,
        title: "Plan through conversation",
        desc: "A few questions help AI understand your background, goals, and schedule — then it builds a course outline designed for you.",
      },
      {
        icon: BookOpen,
        title: "Generate content",
        desc: "Each chapter gets a lesson, summary, and quiz in both languages, written to your level — not template-filled.",
      },
      {
        icon: Brain,
        title: "Tutored as you study",
        desc: "Every lesson has an AI tutor ready to answer questions, give examples, and explain concepts — like having a teacher next to you.",
      },
    ],
    forLabel: "Who it's for",
    forItems: [
      "You want to systematically learn a new technical topic but don't know where to start",
      "You've read a lot but it feels scattered — you're missing the bigger picture",
      "You have a specific goal (exam, project, career change) and need a targeted path",
      "You learn better by asking questions than by searching endlessly",
    ],
    ctaButton: "Start Learning",
    footerAuthor: "Created by Jackson Liao",
  },
} as const;

export default function AboutPage() {
  const { lang, t } = useLanguage();
  const copy = content[lang];

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl px-4 py-14 sm:px-6 sm:py-20">

        {/* ─── About Us ───────────────────────────── */}
        <section className="mb-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            {copy.aboutLabel}
          </p>
          <h1 className="mb-6 text-3xl font-bold leading-snug tracking-tight sm:text-4xl">
            {copy.aboutTitle}
          </h1>
          <div className="space-y-4">
            {copy.aboutBody.map((para, i) => (
              <p key={i} className="leading-7 text-muted-foreground">
                {para}
              </p>
            ))}
          </div>
        </section>

        <hr className="border-border/50" />

        {/* ─── How It Works ───────────────────────── */}
        <section className="mb-16 mt-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            {copy.howLabel}
          </p>
          <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
            {copy.howTitle}
          </h2>
          <div className="space-y-6">
            {copy.steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex gap-4">
                  <div className="mt-0.5 shrink-0 rounded-lg border border-border/60 bg-card p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <hr className="border-border/50" />

        {/* ─── Suitable for ───────────────────────── */}
        <section className="mb-16 mt-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            {copy.forLabel}
          </p>
          <ul className="space-y-3">
            {copy.forItems.map((item, i) => (
              <li key={i} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm leading-6 text-muted-foreground">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ─── CTA ────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/50 px-6 py-5">
          <p className="text-sm font-medium">{t("home.title")}</p>
          <Link href="/dashboard">
            <Button size="sm" className="gap-1.5 shrink-0">
              {copy.ctaButton}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto flex flex-col gap-2 px-4 text-center text-sm text-muted-foreground">
          <div>{t("home.footer")}</div>
          <div>{copy.footerAuthor}</div>
        </div>
      </footer>
    </>
  );
}
