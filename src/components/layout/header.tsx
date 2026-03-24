"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Zap, Globe, Sun, Moon } from "lucide-react";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export function Header() {
  const { data: session } = useSession();
  const { lang, setLang, theme, setTheme } = useLanguage();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-accent/30" />
      <div className="container flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold group">
          <div className="p-1 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <span className="gradient-text font-bold">StudyClaw</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground px-2"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === "zh" ? "en" : "zh")}
            className="text-muted-foreground hover:text-foreground gap-1.5 px-2"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="text-xs font-mono">{lang === "zh" ? "EN" : "中"}</span>
          </Button>
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
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
  );
}
