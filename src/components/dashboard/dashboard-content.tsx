"use client";

import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectCard } from "@/components/project/project-card";
import { useLanguage } from "@/lib/i18n";

interface Project {
  id: string;
  title: string;
  titleEn: string | null;
  topic: string;
  topicEn: string | null;
  status: string;
  updatedAt: Date;
  chapters: { subchapters: unknown[] }[];
  progress: { completionPercent: number } | null;
}

interface DashboardContentProps {
  projects: Project[];
}

export function DashboardContent({ projects }: DashboardContentProps) {
  const { t } = useLanguage();

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
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </main>
  );
}
