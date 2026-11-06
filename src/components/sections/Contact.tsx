import type { ReactNode } from "react";
import { ArrowUpRight, Download, Mail } from "lucide-react";
import { contact, profile } from "@/content/site";
import { T, isPlaceholder } from "@/components/ui/T";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/ui/BrandIcons";
import { Reveal } from "@/components/ui/Reveal";
import { Spotlight } from "@/components/ui/Spotlight";

type Channel = { label: string; value: ReactNode; href: string | null; icon: ReactNode; external?: boolean };

export function Contact() {
  const channels: Channel[] = [
    {
      label: "Email",
      value: <T value={contact.email} />,
      href: isPlaceholder(contact.email) ? null : `mailto:${contact.email as string}`,
      icon: <Mail className="h-5 w-5" />,
    },
    {
      label: "WhatsApp",
      value: <T value={contact.whatsapp} />,
      href: contact.whatsappLink ? `https://wa.me/${contact.whatsappLink}` : null,
      icon: <WhatsappIcon className="h-5 w-5" />,
      external: true,
    },
    {
      label: "LinkedIn",
      value: contact.linkedin ? "Connect with me" : <T value={{ placeholder: "LinkedIn profile URL" }} />,
      href: contact.linkedin,
      icon: <LinkedinIcon className="h-5 w-5" />,
      external: true,
    },
    {
      label: "GitHub",
      value: "See my code",
      href: contact.github,
      icon: <GithubIcon className="h-5 w-5" />,
      external: true,
    },
  ];

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
              Have a project, a role or an idea? Reach out on any channel below and I&apos;ll get back to you.
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
                    {c.href && <ArrowUpRight className="h-5 w-5 text-muted transition group-hover:text-accent-3" />}
                  </>
                );
                return (
                  <li key={c.label}>
                    {c.href ? (
                      <Spotlight className="transition-transform hover:-translate-y-0.5">
                        <a
                          href={c.href}
                          {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="group flex items-center gap-4 p-5"
                        >
                          {inner}
                        </a>
                      </Spotlight>
                    ) : (
                      <div className="glass flex items-center gap-4 rounded-2xl p-5">{inner}</div>
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
