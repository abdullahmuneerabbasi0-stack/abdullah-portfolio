import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { getProject, projects } from "@/content/projects";
import { profile, siteUrl } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Spotlight } from "@/components/ui/Spotlight";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { ProjectPoster, ProjectVisual } from "@/components/project/ProjectVisual";
import { Pill } from "@/components/ui/Pill";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.tagline,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${p.title} | ${profile.name}`, description: p.tagline, url: `${siteUrl}/projects/${p.slug}` },
  };
}

function Block({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="py-14 md:py-20">
      <Reveal className="mb-8">
        <p className="eyebrow mb-5 text-accent-2">{eyebrow}</p>
        <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.title,
    description: p.summary,
    applicationCategory: "WebApplication",
    creativeWorkStatus: `${p.status}${p.statusDetail ? ` (${p.statusDetail})` : ""}`,
    author: { "@type": "Person", name: profile.name, url: siteUrl },
  };

  return (
    <article className="px-6 pt-32 pb-16 sm:pt-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-6xl">
        <Link href="/#projects" className="group inline-flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.18em] text-muted hover:text-text">
          <ArrowLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1" /> All projects
        </Link>

        {/* Hero */}
        <header className="mt-8 grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={p.status} detail={p.statusDetail} />
              <span className="text-[0.7rem] uppercase tracking-[0.22em] text-muted">{p.category}</span>
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[0.98] tracking-[-0.02em] sm:text-6xl lg:text-7xl">{p.title}</h1>
            <p className="mt-5 text-xl leading-relaxed text-muted">{p.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {p.liveUrl && (
                <Pill href={p.liveUrl} external variant="copper" icon={<ExternalLink className="h-4 w-4" aria-hidden="true" />}>
                  Live site
                </Pill>
              )}
              {p.repoUrl && (
                <Pill href={p.repoUrl} external variant="outline" icon={<GithubIcon className="h-4 w-4" />}>
                  Source
                </Pill>
              )}
              <Pill href="/#contact" variant="solid">
                Discuss this project
              </Pill>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative h-[28rem] overflow-hidden rounded-[2rem] border border-line">
              {p.visual === "studio" ? (
                <ProjectVisual />
              ) : (
                <ProjectPoster title={p.title} category={p.category} technologies={p.technologies} index={projects.indexOf(p) + 1} />
              )}
            </div>
          </Reveal>
        </header>

        {/* Honest status note */}
        {p.status !== "Live" && (
        <Reveal className="mt-12">
          <div className="rounded-2xl border border-accent-3/30 bg-accent-3/[0.06] p-5 text-sm leading-relaxed text-text/90 sm:p-6">
            <strong className="text-accent-3">Project status:</strong> {p.title} is an ongoing independent project
            {p.statusDetail ? ` currently in the ${p.statusDetail.toLowerCase()}` : " currently in development"}. It has not yet
            been released{p.features ? "; the features below describe the planned platform" : ""}.
          </div>
        </Reveal>
        )}

        {p.highlights && (
          <Block eyebrow="Highlights" title={p.status === "Live" ? "What I built" : "What I'm building"}>
            <Reveal>
              <ul className="space-y-4">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-lg leading-relaxed text-text/90">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent-3" aria-hidden="true" /> {h}
                  </li>
                ))}
              </ul>
            </Reveal>
            {!p.architecture && (
              <Reveal className="mt-10">
                <p className="mb-3 text-sm text-muted">Technologies</p>
                <ul className="flex flex-wrap gap-2">
                  {p.technologies.map((t) => (
                    <li key={t} className="rounded-full border border-line px-3.5 py-1.5 text-xs text-text/80">
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </Block>
        )}

        {p.problem && p.vision && (
        <div className="grid gap-x-16 lg:grid-cols-2">
          <Block eyebrow="The problem" title="Why it matters">
            <Reveal className="space-y-4 text-lg leading-relaxed text-muted">
              {p.problem.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </Reveal>
          </Block>
          <Block eyebrow="The vision" title="Where it's heading">
            <Reveal className="space-y-4 text-lg leading-relaxed text-muted">
              {p.vision.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </Reveal>
          </Block>
        </div>
        )}

        {p.features && (
        <Block eyebrow="Planned capabilities" title="What the platform will do">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {p.features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.08}>
                <Spotlight as="article" className="flex h-full flex-col p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-line text-accent-2">
                      <Icon name={f.icon} className="h-5 w-5" />
                    </span>
                    <span className="rounded-full border border-line px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-muted">
                      {f.state}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-normal">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted">{f.description}</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {f.points.map((pt) => (
                      <li key={pt} className="flex gap-2 text-text/85">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2" aria-hidden="true" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </Block>

        )}

        {p.architecture && (
        <Block eyebrow="Architecture" title="Key design decisions">
          <div className="grid gap-5 sm:grid-cols-2">
            {p.architecture.map((a, i) => (
              <Reveal key={a.title} delay={(i % 2) * 0.08}>
                <div className="h-full rounded-3xl border border-line bg-surface/60 p-7">
                  <p className="font-display text-3xl italic text-accent-2">0{i + 1}</p>
                  <h3 className="mt-2 font-display text-lg font-normal">{a.title}</h3>
                  <p className="mt-2 text-muted">{a.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <p className="mb-3 text-sm text-muted">Planned technologies</p>
            <ul className="flex flex-wrap gap-2">
              {p.technologies.map((t) => (
                <li key={t} className="rounded-full border border-line px-3.5 py-1.5 text-xs text-text/80">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </Block>

        )}

        {p.progress && (
        <Block eyebrow="Progress" title="Where it stands today">
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal>
              <Spotlight className="h-full p-7">
                <h3 className="font-display text-lg font-normal">Completed so far</h3>
                <ul className="mt-4 space-y-3">
                  {p.progress.done.map((d) => (
                    <li key={d} className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-accent-3" aria-hidden="true" /> {d}
                    </li>
                  ))}
                </ul>
              </Spotlight>
            </Reveal>
            <Reveal delay={0.1}>
              <Spotlight className="h-full p-7">
                <h3 className="font-display text-lg font-normal">Next milestones</h3>
                <ul className="mt-4 space-y-3">
                  {p.progress.next.map((d) => (
                    <li key={d} className="flex gap-3 text-muted">
                      <Circle className="h-5 w-5 shrink-0 text-white/30" aria-hidden="true" /> {d}
                    </li>
                  ))}
                </ul>
              </Spotlight>
            </Reveal>
          </div>
        </Block>

        )}

        <Reveal>
          <div className="glass flex flex-col items-start justify-between gap-6 rounded-[2rem] p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="font-display text-4xl">Interested in this <em className="text-accent-2">project?</em></h2>
              <p className="mt-2 text-muted">Want to follow its progress or build something similar? Let&apos;s talk.</p>
            </div>
            <Pill href="/#contact" variant="copper" icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
              Get in touch
            </Pill>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
