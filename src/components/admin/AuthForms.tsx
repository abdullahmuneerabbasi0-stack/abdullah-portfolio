"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { login, setupAdmin, type FormState } from "@/lib/actions/auth";

const input =
  "h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 text-sm text-text placeholder:text-muted/50 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20 aria-[invalid=true]:border-red-400/60";

function Input({ name, label, type = "text", error, autoComplete, hint }: { name: string; label: string; type?: string; error?: string; autoComplete?: string; hint?: string }) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <label className="block space-y-1.5">
      <span className="text-[0.8rem] font-medium text-text/90">{label}</span>
      <span className="relative block">
        <input
          name={name}
          type={isPw && show ? "text" : type}
          autoComplete={autoComplete}
          required
          aria-invalid={!!error}
          className={input + (isPw ? " pr-10" : "")}
        />
        {isPw && (
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1.5 text-muted hover:text-text">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </span>
      {error ? <span className="block text-xs text-red-300">{error}</span> : hint ? <span className="block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-ink transition-colors hover:bg-accent-2 disabled:opacity-60"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

function Header({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-8 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-accent-2">
        <Lock className="h-5 w-5" aria-hidden="true" />
      </span>
      <h1 className="mt-5 font-display text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-muted">{text}</p>
    </div>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <>
      <Header title="Welcome back" text="Sign in to manage your website." />
      <form action={action} className="space-y-4 rounded-2xl border border-white/10 bg-surface/80 p-6 shadow-2xl backdrop-blur">
        {next && <input type="hidden" name="next" value={next} />}
        <Input name="email" label="Email" type="email" autoComplete="username" />
        <Input name="password" label="Password" type="password" autoComplete="current-password" />
        {state.error && (
          <p role="alert" className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {state.error}
          </p>
        )}
        <Submit pending={pending}>Sign in</Submit>
      </form>
    </>
  );
}

export function SetupForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(setupAdmin, {});
  const e = state.errors ?? {};
  return (
    <>
      <Header title="Create your admin account" text="One-time setup. Your current website content will be copied into the database." />
      <form action={action} className="space-y-4 rounded-2xl border border-white/10 bg-surface/80 p-6 shadow-2xl backdrop-blur">
        <Input name="token" label="Setup token" type="password" autoComplete="off" error={e.token} hint="The ADMIN_SETUP_TOKEN value from your Vercel settings." />
        <Input name="name" label="Your name" autoComplete="name" error={e.name} />
        <Input name="email" label="Email" type="email" autoComplete="username" error={e.email} />
        <Input name="password" label="Password" type="password" autoComplete="new-password" error={e.password} hint="At least 12 characters, with letters and a number." />
        <Input name="confirm" label="Confirm password" type="password" autoComplete="new-password" error={e.confirm} />
        {state.error && (
          <p role="alert" className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {state.error}
          </p>
        )}
        <Submit pending={pending}>Create account</Submit>
      </form>
    </>
  );
}
