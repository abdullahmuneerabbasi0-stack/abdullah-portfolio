"use server";

import { redirect } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
import { db, isDbConfigured } from "@/lib/server/db";
import {
  clientIpHash,
  createSession,
  currentTokenHash,
  destroySession,
  loginBlocked,
  recordLoginAttempt,
  sha256,
} from "@/lib/server/auth";
import { dummyHash, hashPassword, passwordProblem, verifyPassword } from "@/lib/server/password";
import { logActivity, seedIfEmpty } from "@/lib/server/repo";
import { Ctx, email as emailField, text } from "@/lib/validate";
import { adminAction, UserError } from "./admin/shared";

export type FormState = { error?: string; errors?: Record<string, string> };

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  if (!isDbConfigured()) return { error: "The database isn't connected yet." };
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 254);
  const password = String(form.get("password") ?? "").slice(0, 200);
  const next = String(form.get("next") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const ipHash = await clientIpHash();
  if (await loginBlocked(email, ipHash)) return { error: "Too many failed attempts. Wait 15 minutes and try again." };

  const [user] = await db()<{ id: string; password_hash: string }[]>`select id, password_hash from admin_users where email = ${email}`;
  // Always run one hash so response time doesn't reveal whether the email exists.
  const ok = user ? await verifyPassword(password, user.password_hash) : (await verifyPassword(password, await dummyHash()), false);
  await recordLoginAttempt(email, ipHash, ok);
  if (!user || !ok) return { error: "That email and password don't match." };

  await db()`update admin_users set last_login_at = now() where id = ${user.id}`;
  await createSession(user.id);
  await logActivity({ id: user.id, email, name: "" }, "login", "account", null, "Signed in");
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logout() {
  if (isDbConfigured()) await destroySession();
  redirect("/admin/login");
}

const sameToken = (a: string, b: string) => {
  const x = Buffer.from(sha256(a));
  const y = Buffer.from(sha256(b));
  return timingSafeEqual(x, y);
};

/**
 * First-run setup. Works only while no administrator exists, and only with
 * the ADMIN_SETUP_TOKEN set in the hosting environment, so nobody else can
 * claim the admin panel of a freshly deployed site.
 */
export async function setupAdmin(_prev: FormState, form: FormData): Promise<FormState> {
  if (!isDbConfigured()) return { error: "The database isn't connected yet." };
  // Trimmed on both sides: a stray space or newline from copy-paste shouldn't lock you out.
  const expected = (process.env.ADMIN_SETUP_TOKEN ?? "").trim();
  if (expected.length < 16) return { error: "ADMIN_SETUP_TOKEN must be set (at least 16 characters) in your hosting environment." };

  const ipHash = await clientIpHash();
  if (await loginBlocked("setup", ipHash)) return { error: "Too many failed attempts. Wait 15 minutes and try again." };
  if (!sameToken(String(form.get("token") ?? "").trim(), expected)) {
    await recordLoginAttempt("setup", ipHash, false);
    return { errors: { token: "That setup token is not correct." } };
  }

  const c = new Ctx();
  const name = text(c, form.get("name"), "name", { max: 80, required: true, label: "Your name" });
  const email = emailField(c, form.get("email"), "email", { required: true });
  const password = String(form.get("password") ?? "");
  const problem = passwordProblem(password, email);
  if (problem) c.fail("password", problem);
  if (password !== String(form.get("confirm") ?? "")) c.fail("confirm", "The passwords don't match.");
  if (!c.ok) return { errors: c.errors };

  const hash = await hashPassword(password);
  const created = await db().begin(async (sql) => {
    // Serialise concurrent setup attempts so only one admin can ever be created here.
    await sql`lock table admin_users in exclusive mode`;
    const [{ n }] = await sql<{ n: number }[]>`select count(*)::int as n from admin_users`;
    if (n > 0) return null;
    const [u] = await sql<{ id: string }[]>`insert into admin_users (email, name, password_hash) values (${email}, ${name}, ${hash}) returning id`;
    return u.id;
  });
  if (!created) return { error: "An administrator already exists. Please sign in." };

  const seeded = await seedIfEmpty();
  await createSession(created);
  await logActivity({ id: created, email, name }, "create", "account", created, "Created the administrator account");
  if (seeded) await logActivity({ id: created, email, name }, "import", "site", null, "Imported the current website content into the database");
  redirect("/admin?welcome=1");
}

export async function changePassword(input: { current: string; next: string; confirm: string }) {
  return adminAction(async (admin) => {
    const [u] = await db()<{ password_hash: string }[]>`select password_hash from admin_users where id = ${admin.id}`;
    if (!u || !(await verifyPassword(String(input.current ?? "").slice(0, 200), u.password_hash)))
      throw new UserError("Please fix the highlighted fields.", { current: "Your current password is not correct." });
    const problem = passwordProblem(String(input.next ?? ""), admin.email);
    if (problem) throw new UserError("Please fix the highlighted fields.", { next: problem });
    if (input.next !== input.confirm) throw new UserError("Please fix the highlighted fields.", { confirm: "The passwords don't match." });
    const hash = await hashPassword(input.next);
    const keep = await currentTokenHash();
    await db()`update admin_users set password_hash = ${hash} where id = ${admin.id}`;
    // A password change signs out every other device.
    await db()`delete from admin_sessions where user_id = ${admin.id} and token_hash <> ${keep ?? ""}`;
    await logActivity(admin, "update", "account", admin.id, "Changed the password and signed out other devices");
    return { message: "Password changed. Other devices have been signed out." };
  });
}

export async function updateAccount(input: { name: string; email: string }) {
  return adminAction(async (admin) => {
    const c = new Ctx();
    const name = text(c, input.name, "name", { max: 80, required: true, label: "Name" });
    const email = emailField(c, input.email, "email", { required: true });
    if (!c.ok) throw new UserError("Please fix the highlighted fields.", c.errors);
    await db()`update admin_users set name = ${name}, email = ${email} where id = ${admin.id}`;
    await logActivity(admin, "update", "account", admin.id, "Updated account details");
    return { message: "Account details saved." };
  });
}

export async function signOutOtherSessions() {
  return adminAction(async (admin) => {
    const keep = await currentTokenHash();
    const res = await db()`delete from admin_sessions where user_id = ${admin.id} and token_hash <> ${keep ?? ""}`;
    await logActivity(admin, "delete", "account", admin.id, "Signed out all other devices");
    return { message: `Signed out ${res.count} other session${res.count === 1 ? "" : "s"}.` };
  });
}
