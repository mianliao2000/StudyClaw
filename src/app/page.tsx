"use client";

import Link from "next/link";
import { BookOpen, Brain, Target, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
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
      ? ["计算机体系结构", "AI Agent 开发", "MATLAB/Simulink", "电力电子学", "React 全栈开发", "系统设计", "Python 数据分析", "嵌入式系统"]
      : ["Computer Architecture", "AI Agent Dev", "MATLAB/Simulink", "Power Electronics", "React Full-Stack", "System Design", "Python Data Analysis", "Embedded Systems"];

  return (
    <>
      <Header />
      <main className="flex-1 relative">
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

        <section className="relative container mx-auto px-4 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            {t("home.badge")}
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl gradient-text leading-tight pb-2">
            {t("home.title")}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("home.subtitle")}
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="px-8 animate-pulse-glow">
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
            {features.map((f, i) => (
              <div
                key={f.titleKey}
                className="group rounded-xl border border-border/50 bg-card/50 p-6 glow-border glow-border-hover transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`inline-flex p-3 rounded-lg ${f.bg} mb-4`}>
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="font-semibold mb-1">{t(f.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(f.descKey)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative container mx-auto px-4 pb-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            {t("home.topicsTitle")}
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {topics.map((topic) => (
              <span
                key={topic}
                className="px-4 py-2 rounded-full border border-border/50 bg-secondary/50 text-sm hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-default"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative border-t border-border/50 py-6 text-center text-sm text-muted-foreground">
        {t("home.footer")}
      </footer>
    </>
  );
}
