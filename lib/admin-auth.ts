import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";

export const adminCookieName = "portfolio_admin";
const sessionLifetimeSeconds = 60 * 60 * 24 * 7;

function getAuthConfig() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!password || !secret || secret.length < 32) {
    return null;
  }
  return { password, secret };
}

function signature(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function isAdminConfigured() {
  return getAuthConfig() !== null;
}

export function verifyAdminPassword(candidate: string) {
  const config = getAuthConfig();
  if (!config || candidate.length > 256) {
    return false;
  }
  const expected = createHmac("sha256", config.secret)
    .update(config.password)
    .digest();
  const actual = createHmac("sha256", config.secret).update(candidate).digest();
  return timingSafeEqual(expected, actual);
}

export function isAdminRequest(request: NextRequest) {
  const config = getAuthConfig();
  const token = request.cookies.get(adminCookieName)?.value;
  if (!config || !token) {
    return false;
  }

  const separator = token.indexOf(".");
  if (separator < 1) {
    return false;
  }
  const issuedAt = Number(token.slice(0, separator));
  const suppliedSignature = token.slice(separator + 1);
  const now = Math.floor(Date.now() / 1000);
  if (
    !Number.isSafeInteger(issuedAt) ||
    issuedAt > now ||
    now - issuedAt > sessionLifetimeSeconds
  ) {
    return false;
  }

  const expectedSignature = signature(String(issuedAt), config.secret);
  const expected = Buffer.from(expectedSignature);
  const supplied = Buffer.from(suppliedSignature);
  return (
    expected.length === supplied.length && timingSafeEqual(expected, supplied)
  );
}

export function setAdminCookie(response: NextResponse) {
  const config = getAuthConfig();
  if (!config) {
    throw new Error("Admin authentication is not configured.");
  }
  const issuedAt = String(Math.floor(Date.now() / 1000));
  response.cookies.set(
    adminCookieName,
    `${issuedAt}.${signature(issuedAt, config.secret)}`,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: sessionLifetimeSeconds,
    },
  );
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set(adminCookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
