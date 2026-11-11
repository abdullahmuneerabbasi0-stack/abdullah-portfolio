import Image from "next/image";
import type { ResolvedImage, SectionConfig, TestimonialRecord } from "@/lib/content/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Only rendered when real testimonials have been added in the admin panel. */
export function Testimonials({
  section,
  items,
  images,
}: {
  section: SectionConfig;
  items: TestimonialRecord[];
  images: Record<string, ResolvedImage>;
}) {
  if (!items.length) return null;
  return (
    <section id="testimonials" className="section-pad">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} intro={section.intro || undefined} />
        <ul className="grid gap-6 md:grid-cols-2">
          {items.map((t, i) => {
            const img = t.image ? images[t.image] : undefined;
            const who = [t.role, t.company].filter(Boolean).join(", ");
            return (
              <li key={t.name + i}>
                <Reveal delay={(i % 2) * 0.08} className="h-full">
                  <figure className="flex h-full flex-col justify-between rounded-3xl border border-line bg-surface/50 p-8 sm:p-10">
                    <blockquote className="font-display text-2xl leading-snug sm:text-[1.7rem]">
                      <span className="text-accent-2" aria-hidden="true">
                        &ldquo;
                      </span>
                      {t.quote}
                      <span className="text-accent-2" aria-hidden="true">
                        &rdquo;
                      </span>
                    </blockquote>
                    <figcaption className="mt-8 flex items-center gap-4">
                      {img ? (
                        <Image src={img.src} alt={img.alt || t.name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                      ) : (
                        <span className="grid h-12 w-12 place-items-center rounded-full border border-line font-display text-lg italic text-accent-2" aria-hidden="true">
                          {t.name.charAt(0)}
                        </span>
                      )}
                      <span>
                        {t.link ? (
                          <a href={t.link} target="_blank" rel="noopener noreferrer" className="link-underline font-medium">
                            {t.name}
                          </a>
                        ) : (
                          <span className="font-medium">{t.name}</span>
                        )}
                        {who && <span className="block text-sm text-muted">{who}</span>}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
