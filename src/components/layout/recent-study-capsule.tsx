"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/lib/i18n";

interface RecentStudyData {
  projectId: string;
  projectTitle: string;
  projectTitleEn: string | null;
  chapterId: string;
  subchapterId: string;
  chapterLabel: string;
  subchapterLabel: string;
  completionPercent: number;
  href: string;
}

interface CurrentProjectData {
  id: string;
  title: string;
  titleEn: string | null;
  completionPercent: number;
}

function parseCourseContext(pathname: string) {
  return pathname.match(
    /\/projects\/([^/]+)\/chapters\/[^/]+\/subchapters\/[^/]+\/(main|summary|quiz)$/
  );
}

const hiddenPaths = ["/login", "/about", "/projects/new", "/settings"];
const separator = "·";

export function RecentStudyCapsule() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const params = useParams();
  const { lang } = useLanguage();
  const [recentStudy, setRecentStudy] = useState<RecentStudyData | null>(null);
  const [currentProject, setCurrentProject] = useState<CurrentProjectData | null>(null);
  const [loaded, setLoaded] = useState(false);

  const isLoggedIn = !!session;
  const isHiddenPage = hiddenPaths.some((p) => pathname.startsWith(p));
  const isHomepage = pathname === "/";
  const isCoursePage = !!parseCourseContext(pathname);
  const currentProjectId = typeof params.projectId === "string" ? params.projectId : null;
  const isProjectOverviewPage = !!currentProjectId && pathname === `/projects/${currentProjectId}`;

  useEffect(() => {
    if (!isLoggedIn || isHiddenPage) {
      setLoaded(true);
      return;
    }

    let cancelled = false;

    async function loadCapsule() {
      try {
        if (isCoursePage && currentProjectId) {
          const response = await fetch(`/api/projects/${currentProjectId}`);
          if (!response.ok) throw new Error("Failed to load project progress");
          const data = (await response.json()) as CurrentProjectData;
          if (!cancelled) {
            setCurrentProject(data);
            setRecentStudy(null);
            setLoaded(true);
          }
          return;
        }

        if (isProjectOverviewPage || (isHomepage && !isLoggedIn)) {
          if (!cancelled) {
            setCurrentProject(null);
            setRecentStudy(null);
            setLoaded(true);
          }
          return;
        }

        const response = await fetch("/api/user/recent-study");
        const data = (await response.json()) as RecentStudyData | null;
        if (!cancelled) {
          setRecentStudy(data);
          setCurrentProject(null);
          setLoaded(true);
        }
      } catch {
        if (!cancelled) setLoaded(true);
      }
    }

    void loadCapsule();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, isHiddenPage, isHomepage, isCoursePage, isProjectOverviewPage, currentProjectId]);

  if (!isLoggedIn || isHiddenPage || !loaded) return null;

  if (isCoursePage && currentProject) {
    const title = lang === "en" && currentProject.titleEn ? currentProject.titleEn : currentProject.title;
    const progressLabel = lang === "zh" ? "当前进度" : "Progress";
    const statusLabel = lang === "zh" ? "学习中" : "In progress";

    return (
      <Link
        href={`/projects/${currentProject.id}`}
        className="group hidden items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/90 py-1 pr-3 pl-2.5 shadow-[0_2px_8px_rgba(15,23,42,0.06)] backdrop-blur transition-all hover:border-primary/30 hover:shadow-[0_4px_16px_rgba(15,23,42,0.1)] xl:flex dark:border-white/10 dark:bg-slate-900/80 dark:shadow-[0_2px_8px_rgba(2,6,23,0.2)] dark:hover:border-primary/25"
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/15 dark:bg-green-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        </span>
        <span className="flex min-w-0 items-center gap-1.5 text-xs">
          <span className="truncate max-w-[140px] font-semibold text-foreground lg:max-w-[200px]">
            {title}
          </span>
          <span className="shrink-0 text-muted-foreground/70">{separator}</span>
          <span className="shrink-0 text-muted-foreground">{progressLabel} {currentProject.completionPercent}%</span>
        </span>
        <span className="shrink-0 text-[0.65rem] font-semibold text-green-600 transition-colors group-hover:text-green-500 dark:text-green-400 dark:group-hover:text-green-300">
          {statusLabel}
        </span>
      </Link>
    );
  }

  if (isProjectOverviewPage || !recentStudy) return null;

  const title = lang === "en" && recentStudy.projectTitleEn ? recentStudy.projectTitleEn : recentStudy.projectTitle;
  const continueLabel = lang === "zh" ? "继续学习" : "Continue";
  const positionLabel = `${lang === "zh" ? "第" : "Ch "}${recentStudy.chapterLabel}${lang === "zh" ? "章" : ""} ${separator} ${recentStudy.subchapterLabel}`;

  return (
    <Link
      href={recentStudy.href}
      className="group hidden items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/90 py-1 pr-3 pl-2.5 shadow-[0_2px_8px_rgba(15,23,42,0.06)] backdrop-blur transition-all hover:border-primary/30 hover:shadow-[0_4px_16px_rgba(15,23,42,0.1)] md:flex dark:border-white/10 dark:bg-slate-900/80 dark:shadow-[0_2px_8px_rgba(2,6,23,0.2)] dark:hover:border-primary/25"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/15 dark:bg-green-500/20">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
      </span>
      <span className="flex min-w-0 items-center gap-1.5 text-xs">
        <span className="truncate max-w-[120px] font-semibold text-foreground lg:max-w-[180px]">
          {title}
        </span>
        <span className="shrink-0 text-muted-foreground/70">{separator}</span>
        <span className="shrink-0 text-muted-foreground">{positionLabel}</span>
      </span>
      <span className="shrink-0 text-[0.65rem] font-semibold text-green-600 transition-colors group-hover:text-green-500 dark:text-green-400 dark:group-hover:text-green-300">
        {continueLabel}
      </span>
    </Link>
  );
}
