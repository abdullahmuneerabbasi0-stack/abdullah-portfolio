import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { contact, profile } from "@/content/site";
import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

export function Footer() {
  const socials = [
    { href: contact.github, label: "GitHub", Icon: GithubIcon },
    { href: contact.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: contact.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: contact.instagram, label: "Instagram", Icon: InstagramIcon },
  ].filter((s): s is { href: string; label: string; Icon: typeof GithubIcon } => !!s.href);

  return (
    <footer className="overflow-hidden border-t border-line px-5 pt-16 pb-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-end">
          <div className="flex flex-wrap items-center gap-3">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-ink"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-6 text-[0.75rem] uppercase tracking-[0.18em] text-muted">
            <Link href="/#contact" className="link-underline pb-0.5 hover:text-text">
              Contact
            </Link>
            <Link href="/#top" className="group inline-flex items-center gap-2 hover:text-text">
              Back to top
              <ArrowUp className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-1" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="mt-14 font-display text-[15.5vw] leading-[0.85] tracking-[-0.03em] whitespace-nowrap text-text/90 lg:text-[13.4rem]"
        >
          {profile.shortName}
          <em className="text-accent-2">.</em>
        </p>

        <div className="mt-8 flex flex-col justify-between gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row">
          <p>© {profile.name}. Built with Next.js and Tailwind CSS.</p>
          <p>{typeof profile.location === "string" ? profile.location : ""}</p>
        </div>
      </div>
    </footer>
  );
}
