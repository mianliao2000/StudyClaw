"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProviders, signIn, useSession } from "next-auth/react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

function sanitizeNextPath(rawValue: string | null) {
  if (!rawValue || !rawValue.startsWith("/") || rawValue.startsWith("//")) {
    return "/dashboard";
  }

  return rawValue;
}

export default function LoginPage() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(
    () => sanitizeNextPath(searchParams.get("next")),
    [searchParams]
  );
  const { status, update } = useSession();
  const [wechatEnabled, setWechatEnabled] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    router.replace(nextPath);
    router.refresh();
  }, [nextPath, router, status]);

  useEffect(() => {
    let cancelled = false;

    getProviders()
      .then((providers) => {
        if (!cancelled) {
          setWechatEnabled(Boolean(providers?.wechat));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWechatEnabled(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleGuestLogin() {
    setGuestLoading(true);
    setGuestError(null);
    try {
      const res = await fetch("/api/auth/guest", { method: "POST" });
      if (res.ok) {
        await update();
        router.replace(nextPath);
        router.refresh();
        return;
      }
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setGuestError(data?.error ?? "Guest login failed.");
    } finally {
      setGuestLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <div className="rounded-xl border border-border/50 bg-card/80 p-8 glow-border glass">
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <Image
                src="/Box_Logo2_v3.png"
                alt="Pandora AI"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
                priority
              />
            </div>
            <h1 className="text-xl font-bold gradient-text">Pandora AI</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {t("login.subtitle")}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => signIn("google", { callbackUrl: nextPath })}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t("login.google")}
            </Button>

            <Button
              className="w-full"
              variant="outline"
              onClick={() => signIn("wechat", { callbackUrl: nextPath })}
              disabled={!wechatEnabled}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#07C160"
                  d="M8.37 6.11C4.3 6.11 1 8.8 1 12.11c0 1.9 1.08 3.6 2.76 4.72L3 20.5l3.4-1.73c.63.12 1.29.18 1.97.18 4.06 0 7.37-2.69 7.37-6s-3.31-6-7.37-6Zm-2.8 4.4a.74.74 0 1 1 0 1.48.74.74 0 0 1 0-1.48Zm2.8 0a.74.74 0 1 1 0 1.48.74.74 0 0 1 0-1.48Zm2.8 0a.74.74 0 1 1 0 1.48.74.74 0 0 1 0-1.48Z"
                />
                <path
                  fill="#07C160"
                  d="M15.54 10.13c4.12 0 7.46 2.53 7.46 5.66 0 1.77-1.05 3.34-2.69 4.38l.6 2.83-2.83-1.44c-.8.17-1.65.26-2.54.26-3.49 0-6.42-1.82-7.21-4.28.39.04.79.06 1.19.06 4.72 0 8.58-3.09 8.58-6.88 0-.21-.02-.4-.06-.59.5 0 .99 0 1.5 0Zm-2.84 4.53a.7.7 0 1 0 0 1.4.7.7 0 0 0 0-1.4Zm2.84 0a.7.7 0 1 0 0 1.4.7.7 0 0 0 0-1.4Zm2.83 0a.7.7 0 1 0 0 1.4.7.7 0 0 0 0-1.4Z"
                />
              </svg>
              {t("login.wechat")}
            </Button>

            {!wechatEnabled ? (
              <p className="text-center text-xs text-muted-foreground">
                {lang === "en"
                  ? "WeChat login is visible, but not configured yet on this deployment."
                  : "微信登录入口已显示，但当前环境还没有完成配置。"}
              </p>
            ) : null}

            <Button
              className="w-full"
              variant="secondary"
              onClick={handleGuestLogin}
              disabled={guestLoading}
            >
              <User className="mr-2 h-4 w-4" />
              {guestLoading ? "..." : t("login.guest")}
            </Button>

            {guestError ? (
              <p className="text-sm text-destructive text-center">{guestError}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
