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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const nextPath = sanitizeNextPath(url.searchParams.get("next"));
  const cookieStore = await cookies();
  cookieStore.delete(guestUpgradeCookie.name);

  return NextResponse.redirect(new URL(nextPath, url));
}
