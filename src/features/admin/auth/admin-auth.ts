import "server-only";

import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieName = "admin_session";
const sessionLifetimeSeconds = 60 * 60 * 8;

function getAuthConfig(): { username: string; passwordHash: string; sessionSecret: string } | null {
  const username = process.env.ADMIN_USERNAME?.trim();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!username || !passwordHash || !sessionSecret || sessionSecret.length < 32) return null;
  return { username, passwordHash, sessionSecret };
}

export function isAdminAuthConfigured(): boolean {
  return getAuthConfig() !== null;
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const config = getAuthConfig();
  if (!config) return false;

  const [salt, storedHex, extra] = config.passwordHash.split(":");
  if (!salt || !storedHex || extra || !/^[a-f0-9]{32}$/i.test(salt) || !/^[a-f0-9]{128}$/i.test(storedHex)) return false;

  const actual = scryptSync(password, Buffer.from(salt, "hex"), 64);
  const expected = Buffer.from(storedHex, "hex");
  const usernameMatches = username === config.username;
  return timingSafeEqual(actual, expected) && usernameMatches;
}

function signSession(expiresAt: number, secret: string, username: string): string {
  return createHmac("sha256", secret).update(`v1.${username}.${expiresAt}`).digest("hex");
}

export async function createAdminSession(): Promise<void> {
  const config = getAuthConfig();
  if (!config) throw new Error("Admin authentication is not configured");

  const expiresAt = Math.floor(Date.now() / 1000) + sessionLifetimeSeconds;
  const signature = signSession(expiresAt, config.sessionSecret, config.username);
  (await cookies()).set(cookieName, `v1.${expiresAt}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: sessionLifetimeSeconds,
  });
}

export async function hasAdminSession(): Promise<boolean> {
  const config = getAuthConfig();
  const token = (await cookies()).get(cookieName)?.value;
  if (!config || !token) return false;

  const [version, expiry, signature, extra] = token.split(".");
  if (version !== "v1" || !expiry || !signature || extra || !/^\d{10}$/.test(expiry) || !/^[a-f0-9]{64}$/i.test(signature)) return false;

  const expiresAt = Number(expiry);
  if (expiresAt <= Math.floor(Date.now() / 1000) || expiresAt > Math.floor(Date.now() / 1000) + sessionLifetimeSeconds) return false;

  const expected = Buffer.from(signSession(expiresAt, config.sessionSecret, config.username), "hex");
  return timingSafeEqual(Buffer.from(signature, "hex"), expected);
}

export async function requireAdmin(): Promise<void> {
  if (!(await hasAdminSession())) redirect("/admin/login");
}

export async function clearAdminSession(): Promise<void> {
  (await cookies()).delete(cookieName);
}
