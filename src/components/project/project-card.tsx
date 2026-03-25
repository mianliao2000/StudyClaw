"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, MoreVertical, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/i18n/translations";

const statusVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  planning: "secondary",
  active: "default",
  completed: "outline",
  archived: "outline",
};

const statusKeys: Record<string, TranslationKey> = {
  planning: "status.planning",
  active: "status.active",
  completed: "status.completed",
  archived: "status.archived",
};

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    titleEn: string | null;
    topic: string;
    topicEn: string | null;
    status: string;
    updatedAt: Date;
    chapters: { subchapters: unknown[] }[];
    progress: { completionPercent: number } | null;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const chapterCount = project.chapters.length;
  const subchapterCount = project.chapters.reduce(
    (sum, ch) => sum + ch.subchapters.length,
    0
  );

  const href =
    project.status === "planning"
      ? `/projects/${project.id}/plan`
      : `/projects/${project.id}`;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
    }
  };

  const dateLocale = lang === "zh" ? "zh-CN" : "en-US";
  const projectTitle = lang === "en" ? project.titleEn || project.title : project.title;
  const projectTopic = lang === "en" ? project.topicEn || project.topic : project.topic;

  return (
    <>
      <Card className="h-full relative group border-border/50 bg-card/50 glow-border glow-border-hover transition-all duration-300 hover:-translate-y-0.5">
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-accent"
              onClick={(e) => e.preventDefault()}
            >
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  setShowDelete(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("delete.menu")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link href={href}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between pr-8">
              <CardTitle className="text-base line-clamp-1">
                {projectTitle}
              </CardTitle>
              <Badge variant={statusVariants[project.status]}>
                {statusKeys[project.status] ? t(statusKeys[project.status]) : project.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {projectTopic}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span>{chapterCount} {t("misc.chapter")}</span>
              <span>{subchapterCount} {t("misc.section")}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(project.updatedAt).toLocaleDateString(dateLocale)}
              </span>
            </div>
            {project.progress && (
              <Progress
                value={project.progress.completionPercent}
                className="h-1.5"
              />
            )}
          </CardContent>
        </Link>
      </Card>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete.desc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t("delete.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t("delete.deleting") : t("delete.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
