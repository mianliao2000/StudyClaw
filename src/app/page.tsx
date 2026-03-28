"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Brain,
  CheckCircle2,
  Compass,
  FileText,
  Frown,
  MessageSquare,
  Search,
  Sparkles,
  Target,
  Wand2,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

type HomeStats = {
  activeProjects: number;
  completedItems: number;
  overallPercent: number;
};

type SimpleCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type SampleCourse = {
  title: string;
  duration: string;
  level: string;
  prompt: string;
  chapters: string[];
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

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="home-shell-progress rounded-[1.5rem] border border-white/60 px-5 py-4 backdrop-blur dark:border-white/10">
      <div className="text-2xl font-semibold tracking-tight text-foreground dark:text-white">
        {value}
      </div>
      <div className="mt-1 text-sm text-muted-foreground dark:text-white/60">
        {label}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { lang } = useLanguage();
  const { data: session } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [stats, setStats] = useState<HomeStats | null>(null);
  const [isLaunchingProject, setIsLaunchingProject] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isZh = lang === "zh";
  const text = (zh: string, en: string) => (isZh ? zh : en);

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

  const scrollToPreview = () => {
    const previewSection = document.getElementById("product-preview");
    if (!previewSection) return;

    const headerOffset = 96;
    const targetTop =
      previewSection.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });
  };

  const evidenceCards: SimpleCard[] = [
    {
      title: text("启发式对话", "Guided dialogue"),
      description: text(
        "用问题和选项帮你收窄方向",
        "Narrows direction through questions and options"
      ),
      icon: MessageSquare,
    },
    {
      title: text("生成课程结构", "Course structure"),
      description: text(
        "把目标拆成章节和小节",
        "Turns a goal into chapters and sections"
      ),
      icon: BookOpen,
    },
    {
      title: text("每章都有材料", "Materials in every chapter"),
      description: text(
        "正文、总结和测验一起生成",
        "Lessons, summaries, and quizzes are generated together"
      ),
      icon: FileText,
    },
    {
      title: text("还能继续辅导", "Tutoring continues"),
      description: text(
        "学到中途也能继续追问",
        "You can keep asking while learning"
      ),
      icon: Bot,
    },
  ];

  const knownCourses: SampleCourse[] = [
    {
      title: text("大语言模型", "Large Language Models"),
      duration: text("3-4 周", "3-4 weeks"),
      level: text("有编程基础", "Programming basics"),
      prompt: text("大语言模型", "Large Language Models"),
      chapters: [
        text("Transformer 架构与注意力机制", "Transformer architecture and attention"),
        text("预训练、微调与对齐", "Pre-training, fine-tuning, and alignment"),
        text("提示工程与应用实践", "Prompt engineering and applications"),
      ],
    },
    {
      title: text("自媒体运营", "Content Creation"),
      duration: text("2-3 周", "2-3 weeks"),
      level: text("零基础可学", "No prerequisites"),
      prompt: text("自媒体运营", "Content Creation"),
      chapters: [
        text("平台选择与账号定位", "Platform selection and positioning"),
        text("内容策划与创作技巧", "Content planning and creation skills"),
        text("数据分析与增长策略", "Analytics and growth strategies"),
      ],
    },
  ];

  const explorationCards: SimpleCard[] = [
    {
      title: text("从零基础开始", "Start from zero"),
      description: text(
        "先补基础，再建立节奏",
        "Build foundations and pacing first"
      ),
      icon: Target,
    },
    {
      title: text("为了项目实战", "Learn for projects"),
      description: text(
        "更偏项目、案例和实战",
        "Better for projects and applied practice"
      ),
      icon: Brain,
    },
    {
      title: text("为了求职准备", "Learn for job preparation"),
      description: text(
        "更聚焦岗位能力和准备",
        "More focused on role readiness"
      ),
      icon: Sparkles,
    },
    {
      title: text("为了研究或深挖", "Go deeper into a hard topic"),
      description: text(
        "围绕一个难点继续深入",
        "Go deeper on one hard topic"
      ),
      icon: Search,
    },
  ];

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
        text("只解决当下这一个问题", "Only solves the immediate question"),
        text("不会自动整理章节和学习路径", "Does not automatically organize chapters or a learning path"),
        text("学习节奏和结构还要你自己搭", "You still have to build the learning structure yourself"),
      ],
      tone: "negative",
    },
    {
      title: text("搜索资料", "Search and resources"),
      description: text(
        "擅长找到很多资料，但很少帮你把这些内容重组成可学的课程",
        "Good for finding information, but weak at reshaping it into a course you can follow"
      ),
      points: [
        text("资料很多，但容易分散", "There is a lot of material, but it is easy to get scattered"),
        text("筛选、排序和重组的成本很高", "Filtering, sorting, and restructuring take a lot of effort"),
        text("不会直接给你个性化规划", "Does not directly give you a personalized plan"),
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
        text("启发式对话先帮你收窄方向", "Guided dialogue helps narrow the direction first"),
        text("自动生成章节、正文、总结和测验", "Automatically generates chapters, lessons, summaries, and quizzes"),
        text("学到中途还能继续追问 AI 辅导", "You can keep asking for AI tutoring while learning"),
      ],
      accent: true,
      tone: "positive",
    },
  ];

  const localizedTopics = TOPICS.map((topic) => (isZh ? topic.zh : topic.en));
  const scrollingTopics = [...localizedTopics, ...localizedTopics];
  const firstName = session?.user?.name?.split(" ")[0];
  const evidenceIconClasses = [
    "home-tone-dialogue",
    "home-tone-structure",
    "home-tone-material",
    "home-tone-tutor",
  ] as const;
  const flowToneClasses = [
    "home-tone-goal",
    "home-tone-choice",
    "home-tone-deliver",
  ] as const;
  const explorationToneClasses = [
    { icon: "home-tone-foundation", chip: "home-chip-foundation" },
    { icon: "home-tone-projects", chip: "home-chip-projects" },
    { icon: "home-tone-career", chip: "home-chip-career" },
    { icon: "home-tone-research", chip: "home-chip-research" },
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

        <section className="relative container mx-auto px-4 pb-18 pt-18 sm:pt-24">
          <div className="grid items-start gap-10 xl:grid-cols-[1.05fr_0.95fr]">
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
                  "几轮对话后，系统会生成课程、材料和辅导",
                  "After a few turns, Pandora AI generates a course, materials, and tutoring"
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
                    placeholder={text(
                      "告诉 AI 你想学什么，例如：我想系统学习 AI Agent 开发",
                      "Tell AI what you want to learn, for example: I want to systematically learn AI agent development"
                    )}
                    className="min-h-[108px] flex-1 resize-none rounded-[1.4rem] border border-border/60 bg-background/80 px-5 py-4 text-sm leading-7 text-foreground outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary/35 focus:ring-2 focus:ring-primary/12 dark:border-white/10 dark:bg-black/15 dark:text-white dark:placeholder:text-white/38"
                  />
                  <div className="flex w-full flex-col gap-3 lg:w-[13.5rem]">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isPending || isLaunchingProject || !prompt.trim()}
                      className="h-14 rounded-[1.25rem] px-6 text-sm shadow-lg shadow-primary/20"
                    >
                      {isLaunchingProject
                        ? text("正在启动对话", "Starting the conversation")
                        : text("开始规划课程", "Plan My Course")}
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      className="h-14 w-full rounded-[1.25rem] border-slate-300/70 bg-white/78 px-6 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-100 dark:hover:bg-slate-800/60"
                      onClick={scrollToPreview}
                    >
                        {text("先看功能预览", "Preview the Product")}
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <span className="mr-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {text("示例：", "Examples:")}
                  </span>
                  {[text("AI Agent开发", "AI Agent Development"), text("大语言模型", "Large Language Models"), text("自媒体运营", "Content Creation"), text("电路设计", "Circuit Design")].map((quickPrompt) => (
                    <button
                      key={quickPrompt}
                      type="button"
                      onClick={() => launchPrompt(quickPrompt)}
                      className="home-chip-soft rounded-full border px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5"
                    >
                      {quickPrompt}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-0 translate-y-6 rounded-[2.4rem] bg-[linear-gradient(135deg,oklch(0.93_0.02_240_/_0.35),oklch(0.93_0.025_270_/_0.2))] blur-2xl dark:bg-[linear-gradient(135deg,oklch(0.24_0.025_240_/_0.34),oklch(0.18_0.03_260_/_0.22))]" />
              <div className="home-shell-flow relative rounded-[2.4rem] border border-slate-300/60 p-6 dark:border-slate-700/70">
                <div className="home-badge-flow mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                  <Wand2 className="h-3.5 w-3.5" />
                  {text("规划流程", "Planning flow")}
                </div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lang-en:text-xl lang-en:sm:text-2xl text-balance dark:text-white">
                  {text("几轮对话，收窄方向", "A few turns, then a clear direction")}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground dark:text-white/65">
                  {text(
                  "通常几轮之后，就能得到课程方案",
                  "Usually a few turns are enough to get a course plan"
                  )}
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    {
                      title: text("先说目标", "Say the goal"),
                      detail: text("输入你想学的方向、项目目标或当前难点", "Start with the topic, project, or challenge you want to learn"),
                      icon: Search,
                    },
                    {
                      title: text("再做选择", "Choose the direction"),
                      detail: text("AI 用启发式问题和选项帮你收窄范围", "AI uses guided questions and options to narrow the path"),
                      icon: Compass,
                    },
                    {
                      title: text("得到课程", "Get the course"),
                      detail: text("直接拿到章节、正文、总结、测验和 AI 辅导", "Receive chapters, lessons, summaries, quizzes, and AI tutoring"),
                      icon: Wand2,
                    },
                  ].map((step, index) => (
                    <div key={step.title} className="home-flow-step flex items-start gap-4 rounded-[1.6rem] border border-slate-300/50 px-4 py-4 dark:border-slate-700/70">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${flowToneClasses[index]}`}>
                        <step.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300/80">
                            0{index + 1}
                          </span>
                          <h3 className="text-base font-semibold dark:text-white">{step.title}</h3>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground dark:text-white/62">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative container mx-auto px-4 pb-18">
          <div className="home-shell-neutral rounded-[2.3rem] border border-border/60 p-6 dark:border-white/10 sm:p-8">
            <div className="mb-7 max-w-3xl">
              <div className="home-badge-neutral inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                <Sparkles className="h-3.5 w-3.5" />
                {text("不只是聊天", "More than chat")}
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl lang-en:text-xl lang-en:sm:text-2xl text-balance dark:text-white">
                {text(
                  "几轮对话后，你得到的是一套学习系统",
                  "After a few turns, you get a learning system"
                )}
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {evidenceCards.map((item, index) => (
                <div key={item.title} className="home-evidence-card rounded-[1.8rem] border border-border/60 p-5 transition-all hover:-translate-y-1 dark:border-white/10">
                  <div className={`mb-4 inline-flex rounded-2xl p-3 ${evidenceIconClasses[index]}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground dark:text-white/62">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {session?.user ? (
          <section className="relative container mx-auto px-4 pb-18">
            <div className="home-shell-progress rounded-[2.3rem] border border-slate-200/70 p-6 dark:border-white/10 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <div className="home-badge-progress inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                    <Target className="h-3.5 w-3.5" />
                    {text("继续你的学习", "Keep learning")}
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl lang-en:text-xl lang-en:sm:text-2xl text-balance dark:text-white">
                    {firstName
                      ? `${firstName}${text("，首页更像你的学习入口", ", the homepage now feels more like your learning entry point")}`
                      : text("首页更像你的学习入口", "The homepage now feels more like your learning entry point")}
                  </h2>
                </div>

                <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-xl">
                  <StatCard value={String(stats?.activeProjects ?? "--")} label={text("进行中的项目", "Active projects")} />
                  <StatCard value={String(stats?.completedItems ?? "--")} label={text("已完成学习项", "Completed learning items")} />
                  <StatCard value={stats ? `${stats.overallPercent}%` : "--"} label={text("整体平均进度", "Average progress")} />
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="relative container mx-auto px-4 pb-20">
          <div className="home-shell-focus rounded-[2.3rem] border border-amber-100/70 p-6 dark:border-white/10 sm:p-8">
            <div className="mb-8 max-w-4xl">
              <div className="home-badge-focus inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                <Compass className="h-3.5 w-3.5" />
                {text("开始方式", "Ways to start")}
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lang-en:text-2xl lang-en:sm:text-3xl text-balance dark:text-white">
                {text("两种开始方式", "Two ways to start")}
              </h2>
            </div>

            <div className="grid items-stretch gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="home-panel-known flex flex-col rounded-[1.8rem] p-1 sm:p-2 xl:pr-4">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold dark:text-white">{text("我知道想学什么", "I know the topic")}</h3>
                </div>

                <div className="grid flex-1 gap-4 lg:grid-cols-2">
                  {knownCourses.map((course) => (
                    <Link
                      key={course.title}
                      href={`/projects/new?prompt=${encodeURIComponent(course.prompt)}`}
                      className="home-course-card group flex h-full flex-col rounded-[1.7rem] border border-border/60 p-5 transition-all hover:-translate-y-1 dark:border-white/10"
                    >
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-semibold dark:text-white">{course.title}</h4>
                          <p className="mt-2 text-sm text-muted-foreground dark:text-white/60">
                            {text("预计周期", "Timeline")}: {course.duration}
                          </p>
                          <p className="text-sm text-muted-foreground dark:text-white/60">
                            {text("适合阶段", "Best for")}: {course.level}
                          </p>
                        </div>
                        <div className="home-tone-course rounded-2xl p-3">
                          <Brain className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="mt-auto divide-y divide-slate-200/80 dark:divide-white/10">
                        {course.chapters.map((chapter, index) => (
                          <div
                            key={chapter}
                            className="home-course-step flex items-center gap-3 px-0 py-3 text-sm dark:text-white/86"
                          >
                            <span className="home-tone-course inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                              {index + 1}
                            </span>
                            <span>{chapter}</span>
                          </div>
                        ))}
                        <div className="home-course-more flex items-center gap-3 px-0 py-3 text-sm text-muted-foreground dark:text-white/45">
                          <span className="home-tone-course inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                            ...
                          </span>
                          <span>...</span>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 dark:bg-cyan-400 dark:text-slate-950 dark:shadow-cyan-500/20">
                        <span>{text("从这个方向开始", "Start from this direction")}</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="home-panel-explore flex flex-col rounded-[1.8rem] p-1 sm:p-2 xl:border-l xl:border-slate-200/70 xl:pl-7 dark:xl:border-white/10">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {text("我还不确定怎么开始", "I need help getting started")}
                  </h3>
                </div>

                <div className="flex flex-1 flex-col justify-between gap-4">
                  {explorationCards.map((card, index) => (
                    <button
                      key={card.title}
                      type="button"
                      onClick={() => launchPrompt(card.title)}
                      className="home-explore-card group block w-full rounded-[1.6rem] border border-slate-200/70 p-4 text-left transition-all hover:-translate-y-1 dark:border-white/10"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`rounded-2xl p-3 ${explorationToneClasses[index].icon}`}>
                          <card.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="text-base font-semibold dark:text-white">{card.title}</h4>
                            <ArrowRight className="home-explore-link h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                          </div>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground dark:text-white/60">
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
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

        <section className="relative container mx-auto px-4 pb-20">
          <div className="home-shell-compare rounded-[2.3rem] border border-border/60 p-6 dark:border-white/10 sm:p-8">
            <div className="mb-8 max-w-4xl">
              <div className="home-badge-compare inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                <Target className="h-3.5 w-3.5" />
                {text("对比", "Comparison")}
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lang-en:text-2xl lang-en:sm:text-3xl text-balance dark:text-white">
                {text("为什么是 Pandora AI", "Why Pandora AI")}
              </h2>
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
                        ? "home-compare-card-accent rounded-[1.8rem] border border-cyan-200/50 p-5 dark:border-cyan-300/18"
                        : "home-compare-card rounded-[1.8rem] border border-border/60 p-5 dark:border-white/10"
                    }
                  >
                    <h3 className="text-xl font-semibold dark:text-white">{card.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground dark:text-white/62">
                      {card.description}
                    </p>
                    <div className="mt-5 divide-y divide-slate-200/80 dark:divide-white/10">
                      {card.points.map((point) => (
                        <div
                          key={point}
                          className="home-compare-row flex items-start gap-3 py-3 text-sm text-slate-700 first:pt-0 last:pb-0 dark:text-white/84"
                        >
                          <ToneIcon className={`mt-0.5 h-4 w-4 shrink-0 ${toneMeta.iconClass}`} />
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

        <section className="relative container mx-auto px-4 pb-20">
          <div className="home-topic-shell rounded-[2rem] border border-slate-200/60 p-5 dark:border-white/10 sm:p-6">
          <div className="mb-6 max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-balance dark:text-white">
              {text("热门主题", "Popular topics")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground dark:text-white/62">
              {text("也可以直接从这里开始", "You can also start here")}
            </p>
          </div>

          <div className="topic-marquee relative overflow-hidden pb-3">
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
