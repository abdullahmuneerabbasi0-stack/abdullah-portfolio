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

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://abdullah-abbasi.vercel.app";

export const profile = {
  name: "Abdullah Abbasi",
  shortName: "Abdullah",
  initials: "AA",
  roles: ["Full-Stack Developer", "AI Automation Specialist"],
  headline:
    "I build fast, premium web applications and AI-powered automations that save businesses time.",
  location: ph("City, Country") as Text,
  availability: "Open to new projects and opportunities",
  /** Put the photo at public/profile.jpg and set this to "/profile.jpg". */
  photo: null as string | null,
  /** Put the CV at public/cv.pdf and set this to "/cv.pdf". */
  cv: null as string | null,
  about: [
    "I'm Abdullah Abbasi, a full-stack developer focused on modern web applications and AI automation. I design and build products end to end, from the database and server logic to polished, animated interfaces.",
    ph(
      "Add 2-3 sentences about your background: how long you've been coding, what you've worked on, and what drives you.",
    ),
    "Right now I'm building Premium AI Website Studio, a SaaS platform that uses specialised AI agents to help developers create professional client websites.",
  ] as Text[],
  focus: [
    { label: "Focus", value: "Full-stack web apps" },
    { label: "Specialty", value: "AI automation" },
    { label: "Current project", value: "Premium AI Website Studio" },
  ],
};

export const contact = {
  email: ph("you@example.com") as Text,
  whatsapp: ph("+92 300 0000000") as Text,
  /** Digits only, with country code, for the wa.me link. */
  whatsappLink: null as string | null,
  linkedin: null as string | null,
  github: "https://github.com/abdullahmuneerabbasi0-stack",
};

export type SkillGroup = { title: string; icon: string; skills: string[] };

/** Confirm or edit this list: remove anything you don't use. */
export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    icon: "Layout",
    skills: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML & CSS", "Framer Motion"],
  },
  {
    title: "Backend",
    icon: "Server",
    skills: ["Node.js", "REST APIs", "Server Actions", "Authentication"],
  },
  {
    title: "Databases",
    icon: "Database",
    skills: ["PostgreSQL", "Supabase", "Data modelling"],
  },
  {
    title: "AI & Automation",
    icon: "Bot",
    skills: ["LLM APIs", "AI agents", "Prompt engineering", "Workflow automation", "Chatbots"],
  },
  {
    title: "Tools & DevOps",
    icon: "Wrench",
    skills: ["Git & GitHub", "Vercel", "VS Code", "Figma"],
  },
];

export type Service = {
  title: string;
  icon: string;
  description: string;
  deliverables: string[];
};

export const services: Service[] = [
  {
    title: "Full-Stack Web Applications",
    icon: "Code2",
    description:
      "Custom web apps built with Next.js and TypeScript, from database design to a polished, responsive interface.",
    deliverables: ["Dashboards & SaaS products", "Secure authentication", "Database & API design"],
  },
  {
    title: "AI Automation",
    icon: "Workflow",
    description:
      "Automations that connect your tools and use AI to handle repetitive work, so your team can focus on what matters.",
    deliverables: ["Workflow automation", "AI integrations", "Data processing pipelines"],
  },
  {
    title: "Premium Websites",
    icon: "Sparkles",
    description:
      "Fast, modern websites with premium design and smooth animation that make a strong first impression.",
    deliverables: ["Responsive design", "SEO fundamentals", "Performance optimisation"],
  },
  {
    title: "AI Chatbots",
    icon: "MessageSquare",
    description:
      "Website chatbots that answer questions from your own content, available to your visitors around the clock.",
    deliverables: ["Custom knowledge base", "Website integration", "Brand-matched design"],
  },
];

export type EducationItem = {
  qualification: Text;
  institution: Text;
  period: Text;
  details?: Text;
};

export const education: EducationItem[] = [
  {
    qualification: ph("Degree or qualification"),
    institution: ph("Institution name"),
    period: ph("2020 - 2024"),
    details: ph("Optional: focus area, grade or highlights"),
  },
];

export type Certification = { name: string; issuer: string; year: string; url?: string };

/** Leave empty to hide the certifications block. */
export const certifications: Certification[] = [];
