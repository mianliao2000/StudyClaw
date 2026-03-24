"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Brain, MessageSquare, Target } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export default function HomePage() {
  const { t, lang } = useLanguage();

  const features = [
    {
      icon: MessageSquare,
      titleKey: "home.feature1.title" as const,
      descKey: "home.feature1.desc" as const,
      color: "text-[oklch(0.78_0.16_175)]",
      bg: "bg-[oklch(0.78_0.16_175_/_10%)]",
    },
    {
      icon: BookOpen,
      titleKey: "home.feature2.title" as const,
      descKey: "home.feature2.desc" as const,
      color: "text-[oklch(0.68_0.18_300)]",
      bg: "bg-[oklch(0.68_0.18_300_/_10%)]",
    },
    {
      icon: Brain,
      titleKey: "home.feature3.title" as const,
      descKey: "home.feature3.desc" as const,
      color: "text-[oklch(0.72_0.15_60)]",
      bg: "bg-[oklch(0.72_0.15_60_/_10%)]",
    },
    {
      icon: Target,
      titleKey: "home.feature4.title" as const,
      descKey: "home.feature4.desc" as const,
      color: "text-[oklch(0.65_0.15_140)]",
      bg: "bg-[oklch(0.65_0.15_140_/_10%)]",
    },
  ];

  const topics =
    lang === "zh"
      ? [
          "计算机体系结构",
          "AI Agent 开发",
          "MATLAB/Simulink",
          "电力电子学",
          "React 全栈开发",
          "系统设计",
          "Python 数据分析",
          "嵌入式系统",
          "机器学习基础",
          "数据库系统",
          "控制理论",
          "信号与系统",
        ]
      : [
          "Computer Architecture",
          "AI Agent Development",
          "MATLAB/Simulink",
          "Power Electronics",
          "React Full-Stack",
          "System Design",
          "Python Data Analysis",
          "Embedded Systems",
          "Machine Learning",
          "Database Systems",
          "Control Theory",
          "Signals and Systems",
        ];

  const scrollingTopics = [...topics, ...topics];

  return (
    <>
      <Header />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

        <section className="relative container mx-auto px-4 pb-20 pt-24 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {t("home.badge")}
          </div>

          <h1 className="gradient-text pb-2 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            {t("home.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t("home.subtitle")}
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="animate-pulse-glow px-8">
                {t("home.start")}
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="px-8">
                {t("home.learnMore")}
              </Button>
            </Link>
          </div>
        </section>

        <section className="relative container mx-auto px-4 pb-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.titleKey}
                className="group rounded-xl border border-border/50 bg-card/50 p-6 glow-border glow-border-hover transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`mb-4 inline-flex rounded-lg p-3 ${feature.bg}`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="mb-1 font-semibold">{t(feature.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative container mx-auto px-4 pb-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{t("home.topicsTitle")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {lang === "zh"
                  ? "点击任意主题，系统会直接进入课程规划对话，并自动发送第一条消息。"
                  : "Click any topic to jump straight into planning and auto-send the first message."}
              </p>
            </div>
          </div>

          <div className="topic-marquee relative overflow-hidden pb-3">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />

            <div className="topic-track flex w-max gap-4 pr-4">
              {scrollingTopics.map((topic, index) => (
                <Link
                  key={`${topic}-${index}`}
                  href={`/projects/new?prompt=${encodeURIComponent(topic)}`}
                  className="group flex shrink-0 items-center gap-3 rounded-full border border-border/60 bg-card/70 px-5 py-3 text-sm font-medium text-foreground/90 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  <span>{topic}</span>
                  <ArrowRight className="h-4 w-4 text-primary/70 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-border/50 py-8">
        <div className="container mx-auto flex flex-col gap-2 px-4 text-center text-sm text-muted-foreground">
          <div>{t("home.footer")}</div>
          <div>{lang === "zh" ? "作者 / Created by Mian Liao" : "Created by Mian Liao"}</div>
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
