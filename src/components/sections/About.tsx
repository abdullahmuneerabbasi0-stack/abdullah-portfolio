import { Hammer, Bot, Briefcase } from "lucide-react";
import { profile } from "@/content/site";
import { T } from "@/components/ui/T";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Spotlight } from "@/components/ui/Spotlight";

const pillars = [
  { icon: Hammer, title: "Learning by building", text: "I grow my skills through practical projects, not just tutorials." },
  { icon: Bot, title: "AI-assisted development", text: "I use AI tools to plan, build and ship projects faster." },
  { icon: Briefcase, title: "Business-focused", text: "I care about technology that solves real business problems." },
];

export function About() {
  return (
    <section id="about" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="About me" title="An ambitious developer on a building journey" />
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <Reveal className="space-y-5 text-lg leading-relaxed text-muted">
            {profile.about.map((p, i) => (
              <p key={i} className={i === 0 ? "text-text" : undefined}>
                <T value={p} />
              </p>
            ))}
          </Reveal>
          <div className="grid gap-4">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <Spotlight className="flex gap-4 p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-2">
                    <p.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted">{p.text}</p>
                  </div>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
