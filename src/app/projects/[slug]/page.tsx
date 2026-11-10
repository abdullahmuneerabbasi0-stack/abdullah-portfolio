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
import { ProjectVisual } from "@/components/project/ProjectVisual";

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
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-accent-2">{eyebrow}</p>
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
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
        <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text">
          <ArrowLeft className="h-4 w-4" /> All projects
        </Link>

        {/* Hero */}
        <header className="mt-8 grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={p.status} detail={p.statusDetail} />
              <span className="font-mono text-xs uppercase tracking-widest text-muted">{p.category}</span>
            </div>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{p.title}</h1>
            <p className="mt-5 text-xl leading-relaxed text-muted">{p.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="bg-accent-gradient inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-black">
                  Live site <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {p.repoUrl && (
                <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="glass inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold">
                  <GithubIcon className="h-4 w-4" /> Source
                </a>
              )}
              <Link href="/#contact" className="glass inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold hover:bg-white/10">
                Discuss this project <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="glass relative h-96 overflow-hidden rounded-3xl">
              <ProjectVisual />
            </div>
          </Reveal>
        </header>

        {/* Honest status note */}
        <Reveal className="mt-12">
          <div className="rounded-2xl border border-accent-3/30 bg-accent-3/[0.06] p-5 text-sm leading-relaxed text-text/90 sm:p-6">
            <strong className="text-accent-3">Project status:</strong> {p.title} is an ongoing independent project
            {p.statusDetail ? ` currently in the ${p.statusDetail.toLowerCase()}` : ""}. The features below describe the
            planned platform; it has not yet been commercially launched.
          </div>
        </Reveal>

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

        <Block eyebrow="Planned capabilities" title="What the platform will do">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {p.features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.08}>
                <Spotlight as="article" className="flex h-full flex-col p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent-2">
                      <Icon name={f.icon} className="h-5 w-5" />
                    </span>
                    <span className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted">
                      {f.state}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold">{f.title}</h3>
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

        <Block eyebrow="Architecture" title="Key design decisions">
          <div className="grid gap-5 sm:grid-cols-2">
            {p.architecture.map((a, i) => (
              <Reveal key={a.title} delay={(i % 2) * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-surface/60 p-6">
                  <p className="font-mono text-xs text-accent-3">0{i + 1}</p>
                  <h3 className="mt-2 font-display text-lg font-semibold">{a.title}</h3>
                  <p className="mt-2 text-muted">{a.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <p className="mb-3 text-sm text-muted">Planned technologies</p>
            <ul className="flex flex-wrap gap-2">
              {p.technologies.map((t) => (
                <li key={t} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </Block>

        <Block eyebrow="Progress" title="Where it stands today">
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal>
              <Spotlight className="h-full p-7">
                <h3 className="font-display text-lg font-semibold">Completed so far</h3>
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
                <h3 className="font-display text-lg font-semibold">Next milestones</h3>
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

        <Reveal>
          <div className="glass flex flex-col items-start justify-between gap-6 rounded-3xl p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="font-display text-2xl font-bold">Interested in this project?</h2>
              <p className="mt-2 text-muted">Want to follow its progress or build something similar? Let&apos;s talk.</p>
            </div>
            <Link href="/#contact" className="bg-accent-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-black hover:brightness-110">
              Get in touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
