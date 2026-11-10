import { Award, ExternalLink, GraduationCap } from "lucide-react";
import { certifications, education } from "@/content/site";
import { T } from "@/components/ui/T";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Spotlight } from "@/components/ui/Spotlight";

export function Education() {
  return (
    <section id="education" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Education" title={certifications.length ? "Education & certifications" : "Education"} />
        <div className={`grid gap-8 ${certifications.length ? "lg:grid-cols-2" : ""}`}>
          <ol className="relative space-y-5 border-l border-white/10 pl-8">
            {education.map((e, i) => (
              <li key={i} className="relative">
                <span className="bg-accent-gradient absolute top-6 -left-[41px] grid h-5 w-5 place-items-center rounded-full ring-4 ring-bg" aria-hidden="true" />
                <Reveal delay={i * 0.08}>
                  <Spotlight className="p-6">
                    <div className="flex items-start gap-4">
                      <GraduationCap className="mt-1 h-6 w-6 shrink-0 text-accent-2" aria-hidden="true" />
                      <div>
                        {e.period && (
                          <p className="font-mono text-xs uppercase tracking-widest text-accent-3">
                            <T value={e.period} />
                          </p>
                        )}
                        <h3 className="mt-2 font-display text-xl font-semibold">
                          <T value={e.qualification} />
                        </h3>
                        {e.institution && (
                          <p className="mt-1 text-muted">
                            <T value={e.institution} />
                          </p>
                        )}
                        {e.details && (
                          <p className="mt-3 text-sm text-muted">
                            <T value={e.details} />
                          </p>
                        )}
                      </div>
                    </div>
                  </Spotlight>
                </Reveal>
              </li>
            ))}
          </ol>
          {certifications.length > 0 && (
            <ul className="grid content-start gap-4">
              {certifications.map((c, i) => (
                <Reveal key={c.name} delay={i * 0.06}>
                  <Spotlight as="li" className="flex items-center gap-4 p-5">
                    <Award className="h-6 w-6 shrink-0 text-accent-3" aria-hidden="true" />
                    <div className="flex-1">
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-sm text-muted">
                        {c.issuer} · {c.year}
                      </p>
                    </div>
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-accent-2 hover:text-accent-3" aria-label={`Verify ${c.name}`}>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </Spotlight>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
