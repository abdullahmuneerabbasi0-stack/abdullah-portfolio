import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";

/**
 * Admin sessions.
 *
 * The browser gets a random 256-bit token in an http-only, SameSite=Strict
 * cookie (Secure in production). The database stores only its SHA-256 hash,
 * so a database leak doesn't leak live sessions. Every admin page, server
 * action and API route calls `requireAdmin()`; proxy.ts only does a fast,
 * optimistic redirect and is not relied on for security.
 */

const SESSION_DAYS = 7;
const IDLE_HOURS = 24;
export const SESSION_COOKIE = process.env.NODE_ENV === "production" ? "__Host-admin_session" : "admin_session";

export type Admin = { id: string; email: string; name: string };

export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export async function clientIpHash(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  // Salted so raw IP addresses are never stored.
  return sha256(`${process.env.ADMIN_SETUP_TOKEN ?? ""}:ip:${ip}`).slice(0, 32);
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const h = await headers();
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);
  await db()`
    insert into admin_sessions (token_hash, user_id, expires_at, user_agent, ip_hash)
    values (${sha256(token)}, ${userId}, ${expires}, ${(h.get("user-agent") ?? "").slice(0, 300)}, ${await clientIpHash()})
  `;
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires,
  });
}

/** The signed-in admin, or null. Cached for the duration of one request. */
export const getAdmin = cache(async (): Promise<Admin | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const hash = sha256(token);
  const rows = await db()<{ id: string; email: string; name: string; last_seen_at: Date }[]>`
    select u.id, u.email, u.name, s.last_seen_at
    from admin_sessions s join admin_users u on u.id = s.user_id
    where s.token_hash = ${hash} and s.expires_at > now()
  `;
  const row = rows[0];
  if (!row) return null;
  if (Date.now() - new Date(row.last_seen_at).getTime() > IDLE_HOURS * 36e5) {
    await db()`delete from admin_sessions where token_hash = ${hash}`;
    return null;
  }
  // Refresh "last seen" at most every 5 minutes.
  if (Date.now() - new Date(row.last_seen_at).getTime() > 5 * 6e4)
    await db()`update admin_sessions set last_seen_at = now() where token_hash = ${hash}`;
  return { id: row.id, email: row.email, name: row.name };
});

/** Use at the top of every admin page. Redirects to the login page when signed out. */
export async function requireAdminPage(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export class AuthError extends Error {
  constructor() {
    super("Your session has ended. Please sign in again.");
  }
}

/** Use at the top of every server action and admin API route. Throws when signed out. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) throw new AuthError();
  return admin;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db()`delete from admin_sessions where token_hash = ${sha256(token)}`;
  jar.delete(SESSION_COOKIE);
}

export async function currentTokenHash(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? sha256(token) : null;
}

// Rate limiting -----------------------------------------------------------------

const WINDOW_MIN = 15;
const MAX_PER_IP = 10;
const MAX_PER_EMAIL = 5;

export async function loginBlocked(email: string, ipHash: string): Promise<boolean> {
  const [row] = await db()<{ by_ip: number; by_email: number }[]>`
    select
      count(*) filter (where ip_hash = ${ipHash})::int as by_ip,
      count(*) filter (where email = ${email})::int as by_email
    from login_attempts
    where success = false and created_at > now() - make_interval(mins => ${WINDOW_MIN})
  `;
  return row.by_ip >= MAX_PER_IP || row.by_email >= MAX_PER_EMAIL;
}

export async function recordLoginAttempt(email: string, ipHash: string, success: boolean) {
  await db()`insert into login_attempts (email, ip_hash, success) values (${email}, ${ipHash}, ${success})`;
  // Keep the table small.
  await db()`delete from login_attempts where created_at < now() - interval '7 days'`;
}
