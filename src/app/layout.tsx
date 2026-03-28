import type { Metadata } from "next";
import { cookies } from "next/headers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pandora AI - 个性化 AI 学习平台",
  description: "AI 驱动的个性化学习规划与辅导平台",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const isDark = themeCookie !== "light";
  const langCookie = cookieStore.get("lang")?.value;
  const htmlLang = langCookie === "en" ? "en" : "zh-CN";

  return (
    <html
      lang={htmlLang}
      className={`h-full antialiased${isDark ? " dark" : ""}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <SessionProvider>
          <LanguageProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
