import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Brush, CheckCircle2, CircleDashed, FolderKanban, ImagePlus, Inbox, Plus, UserRound } from "lucide-react";
import { requireAdminPage } from "@/lib/server/auth";
import { allSettingsStatus, getSettings, recentActivity } from "@/lib/server/repo";
import { dashboardStats } from "@/lib/server/stats";
import { listSubmissions } from "@/lib/server/inbox";
import { siteUrl } from "@/content/site";
import { Badge, Card, PageHeader } from "@/components/admin/ui";
import { DailyBars, Breakdown } from "@/components/admin/charts";
import { ActivityList } from "@/components/admin/ActivityList";
import { PublishAll } from "@/components/admin/PublishAll";
import { timeAgo } from "@/components/admin/time";

export const metadata: Metadata = { title: "Overview" };

const LABELS: Record<string, string> = { hero: "Hero & profile", about: "About", contact: "Contact", layout: "Navigation & sections", appearance: "Appearance" };
const HREFS: Record<string, string> = { hero: "/admin/hero", about: "/admin/about", contact: "/admin/contact", layout: "/admin/navigation", appearance: "/admin/appearance" };

function Stat({ label, value, detail, href }: { label: string; value: number | string; detail?: string; href: string }) {
  return (
    <Link href={href} className="group rounded-2xl border border-white/[0.07] bg-surface/70 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15">
      <p className="flex items-center justify-between text-xs text-muted">
        {label}
        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
      </p>
      <p className="mt-3 font-display text-5xl leading-none">{value}</p>
      {detail && <p className="mt-2 text-xs text-muted">{detail}</p>}
    </Link>
  );
}

export default async function Overview({ searchParams }: PageProps<"/admin">) {
  const admin = await requireAdminPage();
  const [{ counts, statusRows, messagesByDay, updatesByDay }, status, activity, hero, contact, latest] = await Promise.all([
    dashboardStats(),
    allSettingsStatus(),
    recentActivity(8),
    getSettings("hero"),
    getSettings("contact"),
    listSubmissions({ perPage: 4 }),
  ]);
  const { welcome } = await searchParams;
  const pending = status.filter((s) => s.hasUnpublished);
  const lastPublished = status.map((s) => s.publishedAt).filter(Boolean).sort().at(-1) ?? null;
  const drafts = counts.projects - counts.projects_published;
  const formOn = !!contact.published?.form.enabled;

  return (
    <>
      <PageHeader
        eyebrow={new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
        title={`Welcome${admin.name ? `, ${admin.name.split(" ")[0]}` : ""}`}
        description={`Everything on ${hero.draft.name}'s website, in one place.`}
        actions={<PublishAll count={pending.length} labels={pending.map((p) => LABELS[p.key])} />}
      />

      {welcome && (
        <div className="mb-6 rounded-2xl border border-accent/30 bg-accent/10 p-5 text-sm leading-relaxed">
          <p className="font-medium text-accent-3">Your admin panel is ready.</p>
          <p className="mt-1 text-text/80">
            Your existing website content has been imported. Nothing on the live site has changed. Try editing your hero text, then use Preview before publishing.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total projects" value={counts.projects} detail={`${counts.projects_published} published · ${drafts} draft${drafts === 1 ? "" : "s"}`} href="/admin/projects" />
        <Stat label="Published projects" value={counts.projects_published} detail={drafts ? `${drafts} still in draft` : "No drafts"} href="/admin/projects" />
        <Stat label="Services" value={counts.services} detail={`${counts.services_published} visible on the site`} href="/admin/services" />
        <Stat label="Messages" value={counts.messages} detail={counts.unread ? `${counts.unread} unread` : "All read"} href="/admin/messages" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="Website status" className="lg:col-span-1">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between gap-3">
              <span className="text-muted">Site</span>
              <a href={siteUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1 truncate text-text/90 hover:text-accent-2">
                Online <ArrowUpRight className="h-3 w-3" />
              </a>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-muted">Database</span>
              <Badge tone="success">Connected</Badge>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-muted">Last published</span>
              <span className="text-text/90">{lastPublished ? timeAgo(lastPublished) : "Never"}</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-muted">Contact form</span>
              {formOn ? <Badge tone="success">On</Badge> : <Badge>Off</Badge>}
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-muted">Media library</span>
              <span className="text-text/90">
                {counts.media} image{counts.media === 1 ? "" : "s"} · {(counts.media_bytes / 1024 / 1024).toFixed(1)} MB
              </span>
            </li>
          </ul>
          <div className="mt-5 border-t border-white/[0.06] pt-4">
            <p className="mb-2 text-xs text-muted">Sections</p>
            <ul className="space-y-1.5">
              {status.map((s) => (
                <li key={s.key}>
                  <Link href={HREFS[s.key]} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 text-sm hover:bg-white/[0.04]">
                    <span className="flex items-center gap-2">
                      {s.hasUnpublished ? <CircleDashed className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" /> : <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />}
                      {LABELS[s.key]}
                    </span>
                    <span className="text-[0.7rem] text-muted">{s.hasUnpublished ? "Unpublished changes" : "Live"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card title="Activity" description="Real counts from your database." className="lg:col-span-2">
          <div className="grid gap-8">
            <DailyBars data={messagesByDay} label="Contact form messages per day" unit={["message", "messages"]} />
            <DailyBars data={updatesByDay} label="Content changes per day" unit={["change", "changes"]} />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="Quick actions">
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: "/admin/projects/new", label: "New project", icon: Plus },
              { href: "/admin/hero", label: "Edit hero", icon: UserRound },
              { href: "/admin/media", label: "Upload images", icon: ImagePlus },
              { href: "/admin/appearance", label: "Change design", icon: Brush },
              { href: "/admin/messages", label: "Read messages", icon: Inbox },
              { href: "/admin/projects", label: "Reorder projects", icon: FolderKanban },
            ].map(({ href, label, icon: Icon }) => (
              <Link key={href + label} href={href} className="group flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-black/20 p-3.5 text-sm transition-colors hover:border-accent/40 hover:bg-accent/[0.06]">
                <Icon className="h-4 w-4 text-accent-2" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </div>
        </Card>

        <Card title="Projects by status">
          <Breakdown rows={statusRows.map((r) => ({ label: r.status, value: r.n }))} />
          <div className="mt-6 border-t border-white/[0.06] pt-4">
            <p className="mb-3 text-xs text-muted">Latest messages</p>
            {latest.items.length === 0 ? (
              <p className="text-sm text-muted">No messages yet.</p>
            ) : (
              <ul className="space-y-2">
                {latest.items.map((m) => (
                  <li key={m.id}>
                    <Link href={`/admin/messages?open=${m.id}`} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-white/[0.04]">
                      {!m.isRead && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-label="Unread" />}
                      <span className="truncate">{m.name}</span>
                      <span className="ml-auto shrink-0 text-[0.7rem] text-muted">{timeAgo(m.createdAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card
          title="Recent changes"
          actions={
            <Link href="/admin/activity" className="text-xs text-muted hover:text-text">
              View all
            </Link>
          }
        >
          <ActivityList items={activity} />
        </Card>
      </div>
    </>
  );
}
