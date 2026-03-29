"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpDown, BookOpen, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectCard } from "@/components/project/project-card";
import { useLanguage } from "@/lib/i18n";

interface Project {
  id: string;
  title: string;
  titleEn: string | null;
  topic: string;
  topicEn: string | null;
  status: string;
  starred: boolean;
  createdAt: Date;
  updatedAt: Date;
  chapters: { subchapters: unknown[] }[];
  progress: {
    completionPercent: number;
    currentChapterId: string | null;
    currentSubchapterId: string | null;
    lastCompletedAt: Date | string | null;
  } | null;
}

interface DashboardContentProps {
  projects: Project[];
}

type SortMode = "completion" | "createdAt" | "lastCompletedAt";

export function DashboardContent({ projects }: DashboardContentProps) {
  const { t } = useLanguage();
  const [starredSortMode, setStarredSortMode] = useState<SortMode>("completion");
  const [regularSortMode, setRegularSortMode] = useState<SortMode>("completion");

  const getSortLabel = (sortMode: SortMode) => {
    switch (sortMode) {
      case "createdAt":
        return t("dash.sort.createdAt");
      case "lastCompletedAt":
        return t("dash.sort.lastCompletedAt");
      default:
        return t("dash.sort.completion");
    }
  };

  const compareProjectsBy = (sortMode: SortMode) => (a: Project, b: Project) => {
    if (sortMode === "completion") {
      const completionDiff = (b.progress?.completionPercent ?? 0) - (a.progress?.completionPercent ?? 0);
      if (completionDiff !== 0) return completionDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    if (sortMode === "createdAt") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    const aHasProgress = (a.progress?.completionPercent ?? 0) > 0;
    const bHasProgress = (b.progress?.completionPercent ?? 0) > 0;

    if (aHasProgress !== bHasProgress) {
      return aHasProgress ? -1 : 1;
    }

    const aTime = aHasProgress
      ? (a.progress?.lastCompletedAt
          ? new Date(a.progress.lastCompletedAt).getTime()
          : new Date(a.updatedAt).getTime())
      : 0;
    const bTime = bHasProgress
      ? (b.progress?.lastCompletedAt
          ? new Date(b.progress.lastCompletedAt).getTime()
          : new Date(b.updatedAt).getTime())
      : 0;
    if (bTime !== aTime) return bTime - aTime;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  };

  const starredProjects = projects.filter((project) => project.starred).slice().sort(compareProjectsBy(starredSortMode));
  const regularProjects = projects.filter((project) => !project.starred).slice().sort(compareProjectsBy(regularSortMode));

  const renderSortControl = (sortMode: SortMode, setSortMode: (mode: SortMode) => void) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-8 items-center rounded-full border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
        <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />
        {t("dash.sort")}: {getSortLabel(sortMode)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuItem onClick={() => setSortMode("completion")}>
          {t("dash.sort.completion")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSortMode("createdAt")}>
          {t("dash.sort.createdAt")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSortMode("lastCompletedAt")}>
          {t("dash.sort.lastCompletedAt")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {t("dash.title")}
          </h1>
          <p className="mt-1 text-base text-muted-foreground sm:text-lg">
            {t("dash.subtitle")}
          </p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("dash.new")}
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="border-slate-200/80 bg-white/88 py-16 text-center shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-slate-950/65 dark:shadow-[0_20px_48px_rgba(2,6,23,0.3)]">
          <CardContent>
            <BookOpen className="mx-auto h-12 w-12 text-primary/50 mb-4" />
            <h2 className="text-lg font-semibold mb-2">{t("dash.empty")}</h2>
            <p className="text-muted-foreground mb-6">{t("dash.emptyHint")}</p>
            <Link href="/projects/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("dash.createFirst")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
                  {t("dash.starred")}
                </h2>
              </div>
              {renderSortControl(starredSortMode, setStarredSortMode)}
            </div>

            {starredProjects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {starredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-slate-200/90 bg-white/80 shadow-none dark:border-white/10 dark:bg-slate-950/40">
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  {t("dash.starredEmpty")}
                </CardContent>
              </Card>
            )}
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="pl-10 sm:pl-10">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
                  {t("dash.allProjects")}
                </h2>
              </div>
              {renderSortControl(regularSortMode, setRegularSortMode)}
            </div>

            {regularProjects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {regularProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-slate-200/90 bg-white/80 shadow-none dark:border-white/10 dark:bg-slate-950/40">
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  {t("dash.allProjectsEmpty")}
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
