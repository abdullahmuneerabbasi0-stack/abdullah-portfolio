import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/lib/server/auth";
import { recentActivity } from "@/lib/server/repo";
import { Card, PageHeader } from "@/components/admin/ui";
import { cx } from "@/components/admin/cx";
import { ActivityList } from "@/components/admin/ActivityList";

export const metadata: Metadata = { title: "Activity" };

const FILTERS = [
  ["", "Everything"],
  ["projects", "Projects"],
  ["services", "Services"],
  ["skills", "Skills"],
  ["testimonials", "Testimonials"],
  ["hero", "Hero"],
  ["about", "About"],
  ["contact", "Contact"],
  ["appearance", "Appearance"],
  ["layout", "Navigation"],
  ["media", "Media"],
  ["messages", "Messages"],
  ["account", "Account"],
] as const;

const PER_PAGE = 30;

export default async function Page({ searchParams }: PageProps<"/admin/activity">) {
  await requireAdminPage();
  const sp = await searchParams;
  const entity = FILTERS.some(([k]) => k === sp.entity) ? String(sp.entity) : "";
  const page = Math.max(1, Math.min(1000, Number(sp.page) || 1));
  const items = await recentActivity(PER_PAGE + 1, (page - 1) * PER_PAGE, entity || undefined);
  const hasMore = items.length > PER_PAGE;
  const q = (p: number) => `/admin/activity?${new URLSearchParams({ ...(entity ? { entity } : {}), page: String(p) })}`;
  return (
    <>
      <PageHeader title="Activity" description="A permanent record of every change made in the admin panel: what changed, when, and by whom." />
      <div className="mb-5 flex flex-wrap gap-1.5">
        {FILTERS.map(([k, label]) => (
          <Link
            key={k}
            href={k ? `/admin/activity?entity=${k}` : "/admin/activity"}
            className={cx("rounded-full border px-3 py-1 text-xs transition-colors", entity === k ? "border-accent/60 bg-accent/15 text-text" : "border-white/10 text-muted hover:text-text")}
          >
            {label}
          </Link>
        ))}
      </div>
      <Card>
        <ActivityList items={items.slice(0, PER_PAGE)} empty="Nothing recorded here yet." />
        {(page > 1 || hasMore) && (
          <div className="mt-6 flex justify-between border-t border-white/[0.06] pt-4 text-sm">
            {page > 1 ? <Link href={q(page - 1)} className="text-muted hover:text-text">← Newer</Link> : <span />}
            {hasMore && <Link href={q(page + 1)} className="text-muted hover:text-text">Older →</Link>}
          </div>
        )}
      </Card>
    </>
  );
}
