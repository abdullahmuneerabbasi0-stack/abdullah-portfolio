import { interests, skillGroups } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Skills() {
  // Doubled so the marquee can loop seamlessly.
  const loop = [...interests, ...interests];
  return (
    <section id="skills" className="py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Skills"
          title="Technical *skills*"
          intro="The languages, frameworks and tools I build with."
        />
        <ul className="border-b border-line">
          {skillGroups.map((g, i) => (
            <li key={g.title}>
              <Reveal
                delay={i * 0.05}
                className="group grid gap-4 border-t border-line py-8 transition-colors duration-500 hover:bg-white/[0.02] md:grid-cols-12 md:items-baseline md:py-10"
              >
                <span className="text-xs tracking-[0.2em] text-muted md:col-span-1">0{i + 1}</span>
                <h3 className="font-display text-3xl transition-all duration-500 group-hover:translate-x-2 group-hover:text-accent-2 group-hover:italic sm:text-4xl md:col-span-4">
                  {g.title}
                </h3>
                <ul className="flex flex-wrap gap-x-2 gap-y-2 text-base text-text/80 md:col-span-7 md:justify-end">
                  {g.skills.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-line px-4 py-1.5 transition-colors duration-300 hover:border-accent hover:text-accent-3"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

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
    </section>
  );
}
