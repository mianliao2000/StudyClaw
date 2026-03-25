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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{t("dash.title")}</h1>
          <p className="text-muted-foreground">{t("dash.subtitle")}</p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("dash.new")}
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="text-center py-16 border-border/50 bg-card/50">
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </main>
  );
}
