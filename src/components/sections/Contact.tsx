import type { ReactNode } from "react";
import { ArrowUpRight, Download, Mail, Phone } from "lucide-react";
import { contact, profile } from "@/content/site";
import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon, WhatsappIcon } from "@/components/ui/BrandIcons";
import { Reveal } from "@/components/ui/Reveal";
import { Pill } from "@/components/ui/Pill";
import { SplitText } from "@/components/ui/SplitText";

type Channel = { label: string; value: ReactNode; href: string; icon: ReactNode; external?: boolean };

export function Contact() {
  const all: (Channel | null)[] = [
    contact.email
      ? { label: "Email", value: contact.email, href: `mailto:${contact.email}`, icon: <Mail className="h-5 w-5" /> }
      : null,
    contact.phone
      ? {
          label: "Phone",
          value: contact.phone,
          href: `tel:+${contact.phone.replace(/\D/g, "")}`,
          icon: <Phone className="h-5 w-5" />,
        }
      : null,
    contact.whatsapp
      ? {
          label: "WhatsApp",
          value: "Chat on WhatsApp",
          href: `https://wa.me/${contact.whatsapp}`,
          icon: <WhatsappIcon className="h-5 w-5" />,
          external: true,
        }
      : null,
    contact.linkedin
      ? { label: "LinkedIn", value: "Connect with me", href: contact.linkedin, icon: <LinkedinIcon className="h-5 w-5" />, external: true }
      : null,
    { label: "GitHub", value: "See my code", href: contact.github, icon: <GithubIcon className="h-5 w-5" />, external: true },
    contact.facebook
      ? { label: "Facebook", value: "Follow me", href: contact.facebook, icon: <FacebookIcon className="h-5 w-5" />, external: true }
      : null,
    contact.instagram
      ? { label: "Instagram", value: "Follow me", href: contact.instagram, icon: <InstagramIcon className="h-5 w-5" />, external: true }
      : null,
  ];
  const channels = all.filter((c): c is Channel => c !== null);

  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[70vh] w-[110vw] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(217_138_92/0.16),transparent)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow mb-8 text-accent-2">Contact</p>
        </Reveal>
        <SplitText
          text="Let's build something *remarkable.*"
          className="max-w-5xl font-display text-[3.2rem] leading-[0.98] tracking-[-0.02em] sm:text-7xl lg:text-[7.5rem]"
        />
        <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal delay={0.2} className="md:col-span-6">
            <p className="max-w-md text-lg leading-relaxed text-muted">
              Have a project, an opportunity or an idea? Reach out below and I&apos;ll get back to you.
            </p>
          </Reveal>
          {profile.cv && (
            <Reveal delay={0.3} className="md:col-span-6 md:justify-self-end">
              <Pill href={profile.cv} download variant="solid" icon={<Download className="h-4 w-4" aria-hidden="true" />}>
                Download my CV
              </Pill>
            </Reveal>
          )}
        </div>

        <ul className="mt-20 grid border-t border-line md:grid-cols-2 md:gap-x-10">
          {channels.map((c, i) => (
            <li key={c.label} className="min-w-0 border-b border-line">
              <Reveal delay={(i % 2) * 0.08}>
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group relative isolate flex items-center gap-5 overflow-hidden py-6 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:px-4"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
                  />
                  <span className="text-accent-2 transition-colors duration-500 group-hover:text-ink" aria-hidden="true">
                    {c.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.68rem] uppercase tracking-[0.22em] text-muted transition-colors duration-500 group-hover:text-ink/70">
                      {c.label}
                    </span>
                    <span className="mt-1 block font-display text-2xl break-words transition-colors duration-500 [overflow-wrap:anywhere] group-hover:text-ink sm:text-[1.7rem]">
                      {c.value}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="h-6 w-6 shrink-0 text-muted transition-all duration-500 group-hover:rotate-45 group-hover:text-ink"
                    aria-hidden="true"
                  />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
