import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import WeChat from "next-auth/providers/wechat";
import type { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";

const providers: Provider[] = [Google];

if (process.env.AUTH_WECHAT_APP_ID && process.env.AUTH_WECHAT_APP_SECRET) {
  providers.push(
    WeChat({
      clientId: process.env.AUTH_WECHAT_APP_ID,
      clientSecret: process.env.AUTH_WECHAT_APP_SECRET,
      platformType:
        process.env.AUTH_WECHAT_PLATFORM_TYPE === "OfficialAccount"
          ? "OfficialAccount"
          : "WebsiteApp",
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        (session.user as any).isGuest = (user as any).isGuest ?? false;
      }
      return session;
    },
  },
});
