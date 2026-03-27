"use client";

import { useEffect, useState, useCallback } from "react";
import { signOut } from "next-auth/react";
import {
  User,
  Palette,
  BrainCircuit,
  BookOpen,
  LogOut,
  Trash2,
  Check,
  Moon,
  Sun,
  Globe,
  Sparkles,
  Scale,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

type Preferences = {
  teachingStyle: string;
  reasoningLevel: string;
  defaultModel: string;
  contentDetail: string;
  quizCount: number;
  emailDigest: boolean;
};

const DEFAULT_PREFS: Preferences = {
  teachingStyle: "balanced",
  reasoningLevel: "medium",
  defaultModel: "",
  contentDetail: "standard",
  quizCount: 5,
  emailDigest: false,
};

type UserInfo = {
  name: string;
  email: string;
  image: string;
  isGuest: boolean;
};

export function SettingsContent({ user }: { user: UserInfo }) {
  const { t, lang, setLang, theme, setTheme } = useLanguage();
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setPrefs({ ...DEFAULT_PREFS, ...data }); })
      .catch(() => {});
  }, []);

  const savePrefs = useCallback(
    async (update: Partial<Preferences>) => {
      const next = { ...prefs, ...update };
      setPrefs(next);
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    },
    [prefs]
  );

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-500 animate-in fade-in">
            <Check className="h-4 w-4" />
            {t("settings.saved")}
          </span>
        )}
      </div>

      <div className="space-y-8">
        {/* ─── Profile ──────────────────────────── */}
        <Section icon={User} title={t("settings.profile")}>
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {user.isGuest
                  ? t("settings.profile.guest")
                  : t("settings.profile.google")}
              </p>
            </div>
          </div>
        </Section>

        {/* ─── Appearance & Language ─────────────── */}
        <Section icon={Palette} title={t("settings.appearance")}>
          <SettingRow label={t("settings.appearance.theme")}>
            <ToggleGroup
              value={theme}
              onChange={(v) => setTheme(v as "dark" | "light")}
              options={[
                {
                  value: "dark",
                  label: t("settings.appearance.dark"),
                  icon: <Moon className="h-3.5 w-3.5" />,
                },
                {
                  value: "light",
                  label: t("settings.appearance.light"),
                  icon: <Sun className="h-3.5 w-3.5" />,
                },
              ]}
            />
          </SettingRow>
          <SettingRow label={t("settings.appearance.language")}>
            <ToggleGroup
              value={lang}
              onChange={(v) => setLang(v as "zh" | "en")}
              options={[
                {
                  value: "zh",
                  label: t("settings.appearance.zh"),
                  icon: <Globe className="h-3.5 w-3.5" />,
                },
                {
                  value: "en",
                  label: t("settings.appearance.en"),
                  icon: <Globe className="h-3.5 w-3.5" />,
                },
              ]}
            />
          </SettingRow>
        </Section>

        {/* ─── AI Tutor ─────────────────────────── */}
        <Section
          icon={BrainCircuit}
          title={t("settings.ai")}
          desc={t("settings.ai.desc")}
        >
          <SettingRow label={t("settings.ai.style")}>
            <CardSelect
              value={prefs.teachingStyle}
              onChange={(v) => savePrefs({ teachingStyle: v })}
              options={[
                {
                  value: "encouraging",
                  label: t("settings.ai.style.encouraging"),
                  desc: t("settings.ai.style.encouraging.desc"),
                  icon: <Sparkles className="h-4 w-4 text-amber-400" />,
                },
                {
                  value: "balanced",
                  label: t("settings.ai.style.balanced"),
                  desc: t("settings.ai.style.balanced.desc"),
                  icon: <Scale className="h-4 w-4 text-blue-400" />,
                },
                {
                  value: "concise",
                  label: t("settings.ai.style.concise"),
                  desc: t("settings.ai.style.concise.desc"),
                  icon: <Zap className="h-4 w-4 text-emerald-400" />,
                },
              ]}
            />
          </SettingRow>

          <SettingRow
            label={t("settings.ai.reasoning")}
            desc={t("settings.ai.reasoning.desc")}
          >
            <ToggleGroup
              value={prefs.reasoningLevel}
              onChange={(v) => savePrefs({ reasoningLevel: v })}
              options={[
                { value: "low", label: t("model.low") },
                { value: "medium", label: t("model.medium") },
                { value: "high", label: t("model.high") },
              ]}
            />
          </SettingRow>
        </Section>

        {/* ─── Learning Preferences ─────────────── */}
        <Section
          icon={BookOpen}
          title={t("settings.learning")}
          desc={t("settings.learning.desc")}
        >
          <SettingRow label={t("settings.learning.detail")}>
            <CardSelect
              value={prefs.contentDetail}
              onChange={(v) => savePrefs({ contentDetail: v })}
              options={[
                {
                  value: "beginner",
                  label: t("settings.learning.detail.beginner"),
                  desc: t("settings.learning.detail.beginner.desc"),
                },
                {
                  value: "standard",
                  label: t("settings.learning.detail.standard"),
                  desc: t("settings.learning.detail.standard.desc"),
                },
                {
                  value: "advanced",
                  label: t("settings.learning.detail.advanced"),
                  desc: t("settings.learning.detail.advanced.desc"),
                },
              ]}
            />
          </SettingRow>

          <SettingRow
            label={t("settings.learning.quiz")}
            desc={t("settings.learning.quiz.desc")}
          >
            <ToggleGroup
              value={String(prefs.quizCount)}
              onChange={(v) => savePrefs({ quizCount: Number(v) })}
              options={[
                { value: "3", label: "3" },
                { value: "5", label: "5" },
                { value: "10", label: "10" },
              ]}
            />
          </SettingRow>
        </Section>

        {/* ─── Account ──────────────────────────── */}
        <Section icon={User} title={t("settings.account")}>
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" />
              {t("settings.account.logout")}
            </Button>

            {!deleteConfirm ? (
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4" />
                {t("settings.account.delete")}
              </Button>
            ) : (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4">
                <p className="mb-3 text-sm text-destructive">
                  {t("settings.account.delete.confirm")}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteConfirm(false)}
                  >
                    {t("delete.cancel")}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      await fetch("/api/settings", { method: "DELETE" });
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    {t("delete.confirm")}
                  </Button>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {t("settings.account.delete.desc")}
            </p>
          </div>
        </Section>
      </div>
    </main>
  );
}

/* ─── Sub-components ──────────────────────────────────── */

function Section({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border/60 bg-card/50 p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {desc && (
        <p className="mb-4 text-sm text-muted-foreground">{desc}</p>
      )}
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function SettingRow({
  label,
  desc,
  children,
}: {
  label: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {desc && (
          <p className="text-xs text-muted-foreground">{desc}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function ToggleGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; icon?: React.ReactNode }[];
}) {
  return (
    <div className="flex gap-1.5 rounded-lg bg-muted/50 p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            value === opt.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function CardSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: {
    value: string;
    label: string;
    desc: string;
    icon?: React.ReactNode;
  }[];
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors ${
            value === opt.value
              ? "border-primary bg-primary/5 ring-1 ring-primary/30"
              : "border-border/60 hover:border-border hover:bg-muted/30"
          }`}
        >
          <div className="flex items-center gap-1.5">
            {opt.icon}
            <span className="text-sm font-medium">{opt.label}</span>
          </div>
          <span className="text-xs text-muted-foreground">{opt.desc}</span>
        </button>
      ))}
    </div>
  );
}
