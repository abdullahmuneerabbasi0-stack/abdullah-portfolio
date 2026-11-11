"use server";

import { Ctx, email, text } from "@/lib/validate";
import { isDbConfigured } from "@/lib/server/db";
import { clientIpHash } from "@/lib/server/auth";
import { createSubmission, submissionAllowed } from "@/lib/server/inbox";
import { getSettings } from "@/lib/server/repo";

export type ContactState = { status: "idle" | "success" | "error"; message?: string; errors?: Record<string, string> };

/** Public contact form. Validated, rate-limited and protected by a honeypot field. */
export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  if (!isDbConfigured()) return { status: "error", message: "The contact form isn't available right now. Please email me instead." };

  // Bots tend to fill every field, including this hidden one; pretend it worked.
  if (String(form.get("website") ?? "").trim()) return { status: "success" };
  const started = Number(form.get("started") ?? 0);
  if (started && Date.now() - started < 2500) return { status: "success" };

  const settings = (await getSettings("contact")).published;
  if (!settings?.form.enabled) return { status: "error", message: "The contact form is switched off." };

  const c = new Ctx();
  const value = {
    name: text(c, form.get("name"), "name", { max: 100, required: true, label: "Your name" }),
    email: email(c, form.get("email"), "email", { required: true }),
    subject: text(c, form.get("subject"), "subject", { max: 150, label: "Subject" }),
    message: text(c, form.get("message"), "message", { max: 5000, required: true, label: "Message", multiline: true }),
  };
  if (value.message && value.message.length < 10) c.fail("message", "Please write a little more (at least 10 characters).");
  if (!c.ok) return { status: "error", message: "Please check the highlighted fields.", errors: c.errors };

  const ipHash = await clientIpHash();
  if (!(await submissionAllowed(ipHash)))
    return { status: "error", message: "Too many messages from your connection. Please try again in an hour or email me directly." };

  await createSubmission({ ...value, ipHash });
  return { status: "success", message: settings.form.successMessage };
}
