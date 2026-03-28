"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, MoreVertical, Star, Trash2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
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
    starred: boolean;
    createdAt: Date;
    updatedAt: Date;
    chapters: { subchapters: unknown[] }[];
    progress: { completionPercent: number } | null;
  };
}

function getCompactEnglishCardTitle(title: string) {
  const compact = title
    .split(":")[0]
    .replace(
      /^(?:an?\s+)?(?:in-depth study of|deep dive into|study of|exploring|understanding|introduction to|intro to|comprehensive guide to|guide to)\s+/i,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();

  return compact || title;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [starred, setStarred] = useState(project.starred);

  const handleToggleStar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !starred;
    setStarred(next);
    try {
      await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ starred: next }),
      });
      router.refresh();
    } catch {
      setStarred(!next);
    }
  };

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
  const cardTitle = lang === "en" ? getCompactEnglishCardTitle(projectTitle) : projectTitle;

  return (
    <>
      <Card className="relative h-full rounded-[1.5rem] border border-slate-200/85 bg-white shadow-[0_18px_42px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.92)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300/90 hover:shadow-[0_28px_60px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.95)] dark:border-white/10 dark:bg-slate-900/82 dark:shadow-[0_20px_44px_rgba(2,6,23,0.34)] dark:hover:border-white/16 dark:hover:shadow-[0_28px_60px_rgba(2,6,23,0.42)] group">
        <Link href={href} className="flex h-full flex-col">
          <CardHeader className="min-h-0 border-b border-slate-100/90 px-4 pb-1.5 pt-1.5 dark:border-white/10">
            <div className="flex items-center gap-2">
              <CardTitle
                className="min-w-0 flex-1 line-clamp-1 text-xl font-bold leading-7 text-slate-900 dark:text-white"
                title={projectTitle}
              >
                {cardTitle}
              </CardTitle>
              <Badge variant={statusVariants[project.status]} className="shrink-0 text-xs">
                {statusKeys[project.status] ? t(statusKeys[project.status]) : project.status}
              </Badge>
              <button
                onClick={handleToggleStar}
                className={cn(
                  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-all",
                  starred
                    ? "text-amber-400 opacity-100"
                    : "text-slate-400 opacity-0 hover:text-amber-400 group-hover:opacity-100 dark:text-white/30"
                )}
              >
                <Star className={cn("h-4 w-4", starred && "fill-amber-400")} />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-white/8"
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
            <p className="mt-1 line-clamp-1 text-[15px] leading-6 text-muted-foreground" title={projectTopic}>
              {projectTopic}
            </p>
          </CardHeader>
          <CardContent className="mt-auto px-4 pt-1.5 pb-2">
            <div className="mb-2 flex items-center gap-3 text-sm text-muted-foreground">
              <span>{chapterCount} {t("misc.chapter")}</span>
              <span>{subchapterCount} {t("misc.section")}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{lang === "zh" ? "创建时间" : "Created"}</span>
                <span>{new Date(project.createdAt).toLocaleDateString(dateLocale)}</span>
              </span>
            </div>
            {project.progress && (
              <div className="flex items-center gap-2.5">
                <div className="min-w-0 flex-1 rounded-full bg-slate-100/90 p-1 dark:bg-white/6">
                <Progress
                  value={project.progress.completionPercent}
                  className="h-1.5"
                />
                </div>
                <span className="shrink-0 text-sm font-semibold text-muted-foreground">
                  {Math.round(project.progress.completionPercent)}%
                </span>
              </div>
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
