import type { SiteData } from "@/lib/content/types";

export type NavLink = { href: string; label: string; sectionId?: string };

/** Sections that would render empty are left out of the menu automatically. */
export function sectionHasContent(data: SiteData, key: string) {
  switch (key) {
    case "skills":
      return data.skillGroups.length > 0 || data.about.interests.length > 0;
    case "services":
      return data.services.length > 0;
    case "projects":
      return data.projects.length > 0;
    case "testimonials":
      return data.testimonials.length > 0;
    case "education":
      return data.about.education.length > 0 || data.about.certifications.length > 0;
    default:
      return true;
  }
}

export function navLinks(data: SiteData): NavLink[] {
  const sections = data.layout.sections
    .filter((s) => s.enabled && s.inNav && sectionHasContent(data, s.key))
    .map((s) => ({ href: `/#${s.key}`, label: s.navLabel, sectionId: s.key }));
  return [...sections, ...data.layout.extraNavLinks.map((l) => ({ href: l.href, label: l.label }))];
}
