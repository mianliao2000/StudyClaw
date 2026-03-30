"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CircleHelp, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { GuestBanner } from "./guest-banner";
import { UserMenu } from "./user-menu";
import { RecentStudyCapsule } from "./recent-study-capsule";

interface HeaderProps {
  homeCapsule?: React.ReactNode;
}

export function Header({ homeCapsule }: HeaderProps) {
  const { data: session } = useSession();
  const { lang, setLang, theme, setTheme } = useLanguage();

  const isChinese = lang === "zh";
  const isDark = theme === "dark";
  const aboutLabel = lang === "zh" ? "关于我们" : "About";
  const dashboardLabel = lang === "zh" ? "我的项目" : "My Projects";
  const loginLabel = lang === "zh" ? "登录" : "Login";

  return (
    <>
      <GuestBanner />
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-accent/30" />

        <div className="flex min-h-14 w-full items-center gap-3 px-4 py-2 sm:min-h-16 sm:px-6 lg:px-8 2xl:px-10">
          {/* Left: Brand */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2 sm:gap-3"
          >
            <Image
              src="/Box_Logo2_v3.png"
              alt="Pandora AI"
              width={40}
              height={40}
              className="h-8 w-8 object-contain sm:h-9 sm:w-9 lg:h-10 lg:w-10"
              priority
            />
            <span className="gradient-text truncate text-base font-bold sm:text-lg lg:text-xl">
              Pandora AI
            </span>
          </Link>

          {homeCapsule ? (
            <div className="hidden min-w-0 shrink sm:flex">{homeCapsule}</div>
          ) : null}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right: Navigation & tools */}
          <nav className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2 lg:gap-3">
            <RecentStudyCapsule />

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 rounded-full border border-stone-300/80 bg-white/92 p-0.5 shadow-[0_10px_24px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.92)] backdrop-blur dark:border-white/10 dark:bg-slate-900/82 dark:shadow-[0_14px_28px_rgba(2,6,23,0.28)]">
                <Button
                  variant="ghost"
                  onClick={() => setLang("zh")}
                  className={`h-6 min-w-[1.95rem] rounded-full px-1 text-[0.68rem] font-medium sm:h-6.5 sm:min-w-[2.1rem] sm:text-[0.68rem] lg:h-7 lg:min-w-[2.2rem] lg:text-[0.7rem] ${
                    isChinese
                      ? "bg-stone-900 text-white hover:bg-stone-800 dark:bg-white dark:text-slate-950 dark:hover:bg-white/90"
                      : "text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-slate-300 dark:hover:bg-white/8 dark:hover:text-white"
                  }`}
                  aria-label="Switch to Chinese"
                >
                  中
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setLang("en")}
                  className={`h-6 min-w-[2.15rem] rounded-full px-1 text-[0.68rem] font-medium sm:h-6.5 sm:min-w-[2.35rem] sm:text-[0.68rem] lg:h-7 lg:min-w-[2.45rem] lg:text-[0.7rem] ${
                    !isChinese
                      ? "bg-stone-900 text-white hover:bg-stone-800 dark:bg-white dark:text-slate-950 dark:hover:bg-white/90"
                      : "text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-slate-300 dark:hover:bg-white/8 dark:hover:text-white"
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </Button>
              </div>

              <div className="flex items-center gap-0.5 rounded-full border border-stone-300/80 bg-white/92 p-0.5 shadow-[0_10px_24px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.92)] backdrop-blur dark:border-white/10 dark:bg-slate-900/82 dark:shadow-[0_14px_28px_rgba(2,6,23,0.28)]">
                <Button
                  variant="ghost"
                  onClick={() => setTheme("light")}
                  className={`h-6 w-6 rounded-full px-0 sm:h-6.5 sm:w-6.5 lg:h-7 lg:w-7 ${
                    !isDark
                      ? "bg-stone-900 text-white hover:bg-stone-800 dark:bg-white dark:text-slate-950 dark:hover:bg-white/90"
                      : "text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-slate-300 dark:hover:bg-white/8 dark:hover:text-white"
                  }`}
                  title="Switch to light mode"
                  aria-label="Switch to light mode"
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setTheme("dark")}
                  className={`h-6 w-6 rounded-full px-0 sm:h-6.5 sm:w-6.5 lg:h-7 lg:w-7 ${
                    isDark
                      ? "bg-stone-900 text-white hover:bg-stone-800 dark:bg-white dark:text-slate-950 dark:hover:bg-white/90"
                      : "text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-slate-300 dark:hover:bg-white/8 dark:hover:text-white"
                  }`}
                  title="Switch to dark mode"
                  aria-label="Switch to dark mode"
                >
                  <Moon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {session ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="secondary"
                    className="h-8 min-w-[5.75rem] rounded-full border border-stone-300/80 bg-white px-3.5 text-[0.78rem] font-semibold text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.08)] hover:bg-stone-50 sm:h-8.5 sm:min-w-[6.25rem] sm:px-4 sm:text-xs lg:h-9 lg:min-w-[6.75rem] lg:text-sm dark:border-white/10 dark:bg-slate-900/88 dark:text-white dark:hover:bg-slate-900"
                  >
                    {dashboardLabel}
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="secondary"
                    className="h-8 min-w-[5.75rem] gap-1 rounded-full border border-stone-300/80 bg-white px-3.5 text-[0.78rem] font-semibold text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.08)] hover:bg-stone-50 sm:h-8.5 sm:min-w-[6.25rem] sm:px-4 sm:text-xs lg:h-9 lg:min-w-[6.75rem] lg:text-sm dark:border-white/10 dark:bg-slate-900/88 dark:text-white dark:hover:bg-slate-900"
                  >
                    <CircleHelp className="h-3.25 w-3.25 shrink-0" />
                    {aboutLabel}
                  </Button>
                </Link>
                <UserMenu />
              </>
            ) : (
              <Link href="/login">
                <Button className="h-8 rounded-full px-3 text-[0.72rem] sm:h-9 sm:px-4 sm:text-xs lg:h-10 lg:text-sm">
                  {loginLabel}
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
