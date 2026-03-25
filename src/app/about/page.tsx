"use client";

import { Header } from "@/components/layout/header";
import { useLanguage } from "@/lib/i18n";

const aboutContent = {
  zh: {
    title: "关于 Pandora AI",
    intro:
      "Pandora AI 是一个 AI 驱动的个性化学习平台。它帮助你将复杂的技术主题分解为结构化的学习计划，并为每个章节生成教材、总结和测验。",
    howItWorksTitle: "工作原理",
    howItWorks: [
      {
        title: "规划阶段",
        body:
          "通过与 AI 对话，定义你想学的主题、学习目标和时间安排。AI 会为你生成一个结构化的课程大纲。",
      },
      {
        title: "学习阶段",
        body:
          "进入项目工作区后，你可以逐章阅读 AI 生成的课文，查看学习总结，完成测验来检验理解程度。",
      },
      {
        title: "辅导阶段",
        body:
          "每节课都配有 AI 辅导助手，你可以随时提问，获取更深入的解释或实际例子。",
      },
    ],
    scenariosTitle: "适用场景",
    scenarios: [
      "学习计算机系统、AI、软件架构等技术主题",
      "掌握 MATLAB/Simulink、PLECS 等专业工具",
      "自学编程语言和框架",
      "系统性地学习任何复杂知识领域",
    ],
    stackTitle: "技术栈",
    stack:
      "本项目基于 Next.js、TypeScript 和 Tailwind CSS 构建，使用 Prisma 管理数据访问，并通过 Auth.js 实现用户认证。",
  },
  en: {
    title: "About Pandora AI",
    intro:
      "Pandora AI is an AI-powered personalized learning platform. It helps break complex topics into structured study plans and generates lessons, summaries, and quizzes for each chapter.",
    howItWorksTitle: "How It Works",
    howItWorks: [
      {
        title: "Planning",
        body:
          "Define your topic, goals, and schedule through AI conversation. The system turns that into a structured course outline.",
      },
      {
        title: "Learning",
        body:
          "Inside the project workspace, you can read AI-generated lessons chapter by chapter, review summaries, and take quizzes to check understanding.",
      },
      {
        title: "Tutoring",
        body:
          "Each lesson includes an AI tutoring assistant so you can ask follow-up questions and get deeper explanations or examples at any time.",
      },
    ],
    scenariosTitle: "Use Cases",
    scenarios: [
      "Learning topics like computer systems, AI, and software architecture",
      "Mastering tools such as MATLAB/Simulink and PLECS",
      "Self-studying programming languages and frameworks",
      "Systematically learning any complex knowledge domain",
    ],
    stackTitle: "Tech Stack",
    stack:
      "This project is built with Next.js, TypeScript, and Tailwind CSS, uses Prisma for data access, and Auth.js for authentication.",
  },
} as const;

export default function AboutPage() {
  const { lang } = useLanguage();
  const copy = aboutContent[lang];

  return (
    <>
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-16">
        <h1 className="mb-6 text-3xl font-bold">{copy.title}</h1>

        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p>{copy.intro}</p>

          <h2>{copy.howItWorksTitle}</h2>
          <ol>
            {copy.howItWorks.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>: {item.body}
              </li>
            ))}
          </ol>

          <h2>{copy.scenariosTitle}</h2>
          <ul>
            {copy.scenarios.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2>{copy.stackTitle}</h2>
          <p>{copy.stack}</p>
        </div>
      </main>
    </>
  );
}
