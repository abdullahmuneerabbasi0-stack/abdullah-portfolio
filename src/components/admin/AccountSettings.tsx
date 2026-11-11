"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Monitor, ShieldCheck } from "lucide-react";
import { changePassword, signOutOtherSessions, updateAccount } from "@/lib/actions/auth";
import { Badge, Button, Card, TextField } from "./ui";
import { useConfirm } from "./feedback";
import { useAction } from "./form";
import { timeAgo } from "./time";

type Session = { current: boolean; createdAt: string; lastSeenAt: string; device: string };

export function AccountSettings({ admin, sessions }: { admin: { name: string; email: string }; sessions: Session[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const { run, pending } = useAction();
  const [acct, setAcct] = useState(admin);
  const [acctErr, setAcctErr] = useState<Record<string, string>>({});
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwErr, setPwErr] = useState<Record<string, string>>({});

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Your details">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await run("acct", () => updateAccount(acct), { onErrors: setAcctErr });
            if (res?.ok) router.refresh();
          }}
        >
          <TextField label="Name" value={acct.name} onChange={(x) => setAcct({ ...acct, name: x })} error={acctErr.name} maxLength={80} autoComplete="name" />
          <TextField label="Login email" type="email" value={acct.email} onChange={(x) => setAcct({ ...acct, email: x })} error={acctErr.email} autoComplete="username" />
          <Button type="submit" variant="primary" loading={pending === "acct"} disabled={acct.name === admin.name && acct.email === admin.email}>
            Save details
          </Button>
        </form>
      </Card>

      <Card title="Change password" description="Changing your password signs out every other device.">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await run("pw", () => changePassword(pw), { onErrors: setPwErr });
            if (res?.ok) {
              setPw({ current: "", next: "", confirm: "" });
              setPwErr({});
              router.refresh();
            }
          }}
        >
          <TextField label="Current password" type="password" value={pw.current} onChange={(x) => setPw({ ...pw, current: x })} error={pwErr.current} autoComplete="current-password" />
          <TextField label="New password" type="password" hint="At least 12 characters, with letters and a number." value={pw.next} onChange={(x) => setPw({ ...pw, next: x })} error={pwErr.next} autoComplete="new-password" />
          <TextField label="Confirm new password" type="password" value={pw.confirm} onChange={(x) => setPw({ ...pw, confirm: x })} error={pwErr.confirm} autoComplete="new-password" />
          <Button type="submit" variant="primary" loading={pending === "pw"} disabled={!pw.current || !pw.next}>
            Change password
          </Button>
        </form>
      </Card>

      <Card
        title="Signed-in devices"
        description="Sessions end after 24 hours without activity, and always after 7 days."
        className="lg:col-span-2"
        actions={
          sessions.length > 1 && (
            <Button
              size="sm"
              variant="danger"
              icon={<LogOut className="h-3.5 w-3.5" />}
              loading={pending === "others"}
              onClick={async () => {
                if (!(await confirm({ title: "Sign out all other devices?", confirmLabel: "Sign them out", danger: true }))) return;
                const res = await run("others", () => signOutOtherSessions());
                if (res?.ok) router.refresh();
              }}
            >
              Sign out other devices
            </Button>
          )
        }
      >
        <ul className="divide-y divide-white/[0.06]">
          {sessions.map((s, i) => (
            <li key={i} className="flex items-center gap-3 py-3">
              <Monitor className="h-4 w-4 text-muted" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm">{s.device}</p>
                <p className="text-xs text-muted" suppressHydrationWarning>
                  Signed in {timeAgo(s.createdAt)} · last active {timeAgo(s.lastSeenAt)}
                </p>
              </div>
              {s.current && (
                <Badge tone="success">
                  <ShieldCheck className="h-3 w-3" /> This device
                </Badge>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
