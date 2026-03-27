"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

type Stats = {
  activeProjects: number;
  completedItems: number;
  overallPercent: number;
};

export function UserMenu() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/user/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, [session?.user]);

  if (!session?.user) return null;

  const initials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const showStats = !statsLoading && stats && stats.activeProjects > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="h-8 w-8">
          <AvatarImage src={session.user.image || undefined} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Profile */}
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{session.user.name}</p>
          <p className="text-xs text-muted-foreground">{session.user.email}</p>
        </div>

        {/* Stats panel */}
        {statsLoading && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-2 space-y-1.5">
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
              <div className="h-2 w-full animate-pulse rounded bg-muted" />
            </div>
          </>
        )}

        {showStats && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-2">
              <p className="mb-1.5 text-xs text-muted-foreground">
                {stats!.activeProjects} {t("stats.projects")}
                {" · "}
                {stats!.completedItems} {t("stats.lessons")}
              </p>
              <div className="flex items-center gap-2">
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-primary/15">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${stats!.overallPercent}%` }}
                  />
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {stats!.overallPercent}%
                </span>
              </div>
            </div>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => (window.location.href = "/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          {t("settings.title")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
          <LogOut className="mr-2 h-4 w-4" />
          {t("settings.account.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
