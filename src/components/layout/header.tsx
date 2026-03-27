"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Globe, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { GuestBanner } from "./guest-banner";
import { UserMenu } from "./user-menu";

export function Header() {
  const { data: session } = useSession();
  const { lang, setLang, theme, setTheme } = useLanguage();

  const themeToggleTitle =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  const languageLabel = lang === "zh" ? "EN" : "中";
  const dashboardLabel = lang === "zh" ? "我的项目" : "My Projects";
  const loginLabel = lang === "zh" ? "登录" : "Login";

  return (
    <>
      <GuestBanner />
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-accent/30" />

        <div className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-2 sm:min-h-16 sm:px-6 lg:px-8 2xl:px-10">
          <Link
            href="/"
            className="group flex min-w-0 flex-1 items-center gap-2 sm:gap-3"
          >
            <Image
              src="/Box_Logo2.png"
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

          <nav className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2 lg:gap-3">
            <Button
              variant="ghost"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 rounded-full px-0 text-muted-foreground hover:text-foreground sm:h-9 sm:w-9 lg:h-10 lg:w-10"
              title={themeToggleTitle}
              aria-label={themeToggleTitle}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              className="h-8 min-w-[3.5rem] gap-1.5 rounded-full px-2 text-[0.72rem] text-muted-foreground hover:text-foreground sm:h-9 sm:min-w-[4rem] sm:px-3 sm:text-xs lg:h-10 lg:min-w-[4.5rem] lg:text-sm"
              aria-label="Toggle language"
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="font-mono">{languageLabel}</span>
            </Button>

            {session ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className="h-8 rounded-full px-3 text-[0.72rem] text-muted-foreground hover:text-foreground sm:h-9 sm:px-4 sm:text-xs lg:h-10 lg:text-sm"
                  >
                    {dashboardLabel}
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
