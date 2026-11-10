import { certifications, profile } from "@/content/site";
import { T } from "@/components/ui/T";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function About() {
  return (
    <Section id="about" number="02" label="About">
      <Reveal>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Where I am right now</h2>
        <div className="mt-6 max-w-[62ch] space-y-4 text-lg leading-relaxed text-muted">
          {profile.about.map((p, i) => (
            <p key={i}>
              <T value={p} />
            </p>
          ))}
        </div>
        <dl className="mt-10 grid border-t border-line text-sm">
          {profile.facts.map((f) => (
            <div key={f.label} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="label">{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
          {certifications.map((c) => (
            <div key={c.name} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="label">Certificate</dt>
              <dd>
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="link">
                    {c.name}
                  </a>
                ) : (
                  c.name
                )}
                , {c.issuer}, {c.year}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
