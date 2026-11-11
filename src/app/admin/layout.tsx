import type { Metadata } from "next";
import { isDbConfigured } from "@/lib/server/db";

// Admin pages always run on request: they depend on the signed-in user.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  if (!isDbConfigured()) return <NotConfigured />;
  return children;
}

function NotConfigured() {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#0a0807] px-6 py-16">
      <div className="max-w-xl rounded-2xl border border-white/10 bg-surface/70 p-8">
        <p className="text-[0.7rem] font-medium tracking-[0.22em] text-accent-2 uppercase">Setup needed</p>
        <h1 className="mt-3 font-display text-4xl">Connect the database</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The admin panel stores your content in a Supabase Postgres database. Add these environment variables in your Vercel
          project settings, then redeploy:
        </p>
        <ul className="mt-5 space-y-3 text-sm">
          <li>
            <code className="rounded bg-black/40 px-1.5 py-0.5 text-accent-3">DATABASE_URL</code>
            <span className="text-muted">: the Supabase transaction pooler connection string.</span>
          </li>
          <li>
            <code className="rounded bg-black/40 px-1.5 py-0.5 text-accent-3">ADMIN_SETUP_TOKEN</code>
            <span className="text-muted">: a long random secret you&apos;ll type once to create your admin account.</span>
          </li>
        </ul>
        <p className="mt-5 text-sm text-muted">The full steps are in ADMIN.md in the repository. Until then, your public site keeps working exactly as before.</p>
      </div>
    </main>
  );
}
