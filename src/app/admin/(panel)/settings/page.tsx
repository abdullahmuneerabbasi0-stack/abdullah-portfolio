import type { Metadata } from "next";
import { currentTokenHash, requireAdminPage } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { PageHeader } from "@/components/admin/ui";
import { AccountSettings } from "@/components/admin/AccountSettings";

export const metadata: Metadata = { title: "Account & security" };

export default async function Page() {
  const admin = await requireAdminPage();
  const current = await currentTokenHash();
  const sessions = await db()<{ token_hash: string; created_at: Date; last_seen_at: Date; user_agent: string }[]>`
    select token_hash, created_at, last_seen_at, user_agent from admin_sessions
    where user_id = ${admin.id} and expires_at > now() order by last_seen_at desc
  `;
  return (
    <>
      <PageHeader title="Account & security" description="Your login details and the devices that are signed in." />
      <AccountSettings
        admin={{ name: admin.name, email: admin.email }}
        sessions={sessions.map((s) => ({
          current: s.token_hash === current,
          createdAt: s.created_at.toISOString(),
          lastSeenAt: s.last_seen_at.toISOString(),
          device: describeAgent(s.user_agent),
        }))}
      />
    </>
  );
}

function describeAgent(ua: string) {
  const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
  const os = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS X/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Unknown device";
  return `${browser} on ${os}`;
}
