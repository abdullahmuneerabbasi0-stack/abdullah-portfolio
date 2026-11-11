/**
 * Small, dependency-free validation helpers.
 *
 * Every value that reaches the database goes through one of the parsers in
 * src/lib/content/schemas.ts, which are built from these helpers. Parsers
 * coerce types, trim text, enforce lengths and collect readable errors keyed
 * by field path (e.g. "ctas.0.href") so forms can show them next to inputs.
 */

export type Errors = Record<string, string>;
export type Parsed<T> = { ok: true; value: T } | { ok: false; errors: Errors };

export class Ctx {
  errors: Errors = {};
  fail(path: string, message: string) {
    if (!this.errors[path]) this.errors[path] = message;
  }
  get ok() {
    return Object.keys(this.errors).length === 0;
  }
  result<T>(value: T): Parsed<T> {
    return this.ok ? { ok: true, value } : { ok: false, errors: this.errors };
  }
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
export const obj = (v: unknown): Record<string, unknown> => (isObj(v) ? v : {});

// Control characters other than tab and newline are never useful in content.
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function text(
  ctx: Ctx,
  v: unknown,
  path: string,
  opts: { max?: number; required?: boolean; label?: string; multiline?: boolean } = {},
): string {
  const { max = 300, required = false, label = "This field", multiline = false } = opts;
  let s = typeof v === "string" ? v : typeof v === "number" ? String(v) : "";
  s = s.replace(CONTROL, "");
  if (!multiline) s = s.replace(/\s+/g, " ");
  s = s.trim();
  if (required && !s) ctx.fail(path, `${label} is required.`);
  if (s.length > max) ctx.fail(path, `${label} must be ${max} characters or fewer.`);
  return s.slice(0, max);
}

export function bool(v: unknown): boolean {
  return v === true || v === "true" || v === "on" || v === 1;
}

export function int(ctx: Ctx, v: unknown, path: string, opts: { min?: number; max?: number; label?: string } = {}): number {
  const { min = -1e9, max = 1e9, label = "This number" } = opts;
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    ctx.fail(path, `${label} must be a whole number.`);
    return min > 0 ? min : 0;
  }
  if (n < min || n > max) ctx.fail(path, `${label} must be between ${min} and ${max}.`);
  return Math.min(max, Math.max(min, n));
}

export function oneOf<T extends string>(ctx: Ctx, v: unknown, path: string, options: readonly T[], fallback: T): T {
  if (typeof v === "string" && (options as readonly string[]).includes(v)) return v as T;
  if (v !== undefined && v !== null && v !== "") ctx.fail(path, "Choose one of the listed options.");
  return fallback;
}

/**
 * Links may be absolute http(s) URLs, in-site paths ("/..." or "#..."),
 * mailto: or tel:. Anything else (javascript:, data:, ...) is rejected.
 */
export function link(ctx: Ctx, v: unknown, path: string, opts: { required?: boolean; label?: string } = {}): string {
  const s = text(ctx, v, path, { max: 500, required: opts.required, label: opts.label ?? "Link" });
  if (!s) return "";
  if (/^(\/(?!\/)|#)/.test(s)) {
    if (/\s/.test(s)) ctx.fail(path, "Links can't contain spaces.");
    return s;
  }
  if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(s) || /^tel:\+?[\d\s()-]{5,}$/i.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.protocol === "https:" || u.protocol === "http:") return u.toString();
  } catch {}
  ctx.fail(path, "Enter a full web address starting with https://, or a site path like /#contact.");
  return "";
}

export function webUrl(ctx: Ctx, v: unknown, path: string, label = "Address"): string {
  const s = text(ctx, v, path, { max: 500, label });
  if (!s) return "";
  try {
    const u = new URL(s);
    if (u.protocol === "https:" || u.protocol === "http:") return u.toString();
  } catch {}
  ctx.fail(path, `${label} must be a full web address starting with https://`);
  return "";
}

export function email(ctx: Ctx, v: unknown, path: string, opts: { required?: boolean; label?: string } = {}): string {
  const s = text(ctx, v, path, { max: 254, required: opts.required, label: opts.label ?? "Email" }).toLowerCase();
  if (s && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)) ctx.fail(path, "Enter a valid email address.");
  return s;
}

export function color(ctx: Ctx, v: unknown, path: string, fallback: string): string {
  const s = typeof v === "string" ? v.trim().toLowerCase() : "";
  if (/^#[0-9a-f]{6}$/.test(s)) return s;
  ctx.fail(path, "Use a hex colour like #d98a5c.");
  return fallback;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (s: unknown): s is string => typeof s === "string" && UUID.test(s);

/** "" (none), "media:<uuid>" or a safe path to a file in public/. */
export function imageRef(ctx: Ctx, v: unknown, path: string): string {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return "";
  if (s.startsWith("media:") && isUuid(s.slice(6))) return s;
  if (/^\/[A-Za-z0-9_\-./]+\.(png|jpe?g|webp|avif|gif|svg)$/i.test(s) && !s.includes("..")) return s;
  ctx.fail(path, "Pick an image from the media library.");
  return "";
}

export function list<T>(
  ctx: Ctx,
  v: unknown,
  path: string,
  max: number,
  each: (item: unknown, itemPath: string, index: number) => T,
  label = "This list",
): T[] {
  const arr = Array.isArray(v) ? v : [];
  if (arr.length > max) ctx.fail(path, `${label} can have at most ${max} items.`);
  return arr.slice(0, max).map((item, i) => each(item, `${path}.${i}`, i));
}

/** A list of short strings with empty entries dropped. */
export function strings(ctx: Ctx, v: unknown, path: string, opts: { max?: number; itemMax?: number; label?: string } = {}): string[] {
  const { max = 30, itemMax = 120, label = "Item" } = opts;
  return list(ctx, v, path, max, (item, p) => text(ctx, item, p, { max: itemMax, label })).filter(Boolean);
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
