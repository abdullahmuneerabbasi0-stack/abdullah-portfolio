import type { AboutSettings, SectionConfig } from "@/lib/content/types";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { ScrollWords } from "@/components/ui/ScrollWords";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About({ section, about, projectCount }: { section: SectionConfig; about: AboutSettings; projectCount: number }) {
  const [lead = "", ...rest] = about.paragraphs;
  // "auto" facts are counted from the published projects, so they stay true.
  const facts = about.facts.map((f) => ({ ...f, value: f.auto === "projects" ? projectCount : f.value }));
  const pillars = about.pillars;
  return (
    <section
      id="about"
      className="relative z-10 -mt-[8vh] rounded-t-[var(--panel-radius-sm)] bg-bone px-5 section-pad text-ink sm:px-8 md:rounded-t-[var(--panel-radius)]"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} intro={section.intro || undefined} tone="light" />

        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-10 md:col-start-2 lg:col-span-9 lg:col-start-4">
            <ScrollWords
              text={lead}
              className="font-display text-[1.75rem] leading-[1.2] sm:text-4xl lg:text-[2.75rem]"
            />
            <div className="mt-12 grid gap-8 text-base leading-relaxed text-ink/70 sm:grid-cols-2">
              {rest.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {pillars.length > 0 && (
        <ol className="mt-24 grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 md:grid-cols-3">
          {pillars.map((p, i) => (
            <li key={i} className="bg-bone">
              <Reveal delay={i * 0.1} className="group h-full p-8 transition-colors duration-500 hover:bg-bone-2 sm:p-10">
                <span className="font-display text-2xl italic text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-10 font-display text-3xl leading-tight">{p.title}</h3>
                <p className="mt-3 text-ink/65">{p.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        )}

        {facts.length > 0 && (
        <dl className="mt-24 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-ink/15 pt-12 lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <dt className="sr-only">{f.label}</dt>
              <dd>
                <p className="flex items-baseline gap-2 font-display">
                  <Counter value={f.value} className="text-6xl leading-none sm:text-7xl" />
                  <span className="text-xl italic text-accent-ink">{f.unit}</span>
                </p>
                <p className="mt-3 max-w-[22ch] text-sm leading-relaxed text-ink/60" aria-hidden="true">
                  {f.label}
                </p>
              </dd>
            </Reveal>
          ))}
        </dl>
        )}
      </div>
    </section>
  );
}
