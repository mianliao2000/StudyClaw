import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pandora AI - 个性化 AI 学习平台",
  description: "AI 驱动的个性化学习规划与辅导平台",
};

const themeInitScript = `
  try {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme !== "light";
    document.documentElement.classList.toggle("dark", isDark);
  } catch {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
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
