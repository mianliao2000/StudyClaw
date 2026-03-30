"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/lib/i18n";

export function GuestBanner() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!session?.user || !(session.user as any).isGuest) return null;

  const query = searchParams.toString();
  const nextPath = query ? `${pathname}?${query}` : pathname;
  const loginHref = `/login?next=${encodeURIComponent(nextPath)}`;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-center text-sm">
      <span className="text-amber-200">{t("guest.banner")}</span>{" "}
      <Link
        href={loginHref}
        className="font-medium text-amber-400 underline underline-offset-2 hover:text-amber-300"
      >
        {t("guest.loginLink")}
      </Link>
    </div>
  );
}
