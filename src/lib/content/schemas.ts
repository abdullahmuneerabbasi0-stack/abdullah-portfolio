/**
 * Validators for every editable piece of content. The server runs these on
 * each save, so nothing unvalidated is ever stored, whatever the browser sends.
 */
import {
  Ctx,
  bool,
  color,
  email,
  imageRef,
  int,
  link,
  list,
  obj,
  oneOf,
  slugify,
  strings,
  text,
  webUrl,
  type Parsed,
} from "@/lib/validate";
import {
  BODY_FONTS,
  DISPLAY_FONTS,
  SECTION_KEYS,
  type AppearanceSettings,
  type CollectionKey,
  type CollectionMap,
  type ProjectRecord,
  type SectionConfig,
  type SettingsKey,
  type SettingsMap,
} from "./types";
import { DARK_COLORS, defaultSettings } from "./defaults";
import { ICON_NAMES } from "./icons";

const PROJECT_STATUSES = ["Concept", "Planning & architecture", "In development", "Beta", "Live"] as const;
const FEATURE_STATES = ["Planned", "In progress", "Built"] as const;

function hero(v: unknown): Parsed<SettingsMap["hero"]> {
  const c = new Ctx();
  const o = obj(v);
  const cv = obj(o.cv);
  const value: SettingsMap["hero"] = {
    name: text(c, o.name, "name", { max: 80, required: true, label: "Full name" }),
    shortName: text(c, o.shortName, "shortName", { max: 40, required: true, label: "Short name" }),
    initials: text(c, o.initials, "initials", { max: 4, required: true, label: "Initials" }),
    role: text(c, o.role, "role", { max: 80, required: true, label: "Role" }),
    location: text(c, o.location, "location", { max: 120, label: "Location" }),
    availability: text(c, o.availability, "availability", { max: 140, label: "Availability" }),
    headline: text(c, o.headline, "headline", { max: 400, required: true, label: "Description", multiline: true }),
    photo: imageRef(c, o.photo, "photo"),
    photoAlt: text(c, o.photoAlt, "photoAlt", { max: 200, label: "Alt text" }),
    ctas: list(c, o.ctas, "ctas", 4, (item, p, i) => {
      const b = obj(item);
      return {
        id: text(c, b.id, `${p}.id`, { max: 40 }) || `cta-${i}`,
        label: text(c, b.label, `${p}.label`, { max: 40, required: true, label: "Button label" }),
        href: link(c, b.href, `${p}.href`, { required: true, label: "Button link" }),
        style: oneOf(c, b.style, `${p}.style`, ["solid", "outline", "copper"] as const, "solid"),
        enabled: bool(b.enabled),
      };
    }, "Buttons"),
    cv: {
      enabled: bool(cv.enabled),
      url: link(c, cv.url, "cv.url", { label: "CV link" }),
      label: text(c, cv.label, "cv.label", { max: 40, label: "CV label" }) || "Download CV",
    },
    focus: list(c, o.focus, "focus", 4, (item, p) => {
      const f = obj(item);
      return {
        label: text(c, f.label, `${p}.label`, { max: 30, required: true, label: "Label" }),
        value: text(c, f.value, `${p}.value`, { max: 60, required: true, label: "Value" }),
      };
    }, "Quick facts"),
  };
  if (value.cv.enabled && !value.cv.url) c.fail("cv.url", "Add a CV link or turn the CV button off.");
  return c.result(value);
}

function about(v: unknown): Parsed<SettingsMap["about"]> {
  const c = new Ctx();
  const o = obj(v);
  const value: SettingsMap["about"] = {
    paragraphs: list(c, o.paragraphs, "paragraphs", 6, (p, path) => text(c, p, path, { max: 1200, multiline: true, label: "Paragraph" })).filter(Boolean),
    pillars: list(c, o.pillars, "pillars", 6, (item, p) => {
      const x = obj(item);
      return {
        title: text(c, x.title, `${p}.title`, { max: 60, required: true, label: "Title" }),
        text: text(c, x.text, `${p}.text`, { max: 240, required: true, label: "Text", multiline: true }),
      };
    }),
    facts: list(c, o.facts, "facts", 6, (item, p) => {
      const x = obj(item);
      const auto = x.auto === "projects" ? ("projects" as const) : null;
      return {
        value: auto ? 0 : int(c, x.value, `${p}.value`, { min: 0, max: 100000, label: "Number" }),
        unit: text(c, x.unit, `${p}.unit`, { max: 20, label: "Unit" }),
        label: text(c, x.label, `${p}.label`, { max: 80, required: true, label: "Label" }),
        auto,
      };
    }),
    interests: strings(c, o.interests, "interests", { max: 16, itemMax: 60, label: "Interest" }),
    education: list(c, o.education, "education", 12, (item, p) => {
      const x = obj(item);
      return {
        qualification: text(c, x.qualification, `${p}.qualification`, { max: 140, required: true, label: "Qualification" }),
        institution: text(c, x.institution, `${p}.institution`, { max: 140, label: "Institution" }),
        period: text(c, x.period, `${p}.period`, { max: 60, label: "Period" }),
        details: text(c, x.details, `${p}.details`, { max: 300, label: "Details", multiline: true }),
      };
    }),
    certifications: list(c, o.certifications, "certifications", 20, (item, p) => {
      const x = obj(item);
      return {
        name: text(c, x.name, `${p}.name`, { max: 140, required: true, label: "Certificate name" }),
        issuer: text(c, x.issuer, `${p}.issuer`, { max: 100, required: true, label: "Issuer" }),
        year: text(c, x.year, `${p}.year`, { max: 20, label: "Year" }),
        url: webUrl(c, x.url, `${p}.url`, "Verification link"),
      };
    }),
  };
  if (value.paragraphs.length === 0) c.fail("paragraphs", "Add at least one paragraph.");
  return c.result(value);
}

function contact(v: unknown): Parsed<SettingsMap["contact"]> {
  const c = new Ctx();
  const o = obj(v);
  const f = obj(o.form);
  const whatsapp = text(c, o.whatsapp, "whatsapp", { max: 20, label: "WhatsApp" }).replace(/\D/g, "");
  if (whatsapp && (whatsapp.length < 8 || whatsapp.length > 15)) c.fail("whatsapp", "Enter the number with country code, digits only.");
  const value: SettingsMap["contact"] = {
    email: email(c, o.email, "email"),
    phone: text(c, o.phone, "phone", { max: 30, label: "Phone" }),
    whatsapp,
    linkedin: webUrl(c, o.linkedin, "linkedin", "LinkedIn"),
    github: webUrl(c, o.github, "github", "GitHub"),
    facebook: webUrl(c, o.facebook, "facebook", "Facebook"),
    instagram: webUrl(c, o.instagram, "instagram", "Instagram"),
    heading: text(c, o.heading, "heading", { max: 120, required: true, label: "Heading" }),
    intro: text(c, o.intro, "intro", { max: 400, label: "Intro", multiline: true }),
    form: {
      enabled: bool(f.enabled),
      title: text(c, f.title, "form.title", { max: 80, label: "Form title" }) || "Send a message",
      intro: text(c, f.intro, "form.intro", { max: 300, label: "Form intro", multiline: true }),
      successMessage:
        text(c, f.successMessage, "form.successMessage", { max: 300, label: "Success message" }) ||
        "Thanks, your message has been sent.",
    },
  };
  if (value.phone && !/^\+?[\d\s()-]{5,}$/.test(value.phone)) c.fail("phone", "Use digits, spaces, brackets or dashes only.");
  return c.result(value);
}

function layout(v: unknown): Parsed<SettingsMap["layout"]> {
  const c = new Ctx();
  const o = obj(v);
  const footer = obj(o.footer);
  const cta = obj(o.navCta);
  const defaults = defaultSettings.layout.sections;
  const seen = new Set<string>();
  const given = list(c, o.sections, "sections", SECTION_KEYS.length, (item, p): SectionConfig | null => {
    const s = obj(item);
    const key = oneOf(c, s.key, `${p}.key`, SECTION_KEYS, "about");
    if (seen.has(key)) return null;
    seen.add(key);
    return {
      key,
      enabled: bool(s.enabled),
      inNav: bool(s.inNav),
      navLabel: text(c, s.navLabel, `${p}.navLabel`, { max: 30, required: true, label: "Menu label" }),
      eyebrow: text(c, s.eyebrow, `${p}.eyebrow`, { max: 40, label: "Small label" }),
      title: text(c, s.title, `${p}.title`, { max: 120, label: "Title" }),
      intro: text(c, s.intro, `${p}.intro`, { max: 300, label: "Intro", multiline: true }),
    };
  }).filter((s): s is SectionConfig => s !== null);
  // Any section missing from the payload keeps its default so nothing vanishes by accident.
  for (const d of defaults) if (!seen.has(d.key)) given.push({ ...d });

  // Safety rules: the hero always shows first, and contact can never be switched
  // off together with every way of reaching it.
  const heroIdx = given.findIndex((s) => s.key === "hero");
  const [heroSection] = given.splice(heroIdx, 1);
  heroSection.enabled = true;
  heroSection.inNav = false;
  const sections = [heroSection, ...given];

  const value: SettingsMap["layout"] = {
    sections,
    navCta: {
      enabled: bool(cta.enabled),
      label: text(c, cta.label, "navCta.label", { max: 30, label: "Button label" }) || "Hire me",
      href: link(c, cta.href, "navCta.href", { label: "Button link" }) || "/#contact",
    },
    extraNavLinks: list(c, o.extraNavLinks, "extraNavLinks", 4, (item, p) => {
      const l = obj(item);
      return {
        label: text(c, l.label, `${p}.label`, { max: 30, required: true, label: "Label" }),
        href: link(c, l.href, `${p}.href`, { required: true }),
      };
    }, "Extra links"),
    footer: {
      text: text(c, footer.text, "footer.text", { max: 200, label: "Footer text" }),
      links: list(c, footer.links, "footer.links", 8, (item, p) => {
        const l = obj(item);
        return {
          label: text(c, l.label, `${p}.label`, { max: 30, required: true, label: "Label" }),
          href: link(c, l.href, `${p}.href`, { required: true }),
        };
      }, "Footer links"),
      showWordmark: bool(footer.showWordmark),
      showSocials: bool(footer.showSocials),
      showBackToTop: bool(footer.showBackToTop),
    },
  };
  const navCount = sections.filter((s) => s.enabled && s.inNav).length + value.extraNavLinks.length;
  if (navCount === 0) c.fail("sections", "Keep at least one link in the menu so visitors can find their way around.");
  return c.result(value);
}

function appearance(v: unknown): Parsed<AppearanceSettings> {
  const c = new Ctx();
  const o = obj(v);
  const col = obj(o.colors);
  const fonts = obj(o.fonts);
  const fx = obj(o.effects);
  const motion = obj(o.motion);
  const header = obj(o.header);
  const value: AppearanceSettings = {
    mode: oneOf(c, o.mode, "mode", ["dark", "light"] as const, "dark"),
    colors: {
      accent: color(c, col.accent, "colors.accent", DARK_COLORS.accent),
      accent2: color(c, col.accent2, "colors.accent2", DARK_COLORS.accent2),
      bg: color(c, col.bg, "colors.bg", DARK_COLORS.bg),
      surface: color(c, col.surface, "colors.surface", DARK_COLORS.surface),
      text: color(c, col.text, "colors.text", DARK_COLORS.text),
      muted: color(c, col.muted, "colors.muted", DARK_COLORS.muted),
      panel: color(c, col.panel, "colors.panel", DARK_COLORS.panel),
      panelText: color(c, col.panelText, "colors.panelText", DARK_COLORS.panelText),
    },
    fonts: {
      display: oneOf(c, fonts.display, "fonts.display", DISPLAY_FONTS, "Cormorant Garamond"),
      body: oneOf(c, fonts.body, "fonts.body", BODY_FONTS, "Inter"),
    },
    buttons: oneOf(c, o.buttons, "buttons", ["pill", "rounded", "square"] as const, "pill"),
    corners: oneOf(c, o.corners, "corners", ["sharp", "soft", "round"] as const, "round"),
    spacing: oneOf(c, o.spacing, "spacing", ["compact", "comfortable", "spacious"] as const, "comfortable"),
    effects: { particles: bool(fx.particles), glow: bool(fx.glow), grain: bool(fx.grain) },
    motion: {
      level: oneOf(c, motion.level, "motion.level", ["full", "minimal"] as const, "full"),
      loader: bool(motion.loader),
      pageTransitions: bool(motion.pageTransitions),
    },
    header: { hideOnScroll: bool(header.hideOnScroll), blur: bool(header.blur), showName: bool(header.showName) },
  };
  return c.result(value);
}

export const settingsParsers: { [K in SettingsKey]: (v: unknown) => Parsed<SettingsMap[K]> } = {
  hero,
  about,
  contact,
  layout,
  appearance,
};

// Collections -------------------------------------------------------------------

function project(v: unknown): Parsed<ProjectRecord> {
  const c = new Ctx();
  const o = obj(v);
  const title = text(c, o.title, "title", { max: 100, required: true, label: "Title" });
  const slug = slugify(text(c, o.slug, "slug", { max: 80 }) || title);
  if (!slug) c.fail("slug", "Add a web address for this project (letters, numbers and dashes).");
  const para = (x: unknown, p: string) => text(c, x, p, { max: 1200, multiline: true, label: "Paragraph" });
  const progress = obj(o.progress);
  const value: ProjectRecord = {
    slug,
    title,
    tagline: text(c, o.tagline, "tagline", { max: 240, required: true, label: "Short description" }),
    summary: text(c, o.summary, "summary", { max: 1200, required: true, label: "Summary", multiline: true }),
    status: oneOf(c, o.status, "status", PROJECT_STATUSES, "In development"),
    statusDetail: text(c, o.statusDetail, "statusDetail", { max: 60, label: "Status detail" }) || undefined,
    flagship: bool(o.flagship),
    category: text(c, o.category, "category", { max: 60, required: true, label: "Category" }),
    technologies: strings(c, o.technologies, "technologies", { max: 20, itemMax: 40, label: "Technology" }),
    liveUrl: webUrl(c, o.liveUrl, "liveUrl", "Live website") || undefined,
    repoUrl: webUrl(c, o.repoUrl, "repoUrl", "GitHub link") || undefined,
    visual: o.visual === "studio" ? "studio" : undefined,
    cover: imageRef(c, o.cover, "cover") || undefined,
    coverAlt: text(c, o.coverAlt, "coverAlt", { max: 200, label: "Alt text" }) || undefined,
    highlights: strings(c, o.highlights, "highlights", { max: 12, itemMax: 400, label: "Highlight" }),
    problem: list(c, o.problem, "problem", 6, para).filter(Boolean),
    vision: list(c, o.vision, "vision", 6, para).filter(Boolean),
    features: list(c, o.features, "features", 12, (item, p) => {
      const f = obj(item);
      return {
        title: text(c, f.title, `${p}.title`, { max: 80, required: true, label: "Feature title" }),
        icon: oneOf(c, f.icon, `${p}.icon`, ICON_NAMES, "Sparkles"),
        description: text(c, f.description, `${p}.description`, { max: 300, label: "Description" }),
        points: strings(c, f.points, `${p}.points`, { max: 8, itemMax: 160, label: "Point" }),
        state: oneOf(c, f.state, `${p}.state`, FEATURE_STATES, "Planned"),
      };
    }),
    architecture: list(c, o.architecture, "architecture", 8, (item, p) => {
      const a = obj(item);
      return {
        title: text(c, a.title, `${p}.title`, { max: 80, required: true, label: "Title" }),
        description: text(c, a.description, `${p}.description`, { max: 400, label: "Description", multiline: true }),
      };
    }),
    progress: {
      done: strings(c, progress.done, "progress.done", { max: 12, itemMax: 160 }),
      next: strings(c, progress.next, "progress.next", { max: 12, itemMax: 160 }),
    },
  };
  // Drop empty optional blocks so the case-study page hides them.
  for (const k of ["highlights", "problem", "vision", "features", "architecture"] as const)
    if (!value[k]?.length) delete value[k];
  if (!value.progress?.done.length && !value.progress?.next.length) delete value.progress;
  return c.result(value);
}

function service(v: unknown): Parsed<CollectionMap["services"]> {
  const c = new Ctx();
  const o = obj(v);
  return c.result({
    title: text(c, o.title, "title", { max: 80, required: true, label: "Title" }),
    icon: oneOf(c, o.icon, "icon", ICON_NAMES, "Sparkles"),
    description: text(c, o.description, "description", { max: 500, required: true, label: "Description", multiline: true }),
    deliverables: strings(c, o.deliverables, "deliverables", { max: 8, itemMax: 80, label: "Deliverable" }),
    image: imageRef(c, o.image, "image") || undefined,
    imageAlt: text(c, o.imageAlt, "imageAlt", { max: 200, label: "Alt text" }) || undefined,
  });
}

function skill(v: unknown): Parsed<CollectionMap["skills"]> {
  const c = new Ctx();
  const o = obj(v);
  const value = {
    title: text(c, o.title, "title", { max: 60, required: true, label: "Category name" }),
    icon: oneOf(c, o.icon, "icon", ICON_NAMES, "Sparkles"),
    description: text(c, o.description, "description", { max: 300, label: "Description", multiline: true }),
    showProficiency: bool(o.showProficiency),
    skills: list(c, o.skills, "skills", 30, (item, p) => {
      const s = obj(item);
      const raw = s.level;
      const level = raw === null || raw === undefined || raw === "" ? null : int(c, raw, `${p}.level`, { min: 0, max: 100, label: "Level" });
      return { name: text(c, s.name, `${p}.name`, { max: 50, required: true, label: "Skill name" }), level };
    }, "Skills"),
  };
  if (value.skills.length === 0) c.fail("skills", "Add at least one skill.");
  return c.result(value);
}

function testimonial(v: unknown): Parsed<CollectionMap["testimonials"]> {
  const c = new Ctx();
  const o = obj(v);
  return c.result({
    name: text(c, o.name, "name", { max: 80, required: true, label: "Name" }),
    role: text(c, o.role, "role", { max: 80, label: "Role" }),
    company: text(c, o.company, "company", { max: 80, label: "Company" }),
    quote: text(c, o.quote, "quote", { max: 800, required: true, label: "Testimonial", multiline: true }),
    image: imageRef(c, o.image, "image") || undefined,
    link: webUrl(c, o.link, "link", "Profile link") || undefined,
  });
}

export const collectionParsers: { [K in CollectionKey]: (v: unknown) => Parsed<CollectionMap[K]> } = {
  projects: project,
  services: service,
  skills: skill,
  testimonials: testimonial,
};

/** Title column stored alongside the JSON for each collection. */
export const collectionTitle = <K extends CollectionKey>(key: K, data: CollectionMap[K]): string =>
  key === "testimonials" ? (data as CollectionMap["testimonials"]).name : (data as { title: string }).title;
