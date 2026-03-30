import { cookies } from "next/headers";
import {
  createGuestSessionForUser,
  getSessionCookieName,
  guestUpgradeCookie,
  shouldUseSecureCookies,
  verifyGuestUpgradeToken,
} from "@/lib/auth/guest-upgrade";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(guestUpgradeCookie.name)?.value;
  const payload = verifyGuestUpgradeToken(token);

  if (!payload) {
    cookieStore.delete(guestUpgradeCookie.name);
    return Response.json({ restored: false }, { status: 400 });
  }

  const restoredSession = await createGuestSessionForUser(payload.guestUserId);

  if (!restoredSession) {
    cookieStore.delete(guestUpgradeCookie.name);
    return Response.json({ restored: false }, { status: 404 });
  }

  cookieStore.set(getSessionCookieName(), restoredSession.sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: restoredSession.expires,
    secure: shouldUseSecureCookies(),
  });

  cookieStore.delete(guestUpgradeCookie.name);

  return Response.json({ restored: true });
}
