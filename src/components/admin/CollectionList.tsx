"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical, Pencil, Search, Trash2 } from "lucide-react";
import type { CollectionKey } from "@/lib/content/types";
import { deleteItem, reorderItems, setItemPublished } from "@/lib/actions/admin/content";
import { Badge, cx } from "./ui";
import { IconBtn } from "./fields";
import { useConfirm } from "./feedback";
import { useAction } from "./form";
import { timeAgo } from "./time";

export type ListRow = {
  id: string;
  title: string;
  subtitle?: string;
  published: boolean;
  updatedAt: string;
  thumb?: ReactNode;
  badges?: ReactNode;
};

/**
 * Sortable list for a collection. Drag rows (or use the arrow buttons) to
 * reorder, toggle visibility, edit or delete. Every change is saved at once.
 */
export function CollectionList({
  collection,
  rows: initialRows,
  noun,
  onEdit,
  empty,
  publishedLabel = "Published",
  draftLabel = "Draft",
}: {
  collection: CollectionKey;
  rows: ListRow[];
  noun: string;
  onEdit: (id: string) => void;
  empty: ReactNode;
  publishedLabel?: string;
  draftLabel?: string;
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const { run, pending } = useAction();
  const [rows, setRows] = useState(initialRows);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [dragId, setDragId] = useState<string | null>(null);

  // Take fresh rows from the server whenever they actually change.
  const signature = initialRows.map((r) => `${r.id}:${r.published}:${r.updatedAt}:${r.title}`).join("|");
  const [lastSignature, setLastSignature] = useState(signature);
  if (signature !== lastSignature) {
    setLastSignature(signature);
    setRows(initialRows);
  }

  const saveOrder = async (next: ListRow[]) => {
    const prev = rows;
    setRows(next);
    const res = await run("order", () => reorderItems(collection, next.map((r) => r.id)), { quiet: true });
    if (!res?.ok) setRows(prev);
  };
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    void saveOrder(next);
  };
  const toggle = async (r: ListRow) => {
    setRows((cur) => cur.map((x) => (x.id === r.id ? { ...x, published: !r.published } : x)));
    const res = await run(`pub-${r.id}`, () => setItemPublished(collection, r.id, !r.published));
    if (!res?.ok) setRows((cur) => cur.map((x) => (x.id === r.id ? { ...x, published: r.published } : x)));
    else router.refresh();
  };
  const remove = async (r: ListRow) => {
    const ok = await confirm({
      title: `Delete ${noun} "${r.title}"?`,
      body: `This permanently removes it from your website and can't be undone. To hide it instead, set it to ${draftLabel.toLowerCase()}.`,
      confirmLabel: `Delete ${noun}`,
      danger: true,
    });
    if (!ok) return;
    const res = await run(`del-${r.id}`, () => deleteItem(collection, r.id));
    if (res?.ok) {
      setRows((cur) => cur.filter((x) => x.id !== r.id));
      router.refresh();
    }
  };

  const filtered = rows.filter(
    (r) => (filter === "all" || (filter === "published") === r.published) && (!q || `${r.title} ${r.subtitle ?? ""}`.toLowerCase().includes(q.toLowerCase())),
  );
  const canReorder = !q && filter === "all";

  if (rows.length === 0) return <>{empty}</>;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[12rem] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${noun}s`}
            aria-label={`Search ${noun}s`}
            className="h-10 w-full rounded-xl border border-white/10 bg-black/30 pr-3 pl-9 text-sm placeholder:text-muted/50 focus:border-accent/60 focus:outline-none"
          />
        </div>
        <div className="flex rounded-xl border border-white/10 bg-black/30 p-1 text-xs" role="tablist" aria-label="Filter">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cx("rounded-lg px-3 py-1.5 capitalize transition-colors", filter === f ? "bg-white/10 text-text" : "text-muted hover:text-text")}
            >
              {f === "all" ? `All (${rows.length})` : f === "published" ? publishedLabel : draftLabel}
            </button>
          ))}
        </div>
      </div>
      {!canReorder && <p className="mb-3 text-xs text-muted">Clear the search and filter to reorder.</p>}
      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-muted">No {noun}s match.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((r) => {
            const i = rows.indexOf(r);
            return (
              <li
                key={r.id}
                draggable={canReorder}
                onDragStart={(e) => {
                  setDragId(r.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(e) => {
                  if (!dragId || dragId === r.id) return;
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!dragId || dragId === r.id) return;
                  const from = rows.findIndex((x) => x.id === dragId);
                  const next = [...rows];
                  const [moved] = next.splice(from, 1);
                  next.splice(i, 0, moved);
                  setDragId(null);
                  void saveOrder(next);
                }}
                onDragEnd={() => setDragId(null)}
                className={cx(
                  "group flex items-center gap-3 rounded-xl border bg-surface/70 p-3 transition-all sm:gap-4",
                  dragId === r.id ? "border-accent/50 opacity-50" : "border-white/[0.07] hover:border-white/15",
                )}
              >
                {canReorder && <GripVertical className="hidden h-4 w-4 shrink-0 cursor-grab text-muted/60 sm:block" aria-hidden="true" />}
                {r.thumb}
                <button type="button" onClick={() => onEdit(r.id)} className="min-w-0 flex-1 text-left">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-medium">{r.title}</span>
                    {r.published ? <Badge tone="success">{publishedLabel}</Badge> : <Badge tone="warning">{draftLabel}</Badge>}
                    {r.badges}
                  </span>
                  {r.subtitle && <span className="mt-0.5 block truncate text-xs text-muted">{r.subtitle}</span>}
                  <span className="mt-0.5 block text-[0.7rem] text-muted/70" suppressHydrationWarning>
                    Updated {timeAgo(r.updatedAt)}
                  </span>
                </button>
                <div className="flex shrink-0 items-center gap-0.5">
                  {canReorder && (
                    <>
                      <IconBtn label="Move up" onClick={() => move(i, -1)} disabled={i === 0 || pending === "order"}>
                        <ArrowUp className="h-3.5 w-3.5" />
                      </IconBtn>
                      <IconBtn label="Move down" onClick={() => move(i, 1)} disabled={i === rows.length - 1 || pending === "order"}>
                        <ArrowDown className="h-3.5 w-3.5" />
                      </IconBtn>
                    </>
                  )}
                  <IconBtn label={r.published ? `Hide (set to ${draftLabel.toLowerCase()})` : "Publish"} onClick={() => toggle(r)} disabled={pending === `pub-${r.id}`}>
                    {r.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </IconBtn>
                  <IconBtn label="Edit" onClick={() => onEdit(r.id)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </IconBtn>
                  <IconBtn label="Delete" onClick={() => remove(r)} danger disabled={pending === `del-${r.id}`}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </IconBtn>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

