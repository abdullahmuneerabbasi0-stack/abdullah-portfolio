import { profile } from "@/content/site";
import { projects } from "@/content/projects";
import { T, plain } from "@/components/ui/T";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { ScrollWords } from "@/components/ui/ScrollWords";
import { SectionHeading } from "@/components/ui/SectionHeading";

const pillars = [
  { title: "Learning by building", text: "I grow my skills through practical projects, not just tutorials." },
  { title: "AI-assisted development", text: "I use AI tools to plan, build and ship projects faster." },
  { title: "Business-focused", text: "I care about technology that solves real business problems." },
];

/** Facts taken from the project content, so the numbers stay true. */
const facts = [
  { value: 5, unit: "days", label: "to build and deploy this portfolio" },
  { value: 1, unit: "day", label: "to its first working version" },
  { value: 7, unit: "sections", label: "built from reusable React components" },
  { value: projects.length, unit: "projects", label: "live or in active development" },
];

export function About() {
  const [lead, ...rest] = profile.about;
  return (
    <section
      id="about"
      className="relative z-10 -mt-[8vh] rounded-t-[2rem] bg-bone px-5 py-24 text-ink sm:px-8 md:rounded-t-[3rem] md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="About me" title="An ambitious developer on a *building* *journey*" tone="light" />

        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-10 md:col-start-2 lg:col-span-9 lg:col-start-4">
            <ScrollWords
              text={plain(lead)}
              className="font-display text-[1.75rem] leading-[1.2] sm:text-4xl lg:text-[2.75rem]"
            />
            <div className="mt-12 grid gap-8 text-base leading-relaxed text-ink/70 sm:grid-cols-2">
              {rest.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <p>
                    <T value={p} />
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <ol className="mt-24 grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 md:grid-cols-3">
          {pillars.map((p, i) => (
            <li key={p.title} className="bg-bone">
              <Reveal delay={i * 0.1} className="group h-full p-8 transition-colors duration-500 hover:bg-bone-2 sm:p-10">
                <span className="font-display text-2xl italic text-[#9a5a35]">0{i + 1}</span>
                <h3 className="mt-10 font-display text-3xl leading-tight">{p.title}</h3>
                <p className="mt-3 text-ink/65">{p.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <dl className="mt-24 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-ink/15 pt-12 lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.08}>
              <dt className="sr-only">{f.label}</dt>
              <dd>
                <p className="flex items-baseline gap-2 font-display">
                  <Counter value={f.value} className="text-6xl leading-none sm:text-7xl" />
                  <span className="text-xl italic text-[#9a5a35]">{f.unit}</span>
                </p>
                <p className="mt-3 max-w-[22ch] text-sm leading-relaxed text-ink/60" aria-hidden="true">
                  {f.label}
                </p>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
