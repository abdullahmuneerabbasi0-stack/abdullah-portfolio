import type { ReactNode } from "react";
import { contact, freelance, profile, replyNote } from "@/content/site";
import { T } from "@/components/ui/T";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

type Row = { label: string; value: ReactNode; href: string; external?: boolean; download?: boolean };

export function Contact() {
  const rows: Row[] = [
    contact.phone && { label: "Phone", value: contact.phone, href: `tel:+${contact.phone.replace(/\D/g, "")}` },
    contact.whatsapp && { label: "WhatsApp", value: `+${contact.whatsapp}`, href: `https://wa.me/${contact.whatsapp}`, external: true },
    contact.linkedin && { label: "LinkedIn", value: contact.linkedin.replace(/^https:\/\/(www\.)?/, ""), href: contact.linkedin, external: true },
    { label: "GitHub", value: contact.github.replace("https://github.com/", ""), href: contact.github, external: true },
    profile.cv && { label: "CV", value: "Download as PDF", href: profile.cv, download: true },
  ].filter(Boolean) as Row[];

  return (
    <Section id="contact" number="04" label="Contact">
      <Reveal>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Hiring an intern or junior developer in Karachi, or remotely? Email me.</h2>
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="link mt-6 inline-block text-xl font-medium [overflow-wrap:anywhere] sm:text-3xl"
          >
            {contact.email}
          </a>
        )}
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted">
          I&apos;m looking for an internship or a junior developer role, on-site in Karachi or remote.{" "}
          <T value={replyNote} />
        </p>

        <dl className="mt-10 grid border-t border-line">
          {rows.map((r) => (
            <div key={r.label} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="label">{r.label}</dt>
              <dd>
                <a
                  href={r.href}
                  {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...(r.download ? { download: true } : {})}
                  className="link [overflow-wrap:anywhere]"
                >
                  {r.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 max-w-[60ch] leading-relaxed text-muted">
          {freelance.map((f, i) => (
            <span key={i}>
              {i > 0 && " "}
              <T value={f} />
            </span>
          ))}
        </p>
      </Reveal>
    </Section>
  );
}
