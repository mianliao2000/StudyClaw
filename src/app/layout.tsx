import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pandora AI - 个人化 AI 学习平台",
  description: "AI 驱动的个人化学习规划与辅导平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="dark h-full antialiased"
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        <SessionProvider>
          <LanguageProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
