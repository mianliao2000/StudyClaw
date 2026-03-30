import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/db";

const GUEST_UPGRADE_COOKIE = "guest-upgrade";
const GUEST_UPGRADE_TTL_MS = 10 * 60 * 1000;

type GuestUpgradePayload = {
  guestUserId: string;
  exp: number;
};

function getGuestUpgradeSecret() {
  return process.env.AUTH_SECRET ?? "guest-upgrade-fallback-secret";
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(encodedPayload: string) {
  return createHmac("sha256", getGuestUpgradeSecret())
    .update(encodedPayload)
    .digest("base64url");
}

export function createGuestUpgradeToken(guestUserId: string) {
  const payload: GuestUpgradePayload = {
    guestUserId,
    exp: Date.now() + GUEST_UPGRADE_TTL_MS,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyGuestUpgradeToken(token: string | undefined) {
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = signPayload(encodedPayload);
  const providedSignature = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    providedSignature.length !== expectedSignatureBuffer.length ||
    !timingSafeEqual(providedSignature, expectedSignatureBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as GuestUpgradePayload;
    if (!payload.guestUserId || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function shouldUseSecureCookies() {
  return process.env.AUTH_URL?.startsWith("https://") ?? false;
}

export function getSessionCookieName() {
  return `${shouldUseSecureCookies() ? "__Secure-" : ""}authjs.session-token`;
}

export async function createGuestSessionForUser(guestUserId: string) {
  const guestUser = await prisma.user.findUnique({
    where: { id: guestUserId },
    select: { id: true, isGuest: true, guestExpiresAt: true },
  });

  if (!guestUser?.isGuest) {
    return null;
  }

  const expires =
    guestUser.guestExpiresAt && guestUser.guestExpiresAt > new Date()
      ? guestUser.guestExpiresAt
      : new Date(Date.now() + 24 * 60 * 60 * 1000);

  const sessionToken = randomUUID();

  await prisma.session.create({
    data: {
      sessionToken,
      userId: guestUser.id,
      expires,
    },
  });

  return {
    sessionToken,
    expires,
  };
}

export const guestUpgradeCookie = {
  name: GUEST_UPGRADE_COOKIE,
  maxAgeSeconds: Math.floor(GUEST_UPGRADE_TTL_MS / 1000),
};
