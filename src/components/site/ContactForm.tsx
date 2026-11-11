"use client";

import { useActionState, useState } from "react";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { submitContact, type ContactState } from "@/lib/actions/contact";

const field =
  "w-full border-b border-line bg-transparent py-3 text-lg text-text placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none";

export function ContactForm({ title, intro, successMessage }: { title: string; intro: string; successMessage: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });
  const [started] = useState(() => Date.now());
  const err = (k: string) => state.errors?.[k];

  if (state.status === "success")
    return (
      <div role="status" className="flex items-start gap-4 rounded-3xl border border-line bg-surface/60 p-8">
        <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-accent-2" aria-hidden="true" />
        <div>
          <p className="font-display text-3xl">Message sent</p>
          <p className="mt-2 text-muted">{state.message || successMessage}</p>
        </div>
      </div>
    );

  return (
    <form action={action} className="rounded-3xl border border-line bg-surface/40 p-6 sm:p-10" noValidate>
      <h3 className="font-display text-3xl sm:text-4xl">{title}</h3>
      {intro && <p className="mt-2 max-w-xl text-muted">{intro}</p>}
      <input type="hidden" name="started" value={started} />
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {(
          [
            ["name", "Your name", "text", "name"],
            ["email", "Email address", "email", "email"],
          ] as const
        ).map(([name, label, type, auto]) => (
          <label key={name} className="block">
            <span className="text-[0.68rem] uppercase tracking-[0.22em] text-muted">{label}</span>
            <input
              name={name}
              type={type}
              autoComplete={auto}
              required
              maxLength={name === "email" ? 254 : 100}
              aria-invalid={!!err(name)}
              aria-describedby={err(name) ? `${name}-error` : undefined}
              className={field}
            />
            {err(name) && (
              <span id={`${name}-error`} className="mt-1 block text-sm text-red-400">
                {err(name)}
              </span>
            )}
          </label>
        ))}
        <label className="block sm:col-span-2">
          <span className="text-[0.68rem] uppercase tracking-[0.22em] text-muted">Subject (optional)</span>
          <input name="subject" maxLength={150} className={field} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-[0.68rem] uppercase tracking-[0.22em] text-muted">Message</span>
          <textarea
            name="message"
            required
            rows={5}
            maxLength={5000}
            aria-invalid={!!err("message")}
            aria-describedby={err("message") ? "message-error" : undefined}
            className={`${field} resize-y`}
          />
          {err("message") && (
            <span id="message-error" className="mt-1 block text-sm text-red-400">
              {err("message")}
            </span>
          )}
        </label>
      </div>
      {state.status === "error" && state.message && (
        <p role="alert" className="mt-6 text-sm text-red-400">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="group mt-8 inline-flex items-center gap-2.5 rounded-[var(--btn-radius)] bg-accent px-6 py-3.5 text-[0.8rem] font-medium uppercase tracking-[0.14em] text-ink transition-opacity disabled:opacity-60"
      >
        {pending ? "Sending" : "Send message"}
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        )}
      </button>
    </form>
  );
}
