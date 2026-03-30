import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { guestUpgradeCookie } from "@/lib/auth/guest-upgrade";

function sanitizeNextPath(rawValue: string | null) {
  if (
    !rawValue ||
    !rawValue.startsWith("/") ||
    rawValue.startsWith("//") ||
    rawValue === "/login" ||
    rawValue.startsWith("/login?")
  ) {
    return "/dashboard";
  }

  return rawValue;
}

function getPublicOrigin(request: Request) {
  const configuredUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
  if (configuredUrl) {
    try {
      return new URL(configuredUrl).origin;
    } catch {
      // Fall through to forwarded headers if env is malformed.
    }
  }

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return new URL(request.url).origin;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const nextPath = sanitizeNextPath(url.searchParams.get("next"));
  const cookieStore = await cookies();
  cookieStore.delete(guestUpgradeCookie.name);

  return NextResponse.redirect(new URL(nextPath, getPublicOrigin(request)));
}
