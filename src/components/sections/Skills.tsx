import type { SectionConfig, SkillRecord } from "@/lib/content/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Skills({ section, groups, interests }: { section: SectionConfig; groups: SkillRecord[]; interests: string[] }) {
  // Doubled so the marquee can loop seamlessly.
  const loop = [...interests, ...interests];
  return (
    <section id="skills" className="section-pad">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} intro={section.intro || undefined} />
        {groups.length > 0 && (
        <ul className="border-b border-line">
          {groups.map((g, i) => (
            <li key={g.title + i}>
              <Reveal
                delay={i * 0.05}
                className="group grid gap-4 border-t border-line py-8 transition-colors duration-500 hover:bg-white/[0.02] md:grid-cols-12 md:items-baseline md:py-10"
              >
                <span className="text-xs tracking-[0.2em] text-muted md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <div className="md:col-span-4">
                  <h3 className="font-display text-3xl transition-all duration-500 group-hover:translate-x-2 group-hover:text-accent-2 group-hover:italic sm:text-4xl">
                    {g.title}
                  </h3>
                  {g.description && <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{g.description}</p>}
                </div>
                {g.showProficiency ? (
                  <ul className="grid gap-x-8 gap-y-4 text-sm text-text/85 sm:grid-cols-2 md:col-span-7">
                    {g.skills.map((s) => (
                      <li key={s.name}>
                        <div className="flex items-baseline justify-between gap-3">
                          <span>{s.name}</span>
                          {s.level !== null && <span className="text-xs text-muted">{s.level}%</span>}
                        </div>
                        {s.level !== null && (
                          <div
                            className="mt-2 h-px w-full bg-line"
                            role="meter"
                            aria-label={`${s.name} proficiency`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={s.level}
                          >
                            <div className="h-px bg-accent" style={{ width: `${s.level}%` }} />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="flex flex-wrap gap-x-2 gap-y-2 text-base text-text/80 md:col-span-7 md:justify-end">
                    {g.skills.map((s) => (
                      <li
                        key={s.name}
                        className="rounded-full border border-line px-4 py-1.5 transition-colors duration-300 hover:border-accent hover:text-accent-3"
                      >
                        {s.name}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            </li>
          ))}
        </ul>
        )}
      </div>

      {interests.length > 0 && (
      <Reveal className="mt-24 md:mt-32">
        <h3 className="eyebrow mx-auto mb-8 max-w-7xl px-5 text-accent-2 sm:px-8">Professional interests</h3>
        <div className="relative overflow-hidden border-y border-line py-8 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <ul className="sr-only">
            {interests.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="animate-marquee flex w-max" aria-hidden="true">
            {loop.map((s, i) => (
              <span key={i} className="flex items-center font-display text-4xl whitespace-nowrap sm:text-6xl">
                <span className={i % 2 ? "italic text-accent-2" : ""}>{s}</span>
                <span className="mx-8 text-2xl text-accent sm:mx-12">✦</span>
              </span>
            ))}
          </div>
        </div>
      </Reveal>
      )}
    </section>
  );
}
