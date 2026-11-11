"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, CornerDownLeft, LogOut, Menu, Search, X } from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { ADMIN_NAV } from "./nav";
import { FeedbackProvider, Modal } from "./feedback";
import { cx } from "./ui";

type Props = {
  children: ReactNode;
  admin: { name: string; email: string };
  siteName: string;
  initials: string;
  unread: number;
  pendingPublish: number;
};

export function AdminShell(props: Props) {
  return (
    <FeedbackProvider>
      <Shell {...props} />
    </FeedbackProvider>
  );
}

function Shell({ children, admin, siteName, initials, unread, pendingPublish }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/"));

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="group flex items-center gap-3 px-5 pt-6 pb-5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent font-display text-lg text-ink italic shadow-[0_8px_30px_-8px_rgb(var(--accent-rgb)/0.7)]">{initials}</span>
        <span className="min-w-0">
          <span className="block truncate font-display text-lg leading-tight">{siteName}</span>
          <span className="block text-[0.65rem] tracking-[0.22em] text-muted uppercase">Site manager</span>
        </span>
      </Link>
      <button
        type="button"
        onClick={() => setSearch(true)}
        className="mx-4 mb-4 flex h-9 items-center gap-2 rounded-xl border border-white/[0.08] bg-black/25 px-3 text-left text-xs text-muted transition-colors hover:border-white/20 hover:text-text"
      >
        <Search className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="flex-1">Search</span>
        <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-sans text-[0.6rem]">Ctrl K</kbd>
      </button>
      <nav aria-label="Admin" className="flex-1 space-y-5 overflow-y-auto px-3 pb-6">
        {ADMIN_NAV.map((g) => (
          <div key={g.title || "main"}>
            {g.title && <p className="mb-1.5 px-3 text-[0.62rem] font-medium tracking-[0.22em] text-muted/70 uppercase">{g.title}</p>}
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                const badge = item.href === "/admin/messages" ? unread : 0;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cx(
                        "relative flex items-center gap-3 rounded-xl px-3 py-2 text-[0.84rem] transition-colors duration-200",
                        active ? "bg-white/[0.07] text-text" : "text-muted hover:bg-white/[0.04] hover:text-text",
                      )}
                    >
                      {active && <motion.span layoutId="nav-active" className="absolute top-2 bottom-2 left-0 w-[3px] rounded-full bg-accent" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
                      <Icon className={cx("h-4 w-4 shrink-0", active ? "text-accent-2" : "")} aria-hidden="true" />
                      <span className="flex-1">{item.label}</span>
                      {badge > 0 && <span className="rounded-full bg-accent px-1.5 text-[0.65rem] font-semibold text-ink">{badge}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/[0.06] p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-semibold">
            {(admin.name || admin.email).slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{admin.name || "Administrator"}</p>
            <p className="truncate text-[0.7rem] text-muted">{admin.email}</p>
          </div>
          <form action={logout}>
            <button type="submit" aria-label="Sign out" title="Sign out" className="rounded-lg p-2 text-muted transition-colors hover:bg-white/10 hover:text-text">
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin min-h-dvh bg-[#0a0807] text-text">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-[radial-gradient(60rem_30rem_at_80%_-10%,rgb(var(--accent-rgb)/0.07),transparent)]" />
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.06] bg-[#0d0b0a]/90 backdrop-blur lg:block">{sidebar}</aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/60 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-white/[0.06] bg-[#0d0b0a] lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="absolute top-6 right-4 rounded-lg p-1.5 text-muted hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="relative lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/[0.06] bg-[#0a0807]/80 px-4 backdrop-blur-md sm:px-6">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg p-2 text-muted hover:bg-white/10 hover:text-text lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => setSearch(true)} aria-label="Search" className="rounded-lg p-2 text-muted hover:bg-white/10 hover:text-text lg:hidden">
            <Search className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          {pendingPublish > 0 && (
            <Link href="/admin" className="hidden items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs text-amber-200 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden="true" />
              {pendingPublish} unpublished change{pendingPublish === 1 ? "" : "s"}
            </Link>
          )}
          <a href="/admin/preview?path=/" target="_blank" rel="noopener" className="hidden h-9 items-center rounded-xl px-3 text-xs text-muted transition-colors hover:bg-white/[0.06] hover:text-text sm:inline-flex">
            Preview drafts
          </a>
          <a href="/" target="_blank" rel="noopener" className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-medium transition-colors hover:bg-white/[0.08]">
            View site <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </header>
        <motion.main key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </motion.main>
      </div>
      <SearchPalette open={search} onClose={() => setSearch(false)} />
    </div>
  );
}

type Result = { kind: string; title: string; detail: string; href: string };

function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} size="md" labelledBy="search-label">
      {open && <SearchBody onClose={onClose} />}
    </Modal>
  );
}

function SearchBody({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [remote, setRemote] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const onQuery = (next: string) => {
    setQ(next);
    setIndex(0);
    if (timer.current) clearTimeout(timer.current);
    if (next.trim().length < 2) {
      setRemote([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(next.trim())}`);
        setRemote(res.ok ? (await res.json()).results : []);
      } catch {
        setRemote([]);
      } finally {
        setLoading(false);
      }
    }, 180);
  };

  const pages: Result[] = ADMIN_NAV.flatMap((g) => g.items)
    .filter((i) => !q || `${i.label} ${i.keywords ?? ""}`.toLowerCase().includes(q.toLowerCase()))
    .map((i) => ({ kind: "Page", title: i.label, detail: "", href: i.href }));
  const results = [...pages.slice(0, q ? 5 : 8), ...(q.trim().length >= 2 ? remote : [])];

  const go = (r: Result) => {
    onClose();
    router.push(r.href);
  };

  return (
    <>
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-4">
        <Search className="h-4 w-4 text-muted" aria-hidden="true" />
        <label id="search-label" htmlFor="admin-search" className="sr-only">
          Search the admin panel
        </label>
        <input
          id="admin-search"
          autoFocus
          value={q}
          onChange={(e) => onQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setIndex((i) => Math.min(results.length - 1, i + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setIndex((i) => Math.max(0, i - 1));
            } else if (e.key === "Enter" && results[index]) go(results[index]);
          }}
          placeholder="Search pages, projects, messages, images…"
          className="h-14 flex-1 bg-transparent text-sm placeholder:text-muted/60 focus:outline-none"
        />
        {loading && <span className="text-xs text-muted">Searching…</span>}
      </div>
      <ul className="max-h-[60vh] overflow-y-auto p-2" role="listbox" aria-label="Results">
        {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">{q.length < 2 ? "Type to search." : "No results."}</li>}
        {results.map((r, i) => (
          <li key={r.kind + r.href + r.title} role="option" aria-selected={i === index}>
            <button
              type="button"
              onMouseEnter={() => setIndex(i)}
              onClick={() => go(r)}
              className={cx("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left", i === index ? "bg-white/[0.07]" : "")}
            >
              <span className="w-24 shrink-0 text-[0.65rem] tracking-[0.15em] text-muted uppercase">{r.kind}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">{r.title}</span>
                {r.detail && <span className="block truncate text-xs text-muted">{r.detail}</span>}
              </span>
              {i === index && <CornerDownLeft className="h-3.5 w-3.5 text-muted" aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
