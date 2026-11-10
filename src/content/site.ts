/**
 * All website content lives in this folder.
 *
 * Anything wrapped in a `ph()` call is a PLACEHOLDER. It renders on the site
 * with a dashed amber outline so it is easy to spot, and it must be replaced
 * with real content before the link is shared. See PLACEHOLDERS.md.
 *
 * The shapes here mirror the future admin-panel database tables, so pages
 * will not need rewriting when the admin is added after launch.
 */

export type Text = string | { placeholder: string };

/** Mark a piece of text as a placeholder that still needs real content. */
export const ph = (placeholder: string): Text => ({ placeholder });

/**
 * The site's public address, used for SEO and link previews.
 * Set NEXT_PUBLIC_SITE_URL in Vercel when you add a custom domain; until then
 * Vercel's own production URL is picked up automatically at build time.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const profile = {
  name: "Muhammad Abdullah",
  shortName: "Abdullah",
  initials: "MA",
  roles: ["Junior Full-Stack Web Developer"],
  /** The hero sentence. Say what you do and what you want, in plain words. */
  headline: "I'm Abdullah. I build web apps with Next.js and Node.js, and I'm looking for my first developer job.",
  /** Short line under the hero sentence. Real numbers only. */
  intro:
    "This site is the first thing I've shipped: the first version was live in 1 day and finished in 5. Right now I'm building TaskFloe AI, a task manager with a Node.js back end and Supabase.",
  /** Used in search results and link previews. */
  summary:
    "Junior full-stack web developer in Karachi, Pakistan. React, Next.js, TypeScript and Node.js. Open to internships and junior roles.",
  location: "Karachi, Sindh, Pakistan" as Text,
  availability: "Open to internships and junior roles, on-site or remote",
  /** Put the photo at public/profile.jpg and set this to "/profile.jpg". */
  photo: "/profile.jpg" as string | null,
  /** Put the CV in public/ and set this to its path. */
  cv: "/Muhammad_Abdullah_Resume.pdf" as string | null,
  about: [
    "I have a Diploma in Information Technology (DIT) from SZABIST ZABTech iTVE Larkana. The printed certificate is still on its way.",
    "I haven't worked as a developer yet, so everything on this site is my own project work. I'm looking for an internship or a junior role, on-site in Karachi or remote.",
    "Most of what I write is TypeScript and JavaScript: React and Next.js on the front end, Node.js and Supabase on the back end. I use Claude Code, an AI coding assistant, to help me plan and write features.",
    ph("PLACEHOLDER: one sentence, in your own words, on the kind of team or product you want to work on"),
  ] as Text[],
  facts: [
    { label: "Education", value: "DIT, SZABIST ZABTech iTVE Larkana. SSC (Matric)." },
    { label: "Languages", value: "Urdu (native), English (basic working proficiency)" },
    { label: "Based in", value: "Karachi, Sindh, Pakistan" },
  ],
};

/** Small website jobs, shown as one line in Contact. */
export const freelance: Text[] = [
  "I also take small website jobs, like a site for a local business built the same way as this one.",
  ph("PLACEHOLDER: your price range or how you quote, and how long a typical site takes"),
];

/** Shown under the email address in Contact. */
export const replyNote: Text = ph("PLACEHOLDER: how quickly you usually reply, e.g. 'I reply within a day'");

/** Leave a value as null to hide that contact option. */
export const contact = {
  email: "muhammadabdullahabbasi012@gmail.com" as string | null,
  /** Shown as written; the call link uses the digits only. */
  phone: "+92 304 2621504" as string | null,
  /** Digits only, with country code, e.g. "923001234567". Null hides WhatsApp. */
  whatsapp: null as string | null,
  linkedin: "https://www.linkedin.com/in/abdullah-abbasi-56743739a" as string | null,
  github: "https://github.com/abdullahmuneerabbasi0-stack",
  facebook: "https://www.facebook.com/share/1Ducz4AFrR/" as string | null,
  instagram: "https://www.instagram.com/blackpantherwxf" as string | null,
};

export type SkillGroup = { title: string; skills: string[]; usedIn: string };

/** Only list what you have actually learned and used, and say where. */
export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    skills: ["TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3"],
    usedIn: "TypeScript on this site, JavaScript in TaskFloe AI",
  },
  {
    title: "Front end",
    skills: ["React", "Next.js (App Router)", "Tailwind CSS", "Responsive design"],
    usedIn: "This site",
  },
  {
    title: "Back end and data",
    skills: ["Node.js", "Supabase (PostgreSQL)", "API integration"],
    usedIn: "TaskFloe AI",
  },
  {
    title: "Tools",
    skills: ["Git", "GitHub", "Vercel", "VS Code", "Claude Code"],
    usedIn: "This site deploys to Vercel on every push to GitHub",
  },
  {
    title: "Familiar with",
    skills: ["Python", "MySQL"],
    usedIn: "Not used in a project yet",
  },
];

export type Certification = { name: string; issuer: string; year: string; url?: string };

/** Shown in About when not empty. Add your DIT certificate here once you have it. */
export const certifications: Certification[] = [];
