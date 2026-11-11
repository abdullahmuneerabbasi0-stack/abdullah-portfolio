"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Inbox as InboxIcon, Mail, MailOpen, Reply, Search, Trash2 } from "lucide-react";
import type { Submission } from "@/lib/server/inbox";
import { deleteMessages, markMessages } from "@/lib/actions/admin/inbox";
import { Badge, Button, EmptyState, cx } from "./ui";
import { useConfirm } from "./feedback";
import { useAction } from "./form";
import { fmtDate, timeAgo } from "./time";

type Props = {
  list: { items: Submission[]; total: number; page: number; perPage: number };
  q: string;
  filter: "all" | "unread" | "read";
  opened: Submission | null;
  formEnabled: boolean;
};

export function Inbox({ list, q, filter, opened, formEnabled }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const confirm = useConfirm();
  const { run, pending } = useAction();
  const [items, setItems] = useState(list.items);
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState<Submission | null>(opened);
  const [search, setSearch] = useState(q);

  const [lastItems, setLastItems] = useState(list.items);
  if (list.items !== lastItems) {
    setLastItems(list.items);
    setItems(list.items);
  }

  const url = (p: Record<string, string | number | undefined>) => {
    const s = new URLSearchParams();
    const merged = { q, filter, page: 1, ...p };
    if (merged.q) s.set("q", String(merged.q));
    if (merged.filter && merged.filter !== "all") s.set("filter", String(merged.filter));
    if (Number(merged.page) > 1) s.set("page", String(merged.page));
    return `${pathname}${s.size ? `?${s}` : ""}`;
  };

  // Opening a message marks it as read.
  useEffect(() => {
    if (!open || open.isRead) return;
    void markMessages([open.id], true).then((r) => {
      if (r.ok) {
        setItems((cur) => cur.map((m) => (m.id === open.id ? { ...m, isRead: true } : m)));
        setOpen((o) => (o ? { ...o, isRead: true } : o));
        router.refresh();
      }
    });
  }, [open, router]);

  const mark = async (ids: string[], read: boolean) => {
    const res = await run("mark", () => markMessages(ids, read));
    if (res?.ok) {
      setItems((cur) => cur.map((m) => (ids.includes(m.id) ? { ...m, isRead: read } : m)));
      if (open && ids.includes(open.id)) setOpen({ ...open, isRead: read });
      setSelected([]);
      router.refresh();
    }
  };
  const remove = async (ids: string[]) => {
    const ok = await confirm({
      title: ids.length === 1 ? "Delete this message?" : `Delete ${ids.length} messages?`,
      body: "Deleted messages can't be recovered.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    const res = await run("delete", () => deleteMessages(ids));
    if (res?.ok) {
      setItems((cur) => cur.filter((m) => !ids.includes(m.id)));
      if (open && ids.includes(open.id)) setOpen(null);
      setSelected([]);
      router.refresh();
    }
  };

  const pages = Math.max(1, Math.ceil(list.total / list.perPage));
  const allSelected = items.length > 0 && selected.length === items.length;

  return (
    <div>
      {!formEnabled && (
        <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-muted">
          The contact form is currently switched off, so no new messages can arrive.{" "}
          <Link href="/admin/contact" className="text-accent-2 underline-offset-2 hover:underline">
            Turn it on in Contact details
          </Link>
          .
        </div>
      )}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <form
          className="relative min-w-[12rem] flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(url({ q: search.trim() }));
          }}
        >
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email or message, then press Enter"
            aria-label="Search messages"
            className="h-10 w-full rounded-xl border border-white/10 bg-black/30 pr-3 pl-9 text-sm placeholder:text-muted/50 focus:border-accent/60 focus:outline-none"
          />
        </form>
        <div className="flex rounded-xl border border-white/10 bg-black/30 p-1 text-xs">
          {(["all", "unread", "read"] as const).map((f) => (
            <Link key={f} href={url({ filter: f })} className={cx("rounded-lg px-3 py-1.5 capitalize", filter === f ? "bg-white/10 text-text" : "text-muted hover:text-text")}>
              {f}
            </Link>
          ))}
        </div>
      </div>

      <div className={cx("grid gap-4", open && "lg:grid-cols-[minmax(0,22rem)_1fr]")}>
        <div className={cx(open && "hidden lg:block")}>
          {items.length > 0 && (
            <div className="mb-2 flex flex-wrap items-center gap-2 px-1 text-xs">
              <label className="flex items-center gap-2 text-muted">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => setSelected(allSelected ? [] : items.map((m) => m.id))}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                Select all
              </label>
              {selected.length > 0 && (
                <>
                  <span className="text-muted">· {selected.length} selected</span>
                  <Button size="sm" variant="ghost" onClick={() => mark(selected, true)} loading={pending === "mark"}>
                    Mark read
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => mark(selected, false)}>
                    Mark unread
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => remove(selected)} loading={pending === "delete"}>
                    Delete
                  </Button>
                </>
              )}
            </div>
          )}
          {items.length === 0 ? (
            <EmptyState
              icon={<InboxIcon className="h-5 w-5" />}
              title={q || filter !== "all" ? "No matching messages" : "No messages yet"}
              description={q || filter !== "all" ? "Try a different search or filter." : "When someone uses the contact form on your site, their message appears here."}
            />
          ) : (
            <ul className="overflow-hidden rounded-2xl border border-white/[0.07]">
              {items.map((m) => (
                <li key={m.id} className={cx("flex items-start gap-3 border-b border-white/[0.06] px-3 py-3 last:border-0", open?.id === m.id ? "bg-white/[0.06]" : "bg-surface/60 hover:bg-white/[0.03]")}>
                  <input
                    type="checkbox"
                    aria-label={`Select message from ${m.name}`}
                    checked={selected.includes(m.id)}
                    onChange={() => setSelected((s) => (s.includes(m.id) ? s.filter((x) => x !== m.id) : [...s, m.id]))}
                    className="mt-1 h-4 w-4 accent-[var(--accent)]"
                  />
                  <button type="button" onClick={() => setOpen(m)} className="min-w-0 flex-1 text-left">
                    <span className="flex items-center gap-2">
                      {!m.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="Unread" />}
                      <span className={cx("truncate text-sm", !m.isRead && "font-semibold")}>{m.name}</span>
                      <span className="ml-auto shrink-0 text-[0.7rem] text-muted" suppressHydrationWarning>
                        {timeAgo(m.createdAt)}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-text/80">{m.subject || "(no subject)"}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted">{m.message}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {pages > 1 && (
            <div className="mt-3 flex items-center justify-between text-xs text-muted">
              {list.page > 1 ? <Link href={url({ page: list.page - 1 })}>← Newer</Link> : <span />}
              <span>
                Page {list.page} of {pages}
              </span>
              {list.page < pages ? <Link href={url({ page: list.page + 1 })}>Older →</Link> : <span />}
            </div>
          )}
        </div>

        {open && (
          <article className="rounded-2xl border border-white/[0.07] bg-surface/70 p-6">
            <button type="button" onClick={() => setOpen(null)} className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-text lg:hidden">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to list
            </button>
            <header className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.06] pb-4">
              <div className="min-w-0">
                <h2 className="font-display text-3xl leading-tight break-words">{open.subject || "(no subject)"}</h2>
                <p className="mt-1 text-sm">
                  {open.name}{" "}
                  <a href={`mailto:${open.email}`} className="text-muted break-all hover:text-accent-2">
                    &lt;{open.email}&gt;
                  </a>
                </p>
                <p className="mt-1 text-xs text-muted">{fmtDate(open.createdAt)}</p>
              </div>
              {open.isRead ? <Badge>Read</Badge> : <Badge tone="accent">Unread</Badge>}
            </header>
            <p className="mt-5 text-[0.95rem] leading-relaxed whitespace-pre-wrap text-text/90 [overflow-wrap:anywhere]">{open.message}</p>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
              <a
                href={`mailto:${open.email}?subject=${encodeURIComponent(`Re: ${open.subject || "your message"}`)}`}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-medium text-ink hover:bg-accent-2"
              >
                <Reply className="h-4 w-4" /> Reply by email
              </a>
              <Button icon={open.isRead ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />} onClick={() => mark([open.id], !open.isRead)}>
                Mark as {open.isRead ? "unread" : "read"}
              </Button>
              <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={() => remove([open.id])}>
                Delete
              </Button>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
