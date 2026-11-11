import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { services } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Services() {
  return (
    <section id="services" className="relative z-10 rounded-[2rem] bg-bone py-24 text-ink md:rounded-[3rem] md:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Services"
          title="How I can *help*"
          intro="Services I offer to businesses and individuals who want a modern online presence or smarter workflows."
          tone="light"
        />
      </div>
      {/* A swipeable rail on phones, a four-column row on large screens. */}
      <ul className="no-scrollbar mx-auto flex max-w-7xl snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:px-8 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
        {services.map((s, i) => (
          <li key={s.title} className="w-[82%] shrink-0 snap-start sm:w-[60%] md:w-auto">
            <Reveal delay={i * 0.08} className="h-full">
              <article className="group flex h-full min-h-[27rem] flex-col rounded-3xl border border-ink/10 bg-bone-2/60 p-7 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:bg-ink hover:text-bone hover:shadow-2xl hover:shadow-ink/20">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl italic text-[#9a5a35] transition-colors duration-500 group-hover:text-accent-2">
                    0{i + 1}
                  </span>
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 transition-colors duration-500 group-hover:border-bone/20 group-hover:text-accent-2">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-14 font-display text-[1.85rem] leading-[1.05]">{s.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink/65 transition-colors duration-500 group-hover:text-bone/65">
                  {s.description}
                </p>
                <ul className="mt-6 space-y-2">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-sm">
                      <Check className="h-3.5 w-3.5 text-[#9a5a35] group-hover:text-accent-2" aria-hidden="true" /> {d}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/#contact"
                  className="mt-auto inline-flex items-center gap-2 pt-8 text-[0.75rem] font-medium uppercase tracking-[0.16em]"
                >
                  <span className="link-underline pb-0.5">Get a quote</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </Link>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
