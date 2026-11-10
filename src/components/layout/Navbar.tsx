"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "@/content/site";

const links = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b px-5 transition-colors sm:px-8 ${
        scrolled || open ? "border-line bg-bg" : "border-transparent bg-bg/0"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight hover:text-accent" onClick={() => setOpen(false)}>
          {profile.name}
        </Link>

        <ul className="hidden items-center gap-7 text-sm md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <Link href={`/#${l.id}`} className="text-muted transition-colors hover:text-text">
                {l.label}
              </Link>
            </li>
          ))}
          {profile.cv && (
            <li>
              <a href={profile.cv} download className="link font-medium">
                CV
              </a>
            </li>
          )}
        </ul>

        <button
          type="button"
          className="-mr-2 grid h-10 w-10 place-items-center text-text md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <ul className="mx-auto max-w-6xl border-t border-line pb-4 md:hidden">
          {links.map((l) => (
            <li key={l.id} className="border-b border-line">
              <Link href={`/#${l.id}`} onClick={() => setOpen(false)} className="block py-4 text-lg">
                {l.label}
              </Link>
            </li>
          ))}
          {profile.cv && (
            <li>
              <a href={profile.cv} download className="block py-4 text-lg text-accent">
                Download CV (PDF)
              </a>
            </li>
          )}
        </ul>
      )}
    </header>
  );
}
