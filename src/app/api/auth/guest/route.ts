import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

export async function POST() {
  try {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const guest = await prisma.user.create({
      data: {
        name: "Guest",
        isGuest: true,
        guestExpiresAt: expires,
      },
    });

    const sessionToken = randomUUID();

    await prisma.session.create({
      data: {
        sessionToken,
        userId: guest.id,
        expires,
      },
    });

    const useSecureCookies =
      process.env.AUTH_URL?.startsWith("https://") ||
      process.env.NODE_ENV === "production";
    const sessionCookieName = `${useSecureCookies ? "__Secure-" : ""}authjs.session-token`;
    const cookieStore = await cookies();
    cookieStore.set(sessionCookieName, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      expires,
      secure: useSecureCookies,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Guest login error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return Response.json({ error: msg }, { status: 500 });
  }
}
