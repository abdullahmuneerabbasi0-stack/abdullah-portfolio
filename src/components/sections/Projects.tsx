import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import { Reveal } from "@/components/ui/Reveal";
import { Pill } from "@/components/ui/Pill";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ParallaxFrame } from "@/components/ui/ParallaxFrame";
import { ViewCursor } from "@/components/ui/ViewCursor";
import { ProjectPoster, ProjectVisual } from "@/components/project/ProjectVisual";

function Tech({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((t) => (
        <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-text/75">
          {t}
        </li>
      ))}
    </ul>
  );
}

export function Projects() {
  const flagship = projects.find((p) => p.flagship) ?? projects[0];
  const others = projects.filter((p) => p !== flagship);

  return (
    <section id="projects" className="py-24 md:py-36">
      <ViewCursor label="View" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Featured projects"
          title="What I'm *building*"
          intro="Projects presented honestly: what exists today, and where each one is heading."
        />

        {flagship && (
          <article className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <Link
              href={`/projects/${flagship.slug}`}
              data-cursor="view"
              aria-label={`${flagship.title} case study`}
              className="group block lg:col-span-8"
            >
              <ParallaxFrame className="aspect-[3/4] sm:aspect-[16/11]">
                <ProjectVisual />
              </ParallaxFrame>
            </Link>
            <Reveal className="lg:col-span-4 lg:pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-ink">
                  Flagship
                </span>
                <StatusBadge status={flagship.status} detail={flagship.statusDetail} />
              </div>
              <p className="mt-6 text-[0.7rem] uppercase tracking-[0.22em] text-muted">{flagship.category}</p>
              <h3 className="mt-3 font-display text-4xl leading-[1.02] sm:text-5xl">{flagship.title}</h3>
              <p className="mt-5 leading-relaxed text-muted">{flagship.summary}</p>
              <div className="mt-6">
                <Tech items={flagship.technologies} />
              </div>
              <Pill href={`/projects/${flagship.slug}`} variant="copper" className="mt-8">
                View case study
              </Pill>
            </Reveal>
          </article>
        )}

        <div className="mt-24 grid gap-16 md:mt-36 md:grid-cols-2 md:gap-10">
          {others.map((p, i) => (
            <article key={p.slug} className={i % 2 === 1 ? "md:mt-40" : undefined}>
              <Link href={`/projects/${p.slug}`} data-cursor="view" className="group block">
                <ParallaxFrame className="aspect-[4/5]">
                  <ProjectPoster title={p.title} category={p.category} technologies={p.technologies} index={i + 2} />
                </ParallaxFrame>
                <Reveal className="mt-7">
                  <StatusBadge status={p.status} detail={p.statusDetail} />
                  <h3 className="mt-4 flex items-start justify-between gap-4 font-display text-3xl leading-tight sm:text-4xl">
                    <span className="link-underline group-hover:[background-size:100%_1px]">{p.title}</span>
                    <span className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                      <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </h3>
                  <p className="mt-3 max-w-md text-muted">{p.tagline}</p>
                  <span className="sr-only">View project</span>
                </Reveal>
              </Link>
            </article>
          ))}
        </div>

        <Reveal className="mt-28">
          <div className="flex flex-col items-start justify-between gap-8 border-y border-line py-10 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-3xl sm:text-4xl">
                Have a project <em className="text-accent-2">in mind?</em>
              </p>
              <p className="mt-2 text-muted">More case studies are on the way. Yours could be next.</p>
            </div>
            <Pill href="/#contact" variant="outline">
              Start a conversation
            </Pill>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
