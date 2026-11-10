import Link from "next/link";
import { contact, profile } from "@/content/site";
import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
        <p>
          © {profile.name}. Built with Next.js and Tailwind CSS.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/#contact" className="hover:text-text">
            Contact
          </Link>
          {contact.github && (
            <a href={contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-text">
              <GithubIcon className="h-5 w-5" />
            </a>
          )}
          {contact.linkedin && (
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-text">
              <LinkedinIcon className="h-5 w-5" />
            </a>
          )}
          {contact.facebook && (
            <a href={contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-text">
              <FacebookIcon className="h-5 w-5" />
            </a>
          )}
          {contact.instagram && (
            <a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-text">
              <InstagramIcon className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
