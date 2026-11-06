"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { profile } from "@/content/site";
import { T } from "@/components/ui/T";

const ease = [0.22, 1, 0.36, 1] as const;

function RotatingRole() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="block min-h-[2.2em] text-[0.85em] lg:min-h-[1.15em]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(8px)", y: -12 }}
          transition={{ duration: 0.45, ease }}
          className="text-gradient inline-block pb-[0.08em]"
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  const item = (d: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: d, ease },
  });

  return (
    <section id="top" className="relative px-6 pt-36 pb-20 sm:pt-44 md:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <motion.p
            {...item(0)}
            className="glass mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-muted sm:text-sm"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px] shadow-emerald-400" />
            {profile.availability}
          </motion.p>

          <motion.h1
            {...item(0.08)}
            className="font-display text-[2.6rem] leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-[3.6rem] xl:text-7xl"
          >
            Hi, I&apos;m {profile.shortName}.
            <br />
            <span className="text-text/90">I&apos;m a</span>
            <span className="sr-only">{profile.roles.join(" and ")}</span>
            <span aria-hidden="true">
              <RotatingRole />
            </span>
          </motion.h1>

          <motion.p {...item(0.18)} className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            {profile.headline}
          </motion.p>

          <motion.div {...item(0.28)} className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/#projects"
              className="bg-accent-gradient group inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-black shadow-[0_8px_30px_-6px] shadow-accent/50 transition hover:brightness-110"
            >
              View projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/#contact"
              className="glass inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-text transition hover:bg-white/10"
            >
              Hire me
            </Link>
            {profile.cv && (
              <a
                href={profile.cv}
                download
                className="inline-flex items-center gap-2 rounded-xl px-4 py-3.5 font-medium text-muted transition hover:text-text"
              >
                <Download className="h-4 w-4" /> Download CV
              </a>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="relative mx-auto w-full max-w-xs sm:max-w-sm"
        >
          <div className="bg-accent-gradient absolute -inset-px rounded-3xl opacity-40 blur-xl" aria-hidden="true" />
          <div className="glass relative rounded-3xl p-6">
            <div className="relative mb-6 aspect-square overflow-hidden rounded-2xl bg-surface-2">
              {profile.photo ? (
                <Image src={profile.photo} alt={`Portrait of ${profile.name}`} fill sizes="(max-width: 640px) 90vw, 384px" className="object-cover" priority />
              ) : (
                <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_30%_20%,rgb(255_77_46/0.35),transparent_60%),radial-gradient(circle_at_80%_90%,rgb(255_176_32/0.25),transparent_55%)]">
                  <span className="font-display text-8xl font-bold text-white/90">{profile.initials}</span>
                </div>
              )}
            </div>
            <p className="font-display text-xl font-semibold">{profile.name}</p>
            <p className="text-sm text-muted">{profile.roles.join(" · ")}</p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="h-4 w-4 text-accent-2" /> <T value={profile.location} />
            </p>
            <dl className="mt-5 grid gap-2 border-t border-white/10 pt-5 text-sm">
              {profile.focus.map((f) => (
                <div key={f.label} className="flex justify-between gap-4">
                  <dt className="text-muted">{f.label}</dt>
                  <dd className="text-right font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
