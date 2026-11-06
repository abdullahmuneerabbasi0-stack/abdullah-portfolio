import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { services } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Spotlight } from "@/components/ui/Spotlight";

export function Services() {
  return (
    <section id="services" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Services"
          title="How I can help"
          intro="From idea to launch, I build the product and the automation behind it."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 2) * 0.1}>
              <Spotlight as="article" className="group flex h-full flex-col p-7 transition-transform duration-300 hover:-translate-y-1">
                <span className="bg-accent-gradient mb-6 grid h-12 w-12 place-items-center rounded-2xl text-black shadow-lg shadow-accent/20">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{s.description}</p>
                <ul className="mt-5 space-y-2">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-sm text-text/90">
                      <Check className="h-4 w-4 text-accent-3" aria-hidden="true" /> {d}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/#contact"
                  className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-accent-2 hover:text-accent-3"
                >
                  Get a quote <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
