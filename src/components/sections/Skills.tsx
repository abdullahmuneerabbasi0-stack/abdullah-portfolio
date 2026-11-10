import { Target } from "lucide-react";
import { interests, skillGroups } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Spotlight } from "@/components/ui/Spotlight";

export function Skills() {
  return (
    <section id="skills" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Skills"
          title="Technical skills"
          intro="The languages, frameworks and tools I build with."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, i) => (
            <Reveal key={g.title} delay={(i % 3) * 0.08}>
              <Spotlight className="h-full p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent-2">
                    <Icon name={g.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold">{g.title}</h3>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {g.skills.map((s) => (
                    <li
                      key={s}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-text/90 transition-colors hover:border-accent-2/50 hover:text-accent-3"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </Spotlight>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1} className="mt-4">
          <Spotlight className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent-2">
                <Target className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="font-display text-lg font-semibold">Professional interests</h3>
            </div>
            <ul className="flex flex-wrap gap-2 sm:ml-auto">
              {interests.map((s) => (
                <li key={s} className="rounded-full border border-accent-2/30 bg-accent/[0.06] px-3.5 py-1.5 text-sm text-accent-3">
                  {s}
                </li>
              ))}
            </ul>
          </Spotlight>
        </Reveal>
      </div>
    </section>
  );
}
