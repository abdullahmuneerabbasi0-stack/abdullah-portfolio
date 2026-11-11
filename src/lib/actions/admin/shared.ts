import "server-only";
import { revalidatePath, updateTag } from "next/cache";
import { AuthError, requireAdmin, type Admin } from "@/lib/server/auth";
import { isDbConfigured } from "@/lib/server/db";
import { SITE_TAG } from "@/lib/server/site-data";
import type { Errors } from "@/lib/validate";

export type ActionResult<T = object> =
  | ({ ok: true; message?: string } & T)
  | { ok: false; message: string; errors?: Errors; signedOut?: boolean };

export class UserError extends Error {
  constructor(
    message: string,
    public errors?: Errors,
  ) {
    super(message);
  }
}

/**
 * Wraps every admin server action: checks the session on the server, turns
 * validation problems into friendly messages and never leaks internal errors.
 */
export async function adminAction<T extends object>(fn: (admin: Admin) => Promise<T & { message?: string }>): Promise<ActionResult<T>> {
  try {
    if (!isDbConfigured()) return { ok: false, message: "The database isn't connected yet." };
    const admin = await requireAdmin();
    const out = await fn(admin);
    return { ok: true, ...out };
  } catch (e) {
    if (e instanceof AuthError) return { ok: false, message: e.message, signedOut: true };
    if (e instanceof UserError) return { ok: false, message: e.message, errors: e.errors };
    console.error("[admin action]", e);
    return { ok: false, message: "Something went wrong while saving. Please try again." };
  }
}

/** Makes the public site show the latest published content on the very next request. */
export function refreshPublicSite() {
  updateTag(SITE_TAG);
  revalidatePath("/", "layout");
}
