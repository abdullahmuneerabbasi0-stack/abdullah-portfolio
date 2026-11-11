"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/components/layout/MotionProvider";
import { Award, ExternalLink } from "lucide-react";
import type { CertificationEntry, EducationEntry, SectionConfig } from "@/lib/content/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Education({
  section,
  education,
  certifications,
}: {
  section: SectionConfig;
  education: EducationEntry[];
  certifications: CertificationEntry[];
}) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [0, 1]);

  return (
    <section id="education" className="section-pad">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={section.eyebrow} title={section.title || "*Education*"} intro={section.intro || undefined} />
        <div className={`grid gap-16 ${certifications.length ? "lg:grid-cols-2" : "md:grid-cols-12"}`}>
          <ol ref={ref} className={`relative space-y-16 pl-10 sm:pl-16 ${certifications.length ? "" : "md:col-span-10 md:col-start-3"}`}>
            {/* The timeline draws itself as the section scrolls past. */}
            <span className="absolute top-2 bottom-2 left-0 w-px bg-line" aria-hidden="true" />
            <motion.span
              aria-hidden="true"
              style={{ scaleY }}
              className="absolute top-2 bottom-2 left-0 w-px origin-top bg-accent"
            />
            {education.map((e, i) => (
              <li key={i} className="relative">
                <span className="absolute top-3 -left-10 grid h-3 w-3 -translate-x-1/2 place-items-center rounded-full bg-accent ring-8 ring-bg sm:-left-16" aria-hidden="true" />
                <Reveal delay={0.05}>
                  <div className="grid gap-4 sm:grid-cols-[5rem_1fr] sm:gap-8">
                    <span className="font-display text-5xl leading-none italic text-accent-2 sm:text-6xl">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      {e.period && (
                        <p className="text-[0.7rem] uppercase tracking-[0.22em] text-muted">
                          {e.period}
                        </p>
                      )}
                      <h3 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
                        {e.qualification}
                      </h3>
                      {e.institution && (
                        <p className="mt-2 text-lg text-text/80">
                          {e.institution}
                        </p>
                      )}
                      {e.details && (
                        <p className="mt-2 text-sm text-muted">
                          {e.details}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          {certifications.length > 0 && (
            <ul className="grid content-start gap-px overflow-hidden rounded-3xl border border-line bg-line">
              {certifications.map((c, i) => (
                <li key={c.name + i} className="bg-bg">
                  <Reveal delay={i * 0.06} className="flex items-center gap-4 p-6">
                    <Award className="h-6 w-6 shrink-0 text-accent-2" aria-hidden="true" />
                    <div className="flex-1">
                      <p className="font-display text-xl">{c.name}</p>
                      <p className="text-sm text-muted">
                        {c.issuer}
                        {c.year && ` · ${c.year}`}
                      </p>
                    </div>
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-accent-2 hover:text-accent-3" aria-label={`Verify ${c.name}`}>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
