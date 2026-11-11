/**
 * The shape of everything the admin panel can edit.
 *
 * Image fields hold an "image reference": either a path to a file in
 * public/ (for example "/profile.jpg") or "media:<id>" for an image in the
 * media library. `resolveImage()` turns either into a URL.
 */
import type { Project } from "@/content/projects";

export type ImageRef = string;

export type Cta = {
  id: string;
  label: string;
  href: string;
  style: "solid" | "outline" | "copper";
  enabled: boolean;
};

export type HeroSettings = {
  name: string;
  shortName: string;
  initials: string;
  role: string;
  location: string;
  availability: string;
  headline: string;
  photo: ImageRef;
  photoAlt: string;
  ctas: Cta[];
  cv: { enabled: boolean; url: string; label: string };
  focus: { label: string; value: string }[];
};

export type EducationEntry = { qualification: string; institution: string; period: string; details: string };
export type CertificationEntry = { name: string; issuer: string; year: string; url: string };

export type AboutSettings = {
  paragraphs: string[];
  pillars: { title: string; text: string }[];
  /** `auto: "projects"` shows the live count of published projects. */
  facts: { value: number; unit: string; label: string; auto?: "projects" | null }[];
  interests: string[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
};

export type ContactSettings = {
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  github: string;
  facebook: string;
  instagram: string;
  heading: string;
  intro: string;
  form: { enabled: boolean; title: string; intro: string; successMessage: string };
};

export const SECTION_KEYS = ["hero", "about", "skills", "services", "projects", "testimonials", "education", "contact"] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export type SectionConfig = {
  key: SectionKey;
  enabled: boolean;
  inNav: boolean;
  navLabel: string;
  eyebrow: string;
  title: string;
  intro: string;
};

export type LinkItem = { label: string; href: string };

export type LayoutSettings = {
  sections: SectionConfig[];
  navCta: { enabled: boolean; label: string; href: string };
  extraNavLinks: LinkItem[];
  footer: {
    text: string;
    links: LinkItem[];
    showWordmark: boolean;
    showSocials: boolean;
    showBackToTop: boolean;
  };
};

export const DISPLAY_FONTS = ["Cormorant Garamond", "Playfair Display", "Fraunces", "DM Serif Display"] as const;
export const BODY_FONTS = ["Inter", "Manrope", "DM Sans", "Space Grotesk"] as const;

export type AppearanceSettings = {
  mode: "dark" | "light";
  colors: {
    accent: string;
    accent2: string;
    bg: string;
    surface: string;
    text: string;
    muted: string;
    panel: string;
    panelText: string;
  };
  fonts: { display: (typeof DISPLAY_FONTS)[number]; body: (typeof BODY_FONTS)[number] };
  buttons: "pill" | "rounded" | "square";
  corners: "sharp" | "soft" | "round";
  spacing: "compact" | "comfortable" | "spacious";
  effects: { particles: boolean; glow: boolean; grain: boolean };
  motion: { level: "full" | "minimal"; loader: boolean; pageTransitions: boolean };
  header: { hideOnScroll: boolean; blur: boolean; showName: boolean };
};

export type SettingsMap = {
  hero: HeroSettings;
  about: AboutSettings;
  contact: ContactSettings;
  layout: LayoutSettings;
  appearance: AppearanceSettings;
};
export type SettingsKey = keyof SettingsMap;
export const SETTINGS_KEYS: SettingsKey[] = ["hero", "about", "contact", "layout", "appearance"];

/** A project as stored by the admin panel (extends the original content type). */
export type ProjectRecord = Project & { cover?: ImageRef; coverAlt?: string };

export type ServiceRecord = {
  title: string;
  icon: string;
  description: string;
  deliverables: string[];
  image?: ImageRef;
  imageAlt?: string;
};

export type SkillRecord = {
  title: string;
  icon: string;
  description: string;
  showProficiency: boolean;
  skills: { name: string; level: number | null }[];
};

export type TestimonialRecord = {
  name: string;
  role: string;
  company: string;
  quote: string;
  image?: ImageRef;
  link?: string;
};

/** A row of any collection, as the admin panel sees it. */
export type Row<T> = {
  id: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  data: T;
};

export type CollectionMap = {
  projects: ProjectRecord;
  services: ServiceRecord;
  skills: SkillRecord;
  testimonials: TestimonialRecord;
};
export type CollectionKey = keyof CollectionMap;

export type ResolvedImage = { src: string; alt: string; width?: number; height?: number };

/** Everything the public site needs to render, after drafts are filtered out. */
export type SiteData = SettingsMap & {
  projects: (ProjectRecord & { id?: string })[];
  services: (ServiceRecord & { id?: string })[];
  skillGroups: (SkillRecord & { id?: string })[];
  testimonials: (TestimonialRecord & { id?: string })[];
  images: Record<string, ResolvedImage>;
  source: "database" | "files";
  preview: boolean;
};
