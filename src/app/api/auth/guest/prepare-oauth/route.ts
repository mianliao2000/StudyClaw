import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import {
  createGuestUpgradeToken,
  guestUpgradeCookie,
  shouldUseSecureCookies,
} from "@/lib/auth/guest-upgrade";

export async function POST() {
  const session = await auth();

  if (!session?.user?.id || !(session.user as any).isGuest) {
    return Response.json({ prepared: false }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set(
    guestUpgradeCookie.name,
    createGuestUpgradeToken(session.user.id),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: guestUpgradeCookie.maxAgeSeconds,
      secure: shouldUseSecureCookies(),
    }
  );

  return Response.json({ prepared: true });
}
