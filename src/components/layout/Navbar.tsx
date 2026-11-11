"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { contact, profile } from "@/content/site";

const links = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const { scrollY } = useScroll();

  // Tuck the bar away while reading down; bring it back on any scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 400 && y > prev + 4);
    if (y < prev - 4) setHidden(false);
    if (y < 200) setActive(null);
  });

  // Highlight the section currently in view (home page only).
  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const l of links) {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      animate={{ y: hidden && !open ? "-110%" : "0%" }}
      transition={{ duration: 0.5, ease }}
    >
      <nav
        aria-label="Main"
        className={`relative z-10 transition-colors duration-500 ${
          scrolled && !open ? "border-b border-line bg-bg/75 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="grid h-10 w-10 place-items-center rounded-full border border-text/25 font-display text-base italic transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
              {profile.initials}
            </span>
            <span className="hidden text-[0.78rem] font-medium uppercase tracking-[0.2em] sm:inline">{profile.name}</span>
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/#${l.id}`}
                  aria-current={active === l.id ? "true" : undefined}
                  className={`link-underline pb-1 text-[0.78rem] uppercase tracking-[0.16em] transition-colors hover:text-text ${
                    active === l.id ? "text-text" : "text-muted"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href="/#contact"
              className="hidden rounded-full bg-bone px-5 py-2.5 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:bg-accent sm:inline-block"
            >
              Hire me
            </Link>
            <button
              type="button"
              className="relative grid h-11 w-11 place-items-center rounded-full border border-text/20 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span
                className={`absolute h-px w-4 bg-current transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[3px]"}`}
              />
              <span
                className={`absolute h-px w-4 bg-current transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-[3px]"}`}
              />
            </button>
          </div>
        </div>
      </nav>
    </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bg px-6 pt-24 pb-8 lg:hidden"
          >
            <ul className="flex flex-1 flex-col justify-center gap-1">
              {links.map((l, i) => (
                <li key={l.id} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, delay: 0.25 + i * 0.06, ease }}
                  >
                    <Link
                      href={`/#${l.id}`}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 py-1.5 font-display text-5xl leading-tight sm:text-6xl"
                    >
                      <span className="font-sans text-xs tracking-widest text-muted">0{i + 1}</span>
                      <span className="transition-colors group-hover:text-accent-2 group-hover:italic">{l.label}</span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-6 text-sm text-muted"
            >
              <div>
                {contact.email && <a href={`mailto:${contact.email}`} className="block break-all hover:text-text">{contact.email}</a>}
                <p className="mt-1">{typeof profile.location === "string" ? profile.location : ""}</p>
              </div>
              <Link
                href="/#contact"
                onClick={() => setOpen(false)}
                className="rounded-full bg-bone px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-ink"
              >
                Hire me
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
