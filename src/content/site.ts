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
  roles: ["Full-Stack Developer", "AI Automation Specialist"],
  headline:
    "An ambitious developer building practical digital products and solving business problems through web development, SaaS and AI automation.",
  location: "Pakistan" as Text,
  availability: "Open to projects and opportunities",
  /** Put the photo at public/profile.jpg and set this to "/profile.jpg". */
  photo: "/profile.jpg" as string | null,
  /** Put the CV at public/cv.pdf and set this to "/cv.pdf". */
  cv: "/Muhammad_Abdullah_Resume.pdf" as string | null,
  about: [
    "I'm Muhammad Abdullah, an aspiring full-stack developer from Pakistan. I learn by building practical projects, and I'm growing my skills in web development, SaaS product development and AI automation.",
    "I completed my Diploma in Information Technology (DIT) at SZABIST ZABTech iTVE Larkana. Since then I've been strengthening my foundations in C++, Java, C#, SQL and web development, and using AI-assisted development to plan and build faster.",
    "My main project is Premium AI Website Studio, a SaaS platform I'm designing to help developers create professional client websites with specialised AI agents. It is currently in the planning and prototype stage.",
  ] as Text[],
  focus: [
    { label: "Focus", value: "Web & SaaS development" },
    { label: "Interest", value: "AI automation" },
    { label: "Current project", value: "Premium AI Website Studio" },
  ],
};

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

export type SkillGroup = { title: string; icon: string; skills: string[] };

/** Only list what you have actually learned and used. */
export const skillGroups: SkillGroup[] = [
  {
    title: "Programming languages",
    icon: "Code2",
    skills: ["C++", "Java", "C#"],
  },
  {
    title: "Web development",
    icon: "Layout",
    skills: ["Web development"],
  },
  {
    title: "Databases",
    icon: "Database",
    skills: ["SQL", "Database fundamentals"],
  },
  {
    title: "AI",
    icon: "Bot",
    skills: ["AI-assisted development"],
  },
];

/** Areas you are working towards, shown separately from skills. */
export const interests: string[] = [
  "Full-Stack Web Development",
  "SaaS Product Development",
  "AI Automation",
  "Cybersecurity",
];

export type Service = {
  title: string;
  icon: string;
  description: string;
  deliverables: string[];
};

export const services: Service[] = [
  {
    title: "Custom Website Development",
    icon: "Code2",
    description:
      "Websites built around your specific needs, with a modern, responsive design that works on every device.",
    deliverables: ["Tailored design and layout", "Mobile-friendly pages", "Clean, maintainable code"],
  },
  {
    title: "Business Websites",
    icon: "Layout",
    description:
      "A professional online presence for your business that clearly explains what you offer and how to reach you.",
    deliverables: ["Service and contact pages", "Search-friendly basics", "Fast loading"],
  },
  {
    title: "SaaS Development",
    icon: "Sparkles",
    description:
      "Help turning a software idea into a web-based product, from planning the features to building the first version.",
    deliverables: ["Feature planning", "User dashboards", "Database design"],
  },
  {
    title: "AI Automation Solutions",
    icon: "Workflow",
    description:
      "Using AI tools to automate repetitive tasks and simplify everyday business workflows.",
    deliverables: ["Workflow review", "AI-assisted automations", "Practical, simple setup"],
  },
];

export type EducationItem = {
  qualification: Text;
  institution?: Text;
  period?: Text;
  details?: Text;
};

export const education: EducationItem[] = [
  {
    qualification: "Diploma in Information Technology (DIT)",
    institution: "SZABIST ZABTech iTVE Larkana",
    period: "Completed",
    details: "Physical certificate pending.",
  },
  {
    qualification: "Matriculation",
    period: "Completed",
  },
];

export type Certification = { name: string; issuer: string; year: string; url?: string };

/** Leave empty to hide the certifications block. */
export const certifications: Certification[] = [];
