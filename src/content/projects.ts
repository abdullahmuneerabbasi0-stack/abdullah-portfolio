/**
 * Projects shown on the site. Each one gets its own page at /projects/[slug].
 * They are listed in this order, so keep shipped work first.
 *
 * Honesty rule: describe only what really exists. Planned features are
 * labelled "Planned"; never add users, revenue or results that don't exist.
 */

import { ph, type Text } from "./site";

export type ProjectStatus =
  | "Concept"
  | "Planning & architecture"
  | "In development"
  | "Beta"
  | "Live";

export type ProjectFeature = {
  title: string;
  description: string;
  state: "Planned" | "In progress" | "Built";
};

export type Project = {
  slug: string;
  title: string;
  /** One plain sentence: what it is. */
  tagline: string;
  /** Two or three sentences: what exists today. Shown on the home page. */
  summary: string;
  status: ProjectStatus;
  statusDetail?: string;
  category: string;
  technologies: string[];
  liveUrl?: string;
  repoUrl?: string;
  /** Real assets still missing, shown as a marked placeholder. */
  missing?: Text;
  /** "studio" shows the agent-workflow concept diagram. */
  visual?: "studio";
  /** Short, factual bullets about what was built. */
  highlights?: string[];
  problem?: string[];
  plan?: string[];
  features?: ProjectFeature[];
  architecture?: { title: string; description: string }[];
  progress?: { done: string[]; next: string[] };
  /** Dated entries, e.g. from the git history. */
  log?: { date: string; entry: string }[];
};

export const projects: Project[] = [
  {
    slug: "developer-portfolio",
    title: "This portfolio",
    tagline: "The site you're reading. Next.js and TypeScript, deployed on Vercel.",
    summary:
      "First version live in 1 day, finished in 5. Every project page, including this one, is generated from a single TypeScript content file, so adding a project means editing data, not layout code.",
    status: "Live",
    category: "Website",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Motion", "Vercel", "Claude Code"],
    liveUrl: "https://abdullah-portfolio-puce-rho.vercel.app",
    repoUrl: "https://github.com/abdullahmuneerabbasi0-stack/abdullah-portfolio",
    highlights: [
      "Built with the Next.js App Router and deployed on Vercel. Every push to GitHub deploys automatically.",
      "Project pages at /projects/[slug] are generated from one typed content file, so a new project needs no new layout code.",
      "Added a sitemap, robots.txt, an auto-generated link-preview image and structured data so search engines and social apps show it properly.",
    ],
    log: [
      { date: "6 Nov 2026", entry: "Started the Next.js project and deployed the first full version the same day." },
      { date: "10 Nov 2026", entry: "Replaced placeholder text with my real profile, education, skills and contact details." },
      { date: "10 Nov 2026", entry: "Added my photo and a downloadable CV, and matched every line on the site to my resume." },
      { date: "10 Nov 2026", entry: "Rewrote the copy and redesigned the site to remove generic template patterns." },
    ],
  },
  {
    slug: "taskfloe-ai",
    title: "TaskFloe AI",
    tagline: "A task manager I'm building for organising daily tasks.",
    summary:
      "An HTML, CSS and JavaScript front end with a Node.js back end and Supabase (PostgreSQL) for storage. Sign-in, the core task features and the AI part are still being built.",
    status: "In development",
    category: "Full-stack web app",
    technologies: ["HTML", "CSS", "JavaScript", "Node.js", "Supabase"],
    missing: ph("PLACEHOLDER: a screenshot of TaskFloe AI as it is today, and its GitHub link if it can be public"),
    highlights: [
      "A responsive interface in plain HTML, CSS and JavaScript, talking to a Node.js back end.",
      "Supabase (PostgreSQL) stores the data. Sign-in, the main task features and the AI integration are in progress.",
    ],
  },
  {
    slug: "premium-ai-website-studio",
    title: "Premium AI Website Studio",
    tagline: "My plan for a tool that turns a client's answers into a first website draft, using AI agents.",
    summary:
      "Planning stage. I've written the architecture, the feature plan and the security notes, and built early prototypes to test keeping each client's data separate. There is no product yet.",
    status: "Planning & architecture",
    statusDetail: "early prototypes",
    visual: "studio",
    category: "Multi-tenant SaaS idea",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "AI agents"],
    missing: ph("PLACEHOLDER: a photo or scan of your real architecture notes or diagrams"),
    problem: [
      "When a developer builds a site for a client, the first hours go into collecting requirements and rebuilding the same structure every time: pages, layout, and a way for the client to edit content.",
      "AI tools can help with parts of that, but each one is a separate product, and none of them starts from what a particular client actually asked for.",
    ],
    plan: [
      "The client fills in a structured questionnaire, and the answers become a written site plan. Separate AI agents for the front end, back end, database, design and animation work from that plan to produce a first draft, which the developer then edits.",
      "Each finished site gets its own dashboard, with its data kept apart from every other client's. Developers connect their own AI subscriptions, so the platform doesn't pay for everyone's AI usage.",
    ],
    features: [
      {
        title: "Requirements questionnaire",
        description: "Business type, audience, goals, design preferences and required features, turned into a site plan.",
        state: "Planned",
      },
      {
        title: "Draft generation",
        description: "Layouts and components generated from the site plan, and editable afterwards.",
        state: "Planned",
      },
      {
        title: "Separate agents per job",
        description: "One agent each for the front end, back end, database, UI design and animation.",
        state: "Planned",
      },
      {
        title: "A dashboard per client site",
        description: "Content, images, theme and sections managed separately for each site, with isolated data.",
        state: "Planned",
      },
      {
        title: "Per-site chatbot (optional)",
        description: "Answers visitor questions using only that site's own content.",
        state: "Planned",
      },
      {
        title: "Bring your own AI",
        description: "Developers plug in their own AI tools and subscriptions.",
        state: "Planned",
      },
    ],
    architecture: [
      {
        title: "One tenant per client site",
        description: "Every client website is a separate tenant with its own data and access rules, so one client can never see another's content.",
      },
      {
        title: "Agents share one plan",
        description: "The agents work from the same written site plan, so each one only has to handle its own part of the build.",
      },
      {
        title: "Developers bring their own AI",
        description: "Developers connect their own AI providers, which keeps the platform's running costs predictable.",
      },
      {
        title: "Client separation from day one",
        description: "Isolation and access rules are part of the first design, and the early prototypes already test them.",
      },
    ],
    progress: {
      done: [
        "Project documentation",
        "Technical architecture proposals",
        "Development plans",
        "Security notes",
        "Early prototypes and client-separation tests",
      ],
      next: [
        "Keep building the prototype",
        "Build the core platform and client dashboards",
        "Build the requirements questionnaire",
        "Build and connect the first AI agents",
        "Private testing before any public launch",
      ],
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
