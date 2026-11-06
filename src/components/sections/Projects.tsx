import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { projects } from "@/content/projects";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Spotlight } from "@/components/ui/Spotlight";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProjectVisual } from "@/components/project/ProjectVisual";

export function Projects() {
  const flagship = projects.find((p) => p.flagship) ?? projects[0];
  const others = projects.filter((p) => p !== flagship);

  return (
    <section id="projects" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Featured projects"
          title="What I'm building"
          intro="Projects presented honestly: what exists today, and where each one is heading."
        />

        {flagship && (
          <Reveal>
            <Spotlight as="article" className="group overflow-hidden">
              <div className="grid lg:grid-cols-[1.1fr_1fr]">
                <div className="flex flex-col p-7 sm:p-10">
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-accent-3">
                      Flagship
                    </span>
                    <StatusBadge status={flagship.status} detail={flagship.statusDetail} />
                  </div>
                  <h3 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{flagship.title}</h3>
                  <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">{flagship.category}</p>
                  <p className="mt-5 text-lg leading-relaxed text-muted">{flagship.summary}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {flagship.technologies.map((t) => (
                      <li key={t} className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-text/85">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/projects/${flagship.slug}`}
                    className="bg-accent-gradient mt-8 inline-flex w-fit items-center gap-2 rounded-xl px-5 py-3 font-semibold text-black transition hover:brightness-110"
                  >
                    View case study
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                <div className="relative min-h-72 border-t border-white/10 lg:border-t-0 lg:border-l">
                  <ProjectVisual />
                </div>
              </div>
            </Spotlight>
          </Reveal>
        )}

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {others.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.1}>
              <Spotlight as="article" className="h-full p-7">
                <StatusBadge status={p.status} detail={p.statusDetail} />
                <h3 className="mt-4 font-display text-2xl font-semibold">{p.title}</h3>
                <p className="mt-3 text-muted">{p.tagline}</p>
                <Link href={`/projects/${p.slug}`} className="mt-5 inline-flex items-center gap-1 font-semibold text-accent-2">
                  View project <ArrowRight className="h-4 w-4" />
                </Link>
              </Spotlight>
            </Reveal>
          ))}
          <Reveal delay={0.1} className={others.length % 2 === 0 ? "md:col-span-2" : undefined}>
            <div className="flex h-full flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-white/15 p-7 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-accent-3">
                  <Layers className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display font-semibold">Have a project in mind?</p>
                  <p className="text-sm text-muted">More case studies are on the way. Yours could be next.</p>
                </div>
              </div>
              <Link href="/#contact" className="glass rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
                Start a conversation
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
