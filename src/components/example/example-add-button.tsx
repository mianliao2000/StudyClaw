"use client";

import { useEffect, useRef, useState } from "react";
import {
  type ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

type AddTarget = {
  chapterSlug: string;
  subchapterSlug: string;
  lessonType: "main" | "summary" | "quiz";
};

interface ExampleAddButtonProps {
  courseSlug: string;
  target?: AddTarget;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
}

function withIntent(pathname: string, searchParams: ReadonlyURLSearchParams) {
  const nextParams = new URLSearchParams(searchParams.toString());
  nextParams.set("intent", "add-to-project");
  const query = nextParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function withoutIntent(pathname: string, searchParams: ReadonlyURLSearchParams) {
  const nextParams = new URLSearchParams(searchParams.toString());
  nextParams.delete("intent");
  const query = nextParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function ExampleAddButton({
  courseSlug,
  target,
  className,
  variant = "default",
  size = "default",
}: ExampleAddButtonProps) {
  const { lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoRunRef = useRef(false);

  const loginHref = `/login?next=${encodeURIComponent(
    withIntent(pathname, searchParams)
  )}`;

  async function submitAdd() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/examples/${courseSlug}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(target ?? {}),
      });

      if (response.status === 401) {
        router.push(loginHref);
        return;
      }

      const payload = (await response.json().catch(() => null)) as
        | { redirectTo?: string; error?: string }
        | null;

      if (!response.ok || !payload?.redirectTo) {
        throw new Error(
          payload?.error ??
            (lang === "en"
              ? "Unable to add this sample course right now."
              : "暂时无法把这门示例课加入“我的项目”。")
        );
      }

      router.push(payload.redirectTo);
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : lang === "en"
            ? "Unable to add this sample course right now."
            : "暂时无法把这门示例课加入“我的项目”。"
      );

      if (searchParams.get("intent") === "add-to-project") {
        router.replace(withoutIntent(pathname, searchParams));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (autoRunRef.current) return;
    if (status !== "authenticated") return;
    if (searchParams.get("intent") !== "add-to-project") return;

    autoRunRef.current = true;
    void submitAdd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pathname, searchParams.toString()]);

  const buttonLabel = isSubmitting
    ? lang === "en"
      ? "Adding..."
      : "添加中..."
    : lang === "en"
      ? "Add to My Projects"
      : "添加到“我的项目”";

  return (
    <div className="space-y-2">
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled={isSubmitting}
        onClick={() => {
          if (!session?.user) {
            router.push(loginHref);
            return;
          }

          void submitAdd();
        }}
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        {buttonLabel}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
