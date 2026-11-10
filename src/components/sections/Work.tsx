import Link from "next/link";
import { projects } from "@/content/projects";
import { T } from "@/components/ui/T";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Status } from "@/components/ui/Status";

/** Projects as a numbered index, shipped work first. */
export function Work() {
  return (
    <Section id="work" number="01" label="Work">
      <ol className="divide-y divide-line border-y border-line">
        {projects.map((p, i) => (
          <li key={p.slug}>
            <Reveal className="grid gap-x-6 gap-y-3 py-8 sm:grid-cols-[2.5rem_1fr]">
              <p className="label pt-1.5 text-accent">{String(i + 1).padStart(2, "0")}</p>
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    <Link href={`/projects/${p.slug}`} className="hover:text-accent">
                      {p.title}
                    </Link>
                  </h2>
                  <Status status={p.status} detail={p.statusDetail} />
                </div>
                <p className="mt-2 text-lg">{p.tagline}</p>
                <p className="mt-2 max-w-[65ch] leading-relaxed text-muted">{p.summary}</p>
                {p.missing && (
                  <p className="mt-3 text-sm">
                    <T value={p.missing} />
                  </p>
                )}
                <p className="mt-4 font-mono text-xs text-muted">{p.technologies.join(" / ")}</p>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
                  <Link href={`/projects/${p.slug}`} className="link">
                    Read the write-up
                  </Link>
                  {p.repoUrl && (
                    <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="link">
                      Source code
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
