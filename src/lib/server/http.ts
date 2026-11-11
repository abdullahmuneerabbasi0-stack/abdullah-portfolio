import "server-only";
import { NextResponse } from "next/server";

/** Rejects cross-site POSTs to admin API routes (defence in depth on top of SameSite cookies). */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export const jsonError = (message: string, status: number) => NextResponse.json({ error: message }, { status });
