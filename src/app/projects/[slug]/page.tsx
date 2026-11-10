import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { contact, profile, siteUrl } from "@/content/site";
import { T } from "@/components/ui/T";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Status } from "@/components/ui/Status";
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

const prose = "max-w-[65ch] space-y-4 text-lg leading-relaxed text-muted";

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
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <header className="px-5 pt-28 pb-14 sm:px-8 md:pt-36 md:pb-20">
        <div className="mx-auto max-w-6xl">
          <Link href="/#work" className="label hover:text-text">
            ← All work
          </Link>
          <Reveal className="mt-8">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Status status={p.status} detail={p.statusDetail} />
              <span className="label">{p.category}</span>
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">{p.title}</h1>
            <p className="mt-5 max-w-[50ch] text-xl leading-relaxed">{p.tagline}</p>
            <p className="mt-3 max-w-[65ch] text-lg leading-relaxed text-muted">{p.summary}</p>
            {(p.liveUrl || p.repoUrl) && (
              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 font-medium">
                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="link">
                    Live site
                  </a>
                )}
                {p.repoUrl && (
                  <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="link">
                    Source code on GitHub
                  </a>
                )}
              </div>
            )}
          </Reveal>
        </div>
      </header>

      {p.status !== "Live" && (
        <Section label="Status">
          <p className="max-w-[65ch] text-lg leading-relaxed">
            {p.title} is my own project and it isn&apos;t released.
            {p.features ? " Everything under Planned features is planned, not built." : ""}
          </p>
          {p.missing && (
            <p className="mt-4 text-sm">
              <T value={p.missing} />
            </p>
          )}
        </Section>
      )}

      {p.highlights && (
        <Section label={p.status === "Live" ? "What I built" : "What exists so far"}>
          <ul className="max-w-[65ch] space-y-4 text-lg leading-relaxed">
            {p.highlights.map((h) => (
              <li key={h} className="border-l-2 border-accent pl-4">
                {h}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {p.log && (
        <Section label="Build log">
          <ol className="border-t border-line">
            {p.log.map((l, i) => (
              <li key={i} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[8rem_1fr] sm:gap-6">
                <span className="label pt-0.5">{l.date}</span>
                <span>{l.entry}</span>
              </li>
            ))}
          </ol>
          {p.repoUrl && (
            <p className="mt-4 text-sm text-muted">
              Every change is in the{" "}
              <a href={`${p.repoUrl}/commits/main`} target="_blank" rel="noopener noreferrer" className="link">
                commit history
              </a>
              .
            </p>
          )}
        </Section>
      )}

      {p.problem && (
        <Section label="The problem">
          <div className={prose}>
            {p.problem.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </Section>
      )}

      {p.plan && (
        <Section label="The plan">
          <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
            <div className={prose}>
              {p.plan.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
            {p.visual === "studio" && <ProjectVisual />}
          </div>
        </Section>
      )}

      {p.features && (
        <Section label="Planned features">
          <dl className="border-t border-line">
            {p.features.map((f) => (
              <div key={f.title} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[16rem_1fr_6rem] sm:gap-6">
                <dt className="font-medium">{f.title}</dt>
                <dd className="text-muted">{f.description}</dd>
                <dd className="label sm:text-right">{f.state}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {p.architecture && (
        <Section label="Architecture">
          <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {p.architecture.map((a, i) => (
              <li key={a.title}>
                <p className="label text-accent">0{i + 1}</p>
                <h3 className="mt-2 text-lg font-semibold">{a.title}</h3>
                <p className="mt-1 text-muted">{a.description}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {p.progress && (
        <Section label="Progress">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="label">Done</h3>
              <ul className="mt-3 space-y-2">
                {p.progress.done.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span className="text-accent" aria-hidden="true">✓</span> {d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="label">Next</h3>
              <ul className="mt-3 space-y-2 text-muted">
                {p.progress.next.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span aria-hidden="true">○</span> {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      )}

      <Section label="Stack">
        <p className="font-mono text-sm">{p.technologies.join(" / ")}</p>
      </Section>

      {contact.email && (
        <Section label="Questions">
          <p className="text-lg">
            Questions about {p.status === "Live" ? "how I built this" : "this project"}? Email me at{" "}
            <a href={`mailto:${contact.email}`} className="link [overflow-wrap:anywhere]">
              {contact.email}
            </a>
            .
          </p>
        </Section>
      )}
    </article>
  );
}
