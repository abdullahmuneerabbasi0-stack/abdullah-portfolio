import { contact, profile } from "@/content/site";
import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

export function Footer() {
  const socials = [
    { label: "GitHub", href: contact.github, icon: GithubIcon },
    { label: "LinkedIn", href: contact.linkedin, icon: LinkedinIcon },
    { label: "Facebook", href: contact.facebook, icon: FacebookIcon },
    { label: "Instagram", href: contact.instagram, icon: InstagramIcon },
  ].filter((s): s is typeof s & { href: string } => Boolean(s.href));

  return (
    <footer className="border-t border-line px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 text-sm text-muted sm:flex-row sm:items-center">
        <p>
          {profile.name}, Karachi.{" "}
          <a
            href="https://github.com/abdullahmuneerabbasi0-stack/abdullah-portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            This site&apos;s code is on GitHub
          </a>
          .
        </p>
        <ul className="flex items-center gap-5">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="hover:text-accent">
                <s.icon className="h-5 w-5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
