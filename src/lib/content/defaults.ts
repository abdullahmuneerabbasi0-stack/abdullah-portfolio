/**
 * Default content, built from the original files in src/content/.
 *
 * Used in two places:
 *  - as the site's content while no database is configured, so the public
 *    site keeps working exactly as before;
 *  - as the first copy written to the database when the admin is set up.
 */
import {
  certifications,
  contact,
  education,
  interests,
  profile,
  services,
  skillGroups,
} from "@/content/site";
import { projects } from "@/content/projects";
import { plain } from "@/components/ui/T";
import type {
  AppearanceSettings,
  ServiceRecord,
  SettingsMap,
  SkillRecord,
  TestimonialRecord,
  ProjectRecord,
} from "./types";

const hero: SettingsMap["hero"] = {
  name: profile.name,
  shortName: profile.shortName,
  initials: profile.initials,
  role: profile.roles[0] ?? "",
  location: plain(profile.location),
  availability: profile.availability,
  headline: profile.headline,
  photo: profile.photo ?? "",
  photoAlt: `Portrait of ${profile.name}`,
  ctas: [
    { id: "projects", label: "View projects", href: "/#projects", style: "solid", enabled: true },
    { id: "hire", label: "Hire me", href: "/#contact", style: "outline", enabled: true },
  ],
  cv: { enabled: !!profile.cv, url: profile.cv ?? "", label: "Download CV" },
  focus: profile.focus.map((f) => ({ label: f.label, value: f.value })),
};

const about: SettingsMap["about"] = {
  paragraphs: profile.about.map(plain),
  pillars: [
    { title: "Learning by building", text: "I grow my skills through practical projects, not just tutorials." },
    { title: "AI-assisted development", text: "I use AI tools to plan, build and ship projects faster." },
    { title: "Business-focused", text: "I care about technology that solves real business problems." },
  ],
  facts: [
    { value: 5, unit: "days", label: "to build and deploy this portfolio", auto: null },
    { value: 1, unit: "day", label: "to its first working version", auto: null },
    { value: 7, unit: "sections", label: "built from reusable React components", auto: null },
    { value: projects.length, unit: "projects", label: "live or in active development", auto: "projects" },
  ],
  interests: [...interests],
  education: education.map((e) => ({
    qualification: plain(e.qualification),
    institution: e.institution ? plain(e.institution) : "",
    period: e.period ? plain(e.period) : "",
    details: e.details ? plain(e.details) : "",
  })),
  certifications: certifications.map((c) => ({ ...c, url: c.url ?? "" })),
};

const contactSettings: SettingsMap["contact"] = {
  email: contact.email ?? "",
  phone: contact.phone ?? "",
  whatsapp: contact.whatsapp ?? "",
  linkedin: contact.linkedin ?? "",
  github: contact.github ?? "",
  facebook: contact.facebook ?? "",
  instagram: contact.instagram ?? "",
  heading: "Let's *talk.*",
  intro: "Hiring for an internship or junior role, or have a question about my work? Reach out below and I'll get back to you.",
  form: {
    // Off until the database exists, because messages need somewhere to go.
    enabled: false,
    title: "Send a message",
    intro: "Prefer a form? Write here and it comes straight to my inbox.",
    successMessage: "Thanks for reaching out. I'll reply as soon as I can.",
  },
};

const layout: SettingsMap["layout"] = {
  sections: [
    { key: "hero", enabled: true, inNav: false, navLabel: "Home", eyebrow: "", title: "", intro: "" },
    { key: "about", enabled: true, inNav: true, navLabel: "About", eyebrow: "About me", title: "An ambitious developer on a *building* *journey*", intro: "" },
    { key: "skills", enabled: true, inNav: true, navLabel: "Skills", eyebrow: "Skills", title: "Technical *skills*", intro: "The languages, frameworks and tools I build with." },
    {
      key: "services",
      enabled: true,
      inNav: true,
      navLabel: "Services",
      eyebrow: "Services",
      title: "How I can *help*",
      intro: "Services I offer to businesses and individuals who want a modern online presence or smarter workflows.",
    },
    {
      key: "projects",
      enabled: true,
      inNav: true,
      navLabel: "Projects",
      eyebrow: "Featured projects",
      title: "What I'm *building*",
      intro: "Projects presented honestly: what exists today, and where each one is heading.",
    },
    // Hidden until real testimonials are added in the admin panel.
    { key: "testimonials", enabled: true, inNav: false, navLabel: "Testimonials", eyebrow: "Testimonials", title: "Kind *words*", intro: "" },
    { key: "education", enabled: true, inNav: true, navLabel: "Education", eyebrow: "Education", title: "*Education*", intro: "" },
    { key: "contact", enabled: true, inNav: true, navLabel: "Contact", eyebrow: "Contact", title: "", intro: "" },
  ],
  navCta: { enabled: true, label: "Hire me", href: "/#contact" },
  extraNavLinks: [],
  footer: {
    text: `© ${profile.name}. Built with Next.js and Tailwind CSS.`,
    links: [{ label: "Contact", href: "/#contact" }],
    showWordmark: true,
    showSocials: true,
    showBackToTop: true,
  },
};

export const DARK_COLORS: AppearanceSettings["colors"] = {
  accent: "#d98a5c",
  accent2: "#e39b6e",
  bg: "#0c0a09",
  surface: "#151210",
  text: "#f1ebe0",
  muted: "#a69c8f",
  panel: "#ece5d8",
  panelText: "#0c0a09",
};

export const LIGHT_COLORS: AppearanceSettings["colors"] = {
  accent: "#b8683c",
  accent2: "#a65a30",
  bg: "#f4efe6",
  surface: "#ebe3d6",
  text: "#1a1512",
  muted: "#6b6157",
  panel: "#16120f",
  panelText: "#f1ebe0",
};

const appearance: AppearanceSettings = {
  mode: "dark",
  colors: DARK_COLORS,
  fonts: { display: "Cormorant Garamond", body: "Inter" },
  buttons: "pill",
  corners: "round",
  spacing: "comfortable",
  effects: { particles: true, glow: true, grain: true },
  motion: { level: "full", loader: true, pageTransitions: true },
  header: { hideOnScroll: true, blur: true, showName: true },
};

export const defaultSettings: SettingsMap = { hero, about, contact: contactSettings, layout, appearance };

export const defaultProjects: ProjectRecord[] = projects.map((p) => ({ ...p }));

export const defaultServices: ServiceRecord[] = services.map((s) => ({ ...s, deliverables: [...s.deliverables] }));

export const defaultSkills: SkillRecord[] = skillGroups.map((g) => ({
  title: g.title,
  icon: g.icon,
  description: "",
  showProficiency: false,
  skills: g.skills.map((name) => ({ name, level: null })),
}));

/** Never pre-filled: testimonials must come from real people. */
export const defaultTestimonials: TestimonialRecord[] = [];
