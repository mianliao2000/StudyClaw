"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Globe, Sun, Moon } from "lucide-react";
import { UserMenu } from "./user-menu";
import { GuestBanner } from "./guest-banner";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export function Header() {
  const { data: session } = useSession();
  const { lang, setLang, theme, setTheme } = useLanguage();

  return (
    <>
      <GuestBanner />
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-accent/30" />
        <div className="container flex h-14 items-center justify-between px-4">
          <Link href="/" className="group flex items-center gap-2">
            <Image
              src="/Box_Logo2.png"
              alt="Pandora AI"
              width={40}
              height={40}
              className="h-9 w-9 object-contain"
              priority
            />
            <span className="gradient-text text-lg font-bold">Pandora AI</span>
          </Link>

          <nav className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-2 text-muted-foreground hover:text-foreground"
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              className="gap-1.5 px-2 text-muted-foreground hover:text-foreground"
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="font-mono text-xs">
                {lang === "zh" ? "EN" : "中"}
              </span>
            </Button>
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {lang === "zh" ? "我的项目" : "My Projects"}
                  </Button>
                </Link>
                <UserMenu />
              </>
            ) : (
              <Link href="/login">
                <Button size="sm">{lang === "zh" ? "登录" : "Login"}</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
