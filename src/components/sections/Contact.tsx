import type { ReactNode } from "react";
import { ArrowUpRight, Download, Mail } from "lucide-react";
import { contact, profile } from "@/content/site";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/ui/BrandIcons";
import { Reveal } from "@/components/ui/Reveal";
import { Spotlight } from "@/components/ui/Spotlight";

type Channel = { label: string; value: ReactNode; href: string; icon: ReactNode; external?: boolean };

export function Contact() {
  const all: (Channel | null)[] = [
    contact.email
      ? { label: "Email", value: contact.email, href: `mailto:${contact.email}`, icon: <Mail className="h-5 w-5" /> }
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
  ];
  const channels = all.filter((c): c is Channel => c !== null);

  return (
    <section id="contact" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-16">
            <div aria-hidden="true" className="bg-accent-gradient absolute -top-32 -right-32 h-80 w-80 rounded-full opacity-20 blur-3xl" />
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-accent-2">Contact</p>
            <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Let&apos;s build something <span className="text-gradient">remarkable</span>.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Have a project, an opportunity or an idea? Reach out below and I&apos;ll get back to you.
            </p>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {channels.map((c) => {
                const inner = (
                  <>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-2">{c.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-muted">{c.label}</span>
                      <span className="block truncate font-medium">{c.value}</span>
                    </span>
                    {<ArrowUpRight className="h-5 w-5 text-muted transition group-hover:text-accent-3" />}
                  </>
                );
                return (
                  <li key={c.label}>
                    {(
                      <Spotlight className="transition-transform hover:-translate-y-0.5">
                        <a
                          href={c.href}
                          {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="group flex items-center gap-4 p-5"
                        >
                          {inner}
                        </a>
                      </Spotlight>
                    )}
                  </li>
                );
              })}
            </ul>

            {profile.cv && (
              <a
                href={profile.cv}
                download
                className="bg-accent-gradient mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-black hover:brightness-110"
              >
                <Download className="h-4 w-4" /> Download my CV
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
