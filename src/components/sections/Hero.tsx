"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Download, MapPin } from "lucide-react";
import type { HeroSettings, ResolvedImage } from "@/lib/content/types";
import { Pill } from "@/components/ui/Pill";
import { SplitText } from "@/components/ui/SplitText";
import { useIntroReady, useReducedMotion } from "@/components/layout/MotionProvider";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ hero, photo }: { hero: HeroSettings; photo: ResolvedImage | null }) {
  const ready = useIntroReady();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // As the visitor scrolls on, the whole stage settles back like a frame
  // being pushed away, while the portrait drifts at a slower pace.
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 0.9]);
  const radius = useTransform(scrollYProgress, [0, 0.4], [0, reduced ? 0 : 40]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0.25]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "14%"]);

  const fadeUp = (d: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, delay: d, ease },
  });

  return (
    <section id="top" ref={ref} className="relative">
      <motion.div
        style={{ scale, borderRadius: radius, opacity: fade }}
        className="relative flex min-h-[100svh] origin-top flex-col overflow-hidden px-5 pt-28 pb-[calc(8vh+2rem)] sm:px-8 sm:pt-32"
      >
        <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <motion.p {...fadeUp(0.1)} className="eyebrow mb-8 text-accent-2">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {hero.availability}
            </motion.p>

            <h1 className="font-display leading-[0.95] font-normal tracking-[-0.02em]">
              <span className="sr-only">
                Hi, I&apos;m {hero.shortName}. I&apos;m a {hero.role}.
              </span>
              <span aria-hidden="true">
                <SplitText
                  as="span"
                  text={`Hi, I'm ${hero.shortName}.`}
                  play={ready}
                  delay={0.15}
                  className="block text-[3.4rem] sm:text-[5.5rem] lg:text-[6.2rem] xl:text-[7rem]"
                />
                <SplitText
                  as="span"
                  text={`I'm a ${hero.role
                    .split(" ")
                    .map((w) => `*${w}`)
                    .join(" ")}`}
                  play={ready}
                  delay={0.35}
                  className="mt-3 block max-w-[20ch] text-[2rem] leading-[1.05] text-text/90 sm:text-5xl lg:text-[3.4rem]"
                />
              </span>
            </h1>

            <motion.p {...fadeUp(0.7)} className="mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {hero.headline}
            </motion.p>

            <motion.div {...fadeUp(0.85)} className="mt-10 flex flex-wrap items-center gap-3">
              {hero.ctas
                .filter((c) => c.enabled)
                .map((c) => (
                  <Pill key={c.id} href={c.href} variant={c.style} external={/^https?:/.test(c.href)}>
                    {c.label}
                  </Pill>
                ))}
              {hero.cv.enabled && hero.cv.url && (
                <a
                  href={hero.cv.url}
                  download
                  className="link-underline ml-2 inline-flex items-center gap-2 pb-1 text-[0.8rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-text"
                >
                  <Download className="h-4 w-4" aria-hidden="true" /> {hero.cv.label}
                </a>
              )}
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <motion.figure
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              animate={ready ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
              transition={{ duration: 1.4, delay: 0.25, ease: [0.76, 0, 0.24, 1] }}
              className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[var(--frame-radius)] bg-surface-2 sm:max-w-md lg:max-w-none"
            >
              {photo ? (
                <motion.div style={{ y: imgY }} className="absolute -inset-y-[8%] inset-x-0">
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1.25 }}
                    animate={ready ? { scale: 1 } : undefined}
                    transition={{ duration: 1.8, delay: 0.25, ease }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt || `Portrait of ${hero.name}`}
                      fill
                      sizes="(max-width: 1024px) 90vw, 40vw"
                      className="object-cover object-[50%_30%]"
                      priority
                    />
                  </motion.div>
                </motion.div>
              ) : (
                <div className="grid h-full place-items-center">
                  <span className="font-display text-8xl italic text-text/90">{hero.initials}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                <div>
                  <p className="font-display text-2xl leading-tight">{hero.name}</p>
                  {hero.location && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-text/70">
                      <MapPin className="h-3.5 w-3.5 text-accent-2" aria-hidden="true" /> {hero.location}
                    </p>
                  )}
                </div>
              </figcaption>
            </motion.figure>
          </div>
        </div>

        <motion.div
          {...fadeUp(1.05)}
          className="mx-auto mt-14 grid w-full max-w-7xl grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-4"
        >
          {hero.focus.map((f) => (
            <dl key={f.label}>
              <dt className="text-[0.68rem] uppercase tracking-[0.22em] text-muted">{f.label}</dt>
              <dd className="mt-1.5 font-display text-xl leading-snug">{f.value}</dd>
            </dl>
          ))}
          <a
            href="#about"
            className="group col-span-2 flex items-center gap-3 self-end text-[0.68rem] uppercase tracking-[0.22em] text-muted hover:text-text sm:col-span-1 sm:justify-self-end"
          >
            Scroll to explore
            <span className="relative block h-10 w-px overflow-hidden bg-line" aria-hidden="true">
              <span className="animate-scroll-cue absolute inset-0 bg-accent" />
            </span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
