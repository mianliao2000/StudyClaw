"use client";

import { useCallback, useEffect, useState } from "react";
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
const separator = "\u00b7";

function CapsuleProgress({ value }: { value: number }) {
  return (
    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
      <div
        className="h-full rounded-full bg-green-500 transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

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
  const isCoursePage = !!parseCourseContext(pathname);
  const currentProjectId = typeof params.projectId === "string" ? params.projectId : null;
  const isProjectOverviewPage = !!currentProjectId && pathname === `/projects/${currentProjectId}`;
  const shouldShowCurrentProjectCapsule = (isCoursePage || isProjectOverviewPage) && !!currentProjectId;

  const loadCapsule = useCallback(async () => {
    if (!isLoggedIn || isHiddenPage) {
      setLoaded(true);
      return;
    }

    try {
      if (shouldShowCurrentProjectCapsule && currentProjectId) {
        const response = await fetch(`/api/projects/${currentProjectId}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load project progress");
        const data = (await response.json()) as CurrentProjectData;
        setCurrentProject(data);
        setRecentStudy(null);
        setLoaded(true);
        return;
      }

      const response = await fetch("/api/user/recent-study", { cache: "no-store" });
      const data = (await response.json()) as RecentStudyData | null;
      setRecentStudy(data);
      setCurrentProject(null);
      setLoaded(true);
    } catch {
      setLoaded(true);
    }
  }, [currentProjectId, isHiddenPage, isLoggedIn, shouldShowCurrentProjectCapsule]);

  useEffect(() => {
    void loadCapsule();
  }, [loadCapsule]);

  useEffect(() => {
    if (!isLoggedIn || isHiddenPage) return;

    const handleProgressUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ projectId?: string }>).detail;
      if (!detail?.projectId) {
        void loadCapsule();
        return;
      }

      if (shouldShowCurrentProjectCapsule) {
        if (detail.projectId === currentProjectId) {
          void loadCapsule();
        }
        return;
      }

      void loadCapsule();
    };

    window.addEventListener("studyclaw:progress-updated", handleProgressUpdated);
    return () => {
      window.removeEventListener("studyclaw:progress-updated", handleProgressUpdated);
    };
  }, [currentProjectId, isHiddenPage, isLoggedIn, loadCapsule, shouldShowCurrentProjectCapsule]);

  if (!isLoggedIn || isHiddenPage || !loaded) return null;

  if (shouldShowCurrentProjectCapsule && currentProject) {
    const title = lang === "en" && currentProject.titleEn ? currentProject.titleEn : currentProject.title;
    const progressLabel = lang === "zh" ? "\u5f53\u524d\u8fdb\u5ea6" : "Progress";
    const statusLabel = lang === "zh" ? "\u5b66\u4e60\u4e2d" : "In progress";

    return (
      <Link
        href={`/projects/${currentProject.id}`}
        className="group hidden min-w-[280px] max-w-[420px] items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/90 py-1.5 pr-3 pl-2.5 shadow-[0_2px_8px_rgba(15,23,42,0.06)] backdrop-blur transition-all hover:border-primary/30 hover:shadow-[0_4px_16px_rgba(15,23,42,0.1)] xl:flex dark:border-white/10 dark:bg-slate-900/80 dark:shadow-[0_2px_8px_rgba(2,6,23,0.2)] dark:hover:border-primary/25"
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/15 dark:bg-green-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1.5 text-xs">
            <span className="truncate max-w-[150px] font-semibold text-foreground lg:max-w-[190px]">
              {title}
            </span>
            <span className="shrink-0 text-muted-foreground/70">{separator}</span>
            <span className="shrink-0 text-muted-foreground">{progressLabel} {currentProject.completionPercent}%</span>
          </div>
          <CapsuleProgress value={currentProject.completionPercent} />
        </div>
        <span className="shrink-0 text-[0.65rem] font-semibold text-green-600 transition-colors group-hover:text-green-500 dark:text-green-400 dark:group-hover:text-green-300">
          {statusLabel}
        </span>
      </Link>
    );
  }

  if (!recentStudy) return null;

  const title = lang === "en" && recentStudy.projectTitleEn ? recentStudy.projectTitleEn : recentStudy.projectTitle;
  const continueLabel = lang === "zh" ? "\u7ee7\u7eed\u5b66\u4e60" : "Continue";
  const positionLabel = `${lang === "zh" ? "\u7b2c" : "Ch "}${recentStudy.chapterLabel}${lang === "zh" ? "\u7ae0" : ""} ${separator} ${recentStudy.subchapterLabel}`;

  return (
    <Link
      href={recentStudy.href}
      className="group hidden min-w-[280px] max-w-[420px] items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/90 py-1.5 pr-3 pl-2.5 shadow-[0_2px_8px_rgba(15,23,42,0.06)] backdrop-blur transition-all hover:border-primary/30 hover:shadow-[0_4px_16px_rgba(15,23,42,0.1)] md:flex dark:border-white/10 dark:bg-slate-900/80 dark:shadow-[0_2px_8px_rgba(2,6,23,0.2)] dark:hover:border-primary/25"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/15 dark:bg-green-500/20">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1.5 text-xs">
          <span className="truncate max-w-[150px] font-semibold text-foreground lg:max-w-[190px]">
            {title}
          </span>
          <span className="shrink-0 text-muted-foreground/70">{separator}</span>
          <span className="shrink-0 text-muted-foreground">{positionLabel}</span>
        </div>
        <CapsuleProgress value={recentStudy.completionPercent} />
      </div>
      <span className="shrink-0 text-[0.65rem] font-semibold text-green-600 transition-colors group-hover:text-green-500 dark:text-green-400 dark:group-hover:text-green-300">
        {continueLabel}
      </span>
    </Link>
  );
}
