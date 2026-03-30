"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  FileText,
  Frown,
  MessageSquare,
  Search,
  Sparkles,
  Target,
  Wand2,
  XCircle,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { getExampleCourses } from "@/lib/examples/catalog";
import { useLanguage } from "@/lib/i18n";

type HomeStats = {
  activeProjects: number;
  completedItems: number;
  overallPercent: number;
};

type PreviewMessage = {
  role: "user" | "assistant";
  content: string;
  options?: string[];
  selectedOption?: string;
};

type CompareCard = {
  title: string;
  description: string;
  points: string[];
  accent?: boolean;
  tone: "positive" | "negative" | "warning";
};

const TOPICS = [
  { zh: "AI Agent 开发", en: "AI Agent Development" },
  { zh: "系统设计", en: "System Design" },
  { zh: "控制理论", en: "Control Theory" },
  { zh: "React 全栈开发", en: "React Full-Stack" },
  { zh: "MATLAB/Simulink", en: "MATLAB/Simulink" },
  { zh: "嵌入式系统", en: "Embedded Systems" },
  { zh: "电力电子学", en: "Power Electronics" },
  { zh: "数据库系统", en: "Database Systems" },
  { zh: "机器学习基础", en: "Machine Learning Foundations" },
  { zh: "信号与系统", en: "Signals and Systems" },
  { zh: "Python 数据分析", en: "Python Data Analysis" },
  { zh: "计算机体系结构", en: "Computer Architecture" },
] as const;

const OFFICIAL_SAMPLE_COURSES = getExampleCourses();

export default function HomePage() {
  const { lang } = useLanguage();
  const { data: session } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [stats, setStats] = useState<HomeStats | null>(null);
  const [isLaunchingProject, setIsLaunchingProject] = useState(false);
  const [featuredCourseIndex, setFeaturedCourseIndex] = useState(0);
  const [isFeaturedHovered, setIsFeaturedHovered] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isZh = lang === "zh";
  const text = (zh: string, en: string) => (isZh ? zh : en);
  const officialSampleCards = OFFICIAL_SAMPLE_COURSES.map((course) => {
    const chapterCount = course.chapters.length;
    const lessonCount = course.chapters.reduce(
      (total, chapter) => total + chapter.subchapters.length,
      0
    );

    return {
      ...course,
      chapterCount,
      lessonCount,
      chapterPreview: course.chapters.slice(0, 3),
    };
  });
  const featuredCourse = officialSampleCards[featuredCourseIndex] ?? null;
  const featuredCourseAccentClass =
    [
      "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
      "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    ][featuredCourseIndex % 4];
  const featuredCourseShellClass =
    [
      "border-cyan-200/80 bg-cyan-50/75 dark:border-cyan-500/20 dark:bg-cyan-500/10",
      "border-amber-200/80 bg-amber-50/75 dark:border-amber-500/20 dark:bg-amber-500/10",
      "border-emerald-200/80 bg-emerald-50/75 dark:border-emerald-500/20 dark:bg-emerald-500/10",
      "border-sky-200/80 bg-sky-50/75 dark:border-sky-500/20 dark:bg-sky-500/10",
    ][featuredCourseIndex % 4];
  const featuredCourseSurfaceClass =
    [
      "border-cyan-200/70 bg-cyan-50/80 dark:border-cyan-500/20 dark:bg-cyan-500/10",
      "border-amber-200/70 bg-amber-50/80 dark:border-amber-500/20 dark:bg-amber-500/10",
      "border-emerald-200/70 bg-emerald-50/80 dark:border-emerald-500/20 dark:bg-emerald-500/10",
      "border-sky-200/70 bg-sky-50/80 dark:border-sky-500/20 dark:bg-sky-500/10",
    ][featuredCourseIndex % 4];

  useEffect(() => {
    if (!session?.user?.id) {
      setStats(null);
      return;
    }

    let mounted = true;

    fetch("/api/user/stats")
      .then((response) => {
        if (!response.ok) throw new Error("stats");
        return response.json() as Promise<HomeStats>;
      })
      .then((data) => {
        if (mounted) setStats(data);
      })
      .catch(() => {
        if (mounted) setStats(null);
      });

    return () => {
      mounted = false;
    };
  }, [session?.user?.id]);

  useEffect(() => {
    if (officialSampleCards.length <= 1 || isFeaturedHovered) return;

    const intervalId = window.setInterval(() => {
      setFeaturedCourseIndex((currentIndex) =>
        (currentIndex + 1) % officialSampleCards.length
      );
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, [isFeaturedHovered, officialSampleCards.length]);

  const launchPrompt = async (nextPrompt: string) => {
    const normalized = nextPrompt.trim();
    if (!normalized) return;

    setIsLaunchingProject(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: normalized,
          topic: normalized,
        }),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const project = (await response.json()) as { id?: string };
      if (!project.id) {
        throw new Error("Project id missing");
      }

      startTransition(() => {
        router.push(
          `/projects/${project.id}/plan?start=${encodeURIComponent(normalized)}`
        );
      });
    } catch (error) {
      console.error("[launchPrompt] Failed to create project directly:", error);
      router.push(`/projects/new?prompt=${encodeURIComponent(normalized)}`);
    } finally {
      setIsLaunchingProject(false);
    }
  };

  const previewConversation: PreviewMessage[] = isZh
    ? [
        { role: "user", content: "AI Agent 开发入门到实战" },
        {
          role: "assistant",
          content: "明白了 为了帮你把 AI Agent 课程规划得更贴近现在的阶段，我会先用几个启发式问题帮你收窄方向",
          options: [
            "A. 我是零基础或刚入门，需要先理解 Agent 的基本概念和工作方式",
            "B. 我会一点开发，想系统掌握工具调用、记忆和多步执行",
            "C. 我已经做过一些 Agent 项目，想深入优化效果和落地能力",
          ],
          selectedOption: "B. 我会一点开发，想系统掌握工具调用、记忆和多步执行",
        },
        {
          role: "assistant",
          content: "很好 这说明你更适合从 Agent 架构到实战工作流的系统路线开始 我再确认一下你的学习节奏",
          options: [
            "A. 每周 2-3 小时，适合轻量探索和概念入门",
            "B. 每周 5-6 小时，可以安排较系统的学习和练习",
            "C. 每周 10 小时以上，希望尽快做出能运行的项目原型",
          ],
          selectedOption: "B. 每周 5-6 小时，可以安排较系统的学习和练习",
        },
        {
          role: "assistant",
          content: "收到 我会为你生成一条从 Agent 基础、工具调用与记忆，到工作流编排和效果优化的课程路径，并为每一章配套正文、总结和测验",
        },
      ]
    : [
        { role: "user", content: "AI Agent Development from Basics to Practice" },
        {
          role: "assistant",
          content: "Got it To shape your AI agent course around your current level, I will first use a few guided questions to narrow the direction",
          options: [
            "A. I am just getting started and want the core ideas and workflow first",
            "B. I know some development basics and want a structured path through tools memory and multi-step execution",
            "C. I have built a few agent prototypes and want to improve quality and real-world delivery",
          ],
          selectedOption:
            "B. I know some development basics and want a structured path through tools memory and multi-step execution",
        },
        {
          role: "assistant",
          content: "Great That points to a more systematic path from agent architecture to practical workflows Let me confirm your pace next",
          options: [
            "A. 2-3 hours a week, better for lighter exploration",
            "B. 5-6 hours a week, enough for structured study and practice",
            "C. 10+ hours a week, aiming to build working prototypes quickly",
          ],
          selectedOption:
            "B. 5-6 hours a week, enough for structured study and practice",
        },
        {
          role: "assistant",
          content: "Perfect I will generate a path from agent fundamentals and tool use to memory workflow orchestration and evaluation, with lessons summaries and quizzes for each chapter",
        },
      ];

  const compareCards: CompareCard[] = [
    {
      title: text("普通聊天", "Normal chat"),
      description: text(
        "擅长回答当下的一个问题，但很难直接变成完整的学习路径",
        "Good for one answer, but weak at turning that answer into a full learning path"
      ),
      points: [
        text("只答一题", "One answer"),
        text("不成体系", "No structure"),
        text("节奏自管", "Self paced"),
      ],
      tone: "negative",
    },
    {
      title: text("搜索资料", "Search"),
      description: text(
        "擅长找到很多资料，但很少帮你把这些内容重组成可学的课程",
        "Good for finding information, but weak at reshaping it into a course you can follow"
      ),
      points: [
        text("资料很多", "Many sources"),
        text("信息分散", "Scattered info"),
        text("还要自己拼", "Need to stitch"),
      ],
      tone: "warning",
    },
    {
      title: "Pandora AI",
      description: text(
        "把模糊目标变成可执行的学习路径，而且能一路陪你学下去",
        "Turns a vague goal into an actionable learning path, then keeps supporting the learning"
      ),
      points: [
        text("对话收窄", "Guided narrowing"),
        text("自动成课", "Auto course"),
        text("边学边问", "Ask while learning"),
      ],
      accent: true,
      tone: "positive",
    },
  ];

  const localizedTopics = TOPICS.map((topic) => (isZh ? topic.zh : topic.en));
  const scrollingTopics = [...localizedTopics, ...localizedTopics];
  const flowToneClasses = [
    "home-tone-goal",
    "home-tone-choice",
    "home-tone-deliver",
  ] as const;
  const planningSteps = [
    {
      title: text("先说目标", "Say the goal"),
      detail: text(
        "输入你想学的方向、项目目标或当前难点",
        "Start with the topic, project, or challenge you want to learn"
      ),
      icon: Search,
    },
    {
      title: text("再做选择", "Choose the direction"),
      detail: text(
        "AI 用启发式问题和选项帮你收窄范围",
        "AI uses guided questions and options to narrow the path"
      ),
      icon: Target,
    },
    {
      title: text("得到课程", "Get the course"),
      detail: text(
        "直接拿到章节、正文、总结、测验和 AI 辅导",
        "Receive chapters, lessons, summaries, quizzes, and AI tutoring"
      ),
      icon: Wand2,
    },
  ] as const;
  const compareToneMeta = {
    positive: {
      Icon: CheckCircle2,
      iconClass: "text-emerald-500 dark:text-emerald-300",
    },
    negative: {
      Icon: XCircle,
      iconClass: "text-rose-500 dark:text-rose-300",
    },
    warning: {
      Icon: Frown,
      iconClass: "text-amber-500 dark:text-amber-300",
    },
  } as const;

  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12]" />
        <div className="home-hero-top-glow pointer-events-none absolute inset-x-0 top-0 h-[34rem]" />
        <div className="home-hero-orb-left pointer-events-none absolute left-[-8rem] top-36 h-72 w-72 rounded-full blur-3xl" />
        <div className="home-hero-orb-right pointer-events-none absolute right-[-8rem] top-24 h-80 w-80 rounded-full blur-3xl" />

        <section className="relative container mx-auto px-4 pb-10 pt-18 sm:pt-24">
          <div className="grid items-start gap-8 xl:grid-cols-[1.12fr_0.88fr]">
            <div className="max-w-3xl">
              <div className="home-badge-hero inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                {text("AI 驱动的个性化学习平台", "AI-powered personalized learning platform")}
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl lang-en:text-3xl lang-en:sm:text-5xl lang-en:lg:text-6xl lang-en:leading-[1.1] text-balance dark:text-white">
                {text("把目标变成课程", "Turn a goal into a course")}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg dark:text-white/68">
                {text(
                  "几轮对话，生成课程与材料",
                  "A few turns, then course and materials"
                )}
              </p>

              <form
                className="home-shell-hero mt-8 rounded-[2rem] border border-border/60 p-3 dark:border-white/10"
                onSubmit={(event) => {
                  event.preventDefault();
                  launchPrompt(prompt);
                }}
              >
                <div className="flex flex-col gap-3 lg:flex-row">
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" || event.shiftKey) return;
                      if (event.nativeEvent.isComposing) return;
                      if (isPending || isLaunchingProject || !prompt.trim()) return;

                      event.preventDefault();
                      launchPrompt(prompt);
                    }}
                    placeholder={text(
                      "告诉 AI 你想学什么，例如：我想系统学习 AI Agent 开发",
                      "Tell AI what you want to learn, for example: I want to systematically learn AI agent development"
                    )}
                    className="min-h-[76px] flex-1 resize-none rounded-[1.4rem] border border-border/60 bg-background/80 px-5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary/35 focus:ring-2 focus:ring-primary/12 dark:border-white/10 dark:bg-black/15 dark:text-white dark:placeholder:text-white/38"
                  />
                  <div className="flex w-full flex-col justify-center lg:w-auto lg:self-center">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isPending || isLaunchingProject || !prompt.trim()}
                      className="h-12 rounded-[1.25rem] px-6 text-sm shadow-lg shadow-primary/20 lg:w-auto"
                    >
                      {isLaunchingProject
                        ? text("正在启动对话", "Starting the conversation")
                        : text("开始规划课程", "Plan My Course")}
                    </Button>
                  </div>
                </div>
              </form>

            </div>

            <div className="relative xl:pt-10">
              {featuredCourse ? (
                <div
                  className={`group rounded-[1.9rem] border p-3.5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 ${featuredCourseShellClass}`}
                  onMouseEnter={() => setIsFeaturedHovered(true)}
                  onMouseLeave={() => setIsFeaturedHovered(false)}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 items-center justify-center gap-3 sm:pl-10">
                      <div className="home-badge-neutral inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                        <BookOpen className="h-3.5 w-3.5" />
                        {text("点开即学", "Start Instantly")}
                      </div>
                      <div className="text-lg font-bold tracking-normal text-foreground sm:text-xl dark:text-white">
                        {text("精选示例课", "Featured Sample Courses")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={text("上一门示例课", "Previous sample course")}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground transition-colors hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-white"
                        onClick={() =>
                          setFeaturedCourseIndex((currentIndex) =>
                            currentIndex === 0
                              ? officialSampleCards.length - 1
                              : currentIndex - 1
                          )
                        }
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={text("下一门示例课", "Next sample course")}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground transition-colors hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-white"
                        onClick={() =>
                          setFeaturedCourseIndex((currentIndex) =>
                            (currentIndex + 1) % officialSampleCards.length
                          )
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <Link
                    href={`/examples/${featuredCourse.slug}`}
                    className="mt-3 block rounded-[1.25rem] p-3.5 transition-all"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-3">
                          <div className={`inline-flex rounded-2xl p-3 ${featuredCourseAccentClass}`}>
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary dark:text-white">
                              {isZh
                                ? featuredCourse.title
                                : featuredCourse.titleEn || featuredCourse.title}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground dark:text-white/62">
                              {isZh
                                ? featuredCourse.description
                                : featuredCourse.descriptionEn || featuredCourse.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2.5 overflow-hidden text-xs font-medium text-muted-foreground dark:text-white/68">
                          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                            {featuredCourse.chapterPreview.slice(0, 2).map((chapter, chapterIndex) => (
                              <span
                                key={chapter.slug}
                                className="inline-flex min-w-0 items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 dark:border-white/10 dark:bg-white/5 dark:text-white/85"
                              >
                                <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary dark:bg-primary/20">
                                  {chapterIndex + 1}
                                </span>
                                <span className="truncate">
                                  {isZh ? chapter.title : chapter.titleEn || chapter.title}
                                </span>
                              </span>
                            ))}
                            <span className="shrink-0 text-sm tracking-[0.2em] text-muted-foreground/80 dark:text-white/45">
                              ...
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="mt-3 flex items-center justify-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition-transform group-hover:translate-x-0.5">
                        {text("立即学习", "Start Learning")}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>

                  <div className="mt-3 flex items-center justify-center gap-2">
                    {officialSampleCards.map((course, index) => (
                      <button
                        key={course.slug}
                        type="button"
                        aria-label={`${text("切换到", "Go to")} ${isZh ? course.title : course.titleEn || course.title}`}
                        className={`h-2.5 rounded-full transition-all ${
                          featuredCourseIndex === index
                            ? "w-8 bg-primary"
                            : "w-2.5 bg-border hover:bg-primary/35 dark:bg-white/15 dark:hover:bg-primary/45"
                        }`}
                        onClick={() => setFeaturedCourseIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="relative container mx-auto px-4 pb-10">
          <div className="home-shell-neutral rounded-[2.1rem] border border-border/60 p-5 dark:border-white/10 sm:p-6">
            <div className="mb-5 max-w-4xl">
              <div className="flex flex-wrap items-center gap-3">
                <div className="home-badge-neutral inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                  <Wand2 className="h-3.5 w-3.5" />
                  {text("规划课程", "Plan the Course")}
                </div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl lang-en:text-lg lang-en:sm:text-xl text-balance dark:text-white">
                {text(
                  "先收窄，再成课",
                  "Narrow the direction, then generate the course"
                )}
                </h2>
              </div>
            </div>

            <div className="grid gap-3 xl:grid-cols-3">
              {planningSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="home-flow-step rounded-[1.45rem] border border-border/60 px-4 py-4 dark:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className={`inline-flex rounded-2xl p-2.5 ${flowToneClasses[index]}`}>
                      <step.icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300/80">
                      0{index + 1}
                    </span>
                    <h3 className="text-base font-semibold dark:text-white">{step.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-muted-foreground dark:text-white/62">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-border/50 pt-5 dark:border-white/10">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
                <div className="home-badge-neutral inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                  <Sparkles className="h-3.5 w-3.5" />
                  {text("热门主题", "Popular topics")}
                </div>

                <div className="topic-marquee relative min-w-0 flex-1 overflow-hidden pb-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background/90 via-background/60 to-transparent dark:from-background dark:via-background/80" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background/90 via-background/60 to-transparent dark:from-background dark:via-background/80" />

                <div className="topic-track flex w-max gap-4 pr-4">
                  {scrollingTopics.map((topic, index) => (
                    <Link
                      key={`${topic}-${index}`}
                      href={`/projects/new?prompt=${encodeURIComponent(topic)}`}
                      className="home-topic-chip group flex shrink-0 items-center gap-3 rounded-full border px-5 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <span>{topic}</span>
                      <ArrowRight className="home-arrow-cool h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative container mx-auto px-4 pb-20">
          <div className="home-shell-compare rounded-[2.3rem] border border-border/60 p-6 dark:border-white/10 sm:p-8">
            <div className="mb-8 max-w-5xl">
              <div className="flex flex-wrap items-center gap-3">
                <div className="home-badge-compare inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                  <Target className="h-3.5 w-3.5" />
                  {text("对比", "Compare")}
                </div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl lang-en:text-lg lang-en:sm:text-xl text-balance dark:text-white">
                  {text("为什么选 Pandora AI", "Why choose Pandora AI")}
                </h2>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {compareCards.map((card) => {
                const toneMeta = compareToneMeta[card.tone];
                const ToneIcon = toneMeta.Icon;

                return (
                  <div
                    key={card.title}
                    className={
                      card.accent
                        ? "home-compare-card-accent rounded-[1.8rem] border border-emerald-200/70 p-5 dark:border-emerald-300/18"
                        : "home-compare-card rounded-[1.8rem] border border-border/60 p-5 dark:border-white/10"
                    }
                  >
                    <h3 className="text-xl font-semibold dark:text-white">{card.title}</h3>
                    <div className="mt-6 divide-y divide-slate-200/80 dark:divide-white/10">
                      {card.points.map((point) => (
                        <div
                          key={point}
                          className="home-compare-row flex items-center gap-3 py-4 text-sm font-medium text-slate-700 first:pt-0 last:pb-0 dark:text-white/84"
                        >
                          <ToneIcon className={`h-4 w-4 shrink-0 ${toneMeta.iconClass}`} />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="product-preview" className="relative overflow-hidden pb-24 pt-10">
          <div className="home-preview-stage absolute inset-0" />
          <div className="relative container mx-auto px-4">
            <div className="mb-8 text-center">
              <div className="home-badge-preview inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                <Sparkles className="h-3.5 w-3.5" />
                {text("预览", "Preview")}
              </div>
              <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lang-en:text-2xl lang-en:sm:text-3xl text-balance">
                {text("你会得到什么", "What you get")}
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-white/72 sm:text-base">
                {text(
                  "左边是对话过程，右边是生成结果",
                  "The left side shows the dialogue The right side shows the result"
                )}
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
              <div className="home-preview-panel rounded-[2rem] border border-white/10 p-5 text-white sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {text("示例输入（启发式对话）", "Example Input (Guided Dialogue)")}
                    </h3>
                    <p className="text-xs text-white/45">
                      Pandora AI Planner
                    </p>
                  </div>
                  <div className="home-badge-preview inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
                    <span className="h-2 w-2 rounded-full bg-white/80" />
                    {text("启发式对话", "Guided Dialogue")}
                  </div>
                </div>

                <div className="space-y-4">
                  {previewConversation.map((message, index) => (
                    <div key={`${message.role}-${index}`} className="space-y-3">
                      <div
                        className={
                          message.role === "user"
                            ? "ml-auto max-w-[86%] rounded-[1.4rem] rounded-br-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/22 dark:bg-cyan-400 dark:text-slate-950 dark:shadow-cyan-500/20"
                            : "home-preview-assistant max-w-[92%] rounded-[1.4rem] rounded-bl-md border border-white/10 px-4 py-3 text-sm leading-6"
                        }
                      >
                        {message.content}
                      </div>

                      {message.options ? (
                        <div className="space-y-2">
                          {message.options.map((option) => (
                            <div
                              key={option}
                              className="home-preview-option max-w-[88%] rounded-[1.2rem] border px-4 py-3 text-sm shadow-sm"
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {message.selectedOption ? (
                        <div className="ml-auto max-w-[86%] rounded-[1.4rem] rounded-br-md bg-primary/92 px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/18 dark:bg-emerald-400 dark:text-slate-950 dark:shadow-emerald-500/18">
                          {message.selectedOption}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="home-preview-panel rounded-[2rem] border border-white/10 p-5 text-white sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold dark:text-white">
                    {text("结果预览", "Result Preview")}
                  </h3>
                  <div className="home-preview-chip rounded-full border px-3 py-1 text-xs">
                    {text("7 章", "7 Chapters")}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[text("课程大纲", "Course Outline"), text("双语内容", "Bilingual Content"), text("随堂测验", "Lesson Quiz"), text("AI 辅导", "AI Tutor")].map((badge) => (
                    <span
                      key={badge}
                      className="home-preview-chip rounded-full border px-3 py-1 text-xs font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="home-preview-surface mt-6 rounded-[1.7rem] border border-white/10 p-4">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                    <BookOpen className="home-tone-preview-check h-4 w-4" />
                    {text("自动生成章节", "Auto-generated chapters")}
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        title: text("Agent 基础与核心概念", "Agent Foundations and Core Concepts"),
                        sub: [text("什么是 Agent", "What is an agent"), text("核心组成模块", "Core building blocks"), text("典型应用场景", "Typical use cases")],
                      },
                      {
                        title: text("工具调用、记忆与状态", "Tool Use Memory and State"),
                        sub: [text("函数调用流程", "Function calling flow"), text("短期与长期记忆", "Short-term and long-term memory"), text("状态管理", "State management")],
                      },
                      {
                        title: text("工作流编排与效果优化", "Workflow Orchestration and Optimization"),
                        sub: [text("多步任务拆解", "Multi-step task breakdown"), text("执行链路设计", "Execution pipeline design"), text("评估与迭代", "Evaluation and iteration")],
                      },
                    ].map((chapter, index) => (
                      <div
                        key={chapter.title}
                        className="home-preview-result-item rounded-[1.2rem] border border-white/10 px-3 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="home-tone-preview-index inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-white">{chapter.title}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 pl-10 text-xs text-white/58">
                          {chapter.sub.map((subchapter) => (
                            <span
                              key={subchapter}
                              className="home-preview-chip rounded-full border px-3 py-1.5"
                            >
                              {subchapter}
                            </span>
                          ))}
                          <span className="home-preview-chip rounded-full border border-dashed px-3 py-1.5">
                            ...
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="home-preview-chip rounded-[1.2rem] border border-dashed px-3 py-3 text-sm text-white/44">
                      ...
                    </div>
                  </div>
                </div>

                <div className="home-preview-surface mt-4 rounded-[1.7rem] border border-white/10 p-4">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                    <FileText className="home-tone-preview-check h-4 w-4" />
                    {text("每章都会产出", "Each chapter includes")}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[text("主课文", "Lesson"), text("重点总结", "Summary"), text("理解测验", "Quiz"), text("继续提问", "Ask Follow-up")].map((asset) => (
                      <div
                        key={asset}
                        className="home-preview-output flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm text-white/84"
                      >
                        <CheckCircle2 className="home-tone-preview-check h-4 w-4" />
                        <span>{asset}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="relative border-t border-border/50 py-8">
        <div className="container mx-auto flex flex-col gap-2 px-4 text-center text-sm text-muted-foreground">
          <div>{text("Pandora AI - AI 驱动的个性化学习平台", "Pandora AI - AI-powered personalized learning platform")}</div>
          <div>{text("作者 / Created by Jackson Liao", "Created by Jackson Liao")}</div>
        </div>
      </footer>

      <style jsx>{`
        .topic-track {
          animation: topic-marquee 36s linear infinite;
          will-change: transform;
        }

        .topic-marquee:hover .topic-track {
          animation-play-state: paused;
        }

        @keyframes topic-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
}
