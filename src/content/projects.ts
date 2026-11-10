/**
 * Projects shown on the site. Each one gets its own page at /projects/[slug].
 *
 * Honesty rule: describe only what really exists. Planned features are
 * labelled "Planned"; never add users, revenue or results that don't exist.
 */

export type ProjectStatus =
  | "Concept"
  | "Planning & architecture"
  | "In development"
  | "Beta"
  | "Live";

export type ProjectFeature = {
  title: string;
  icon: string;
  description: string;
  points: string[];
  state: "Planned" | "In progress" | "Built";
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  status: ProjectStatus;
  statusDetail?: string;
  flagship?: boolean;
  category: string;
  technologies: string[];
  liveUrl?: string;
  repoUrl?: string;
  /** "studio" shows the agent-workflow concept diagram; otherwise a title panel. */
  visual?: "studio";
  /** Short, factual bullets about what was built. */
  highlights?: string[];
  problem?: string[];
  vision?: string[];
  features?: ProjectFeature[];
  architecture?: { title: string; description: string }[];
  progress?: { done: string[]; next: string[] };
};

export const projects: Project[] = [
  {
    slug: "premium-ai-website-studio",
    title: "Premium AI Website Studio",
    tagline:
      "An AI-powered studio that helps developers create premium, professional websites for their clients.",
    summary:
      "A SaaS platform that guides a client website from structured requirements discovery to AI-assisted generation, customisation and management, using a team of specialised AI agents.",
    status: "In development",
    statusDetail: "Planning & prototype stage",
    flagship: true,
    visual: "studio",
    category: "Multi-tenant AI SaaS concept",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "AI agents", "Multi-tenant architecture"],
    problem: [
      "Building a premium website for a client is slow. Developers spend hours understanding requirements, planning structure, designing layouts, writing components and wiring up content management before any real customisation begins.",
      "AI tools can speed this up, but they are scattered across separate products and rarely understand a specific client's business, audience and design taste.",
    ],
    vision: [
      "Premium AI Website Studio aims to bring the whole process into one place: an AI-powered website development studio where specialised agents collaborate on each project.",
      "It starts by understanding the client, turns that into a website plan, generates professional layouts in the chosen style, and then gives every client website its own secure dashboard for ongoing management.",
    ],
    features: [
      {
        title: "Client requirements discovery",
        icon: "ClipboardList",
        description: "A structured discovery form that captures what the client really needs.",
        points: [
          "Business type, target audience and goals",
          "Design preferences and required features",
          "Generates a website project plan from the answers",
        ],
        state: "Planned",
      },
      {
        title: "AI website generation",
        icon: "Wand2",
        description: "Professional layouts and components generated from the client's requirements.",
        points: [
          "Modern, premium, futuristic, classic and animated styles",
          "Layouts and components tailored to each client",
          "Fully customisable after generation",
        ],
        state: "Planned",
      },
      {
        title: "Specialised AI development agents",
        icon: "Bot",
        description: "A team of focused agents, each responsible for one part of the build.",
        points: [
          "Frontend and backend development agents",
          "Database development agent",
          "UI/UX design and animation agents",
        ],
        state: "Planned",
      },
      {
        title: "Per-client website management",
        icon: "LayoutDashboard",
        description: "A separate dashboard for every client website.",
        points: [
          "Individual settings and customisation",
          "Manage content, images, themes and sections",
          "Isolated client data and secure access",
        ],
        state: "Planned",
      },
      {
        title: "Website-specific AI chatbot",
        icon: "MessageSquare",
        description: "An optional chatbot trained on each website's own content.",
        points: [
          "Separate chatbot configuration per website",
          "Answers visitor questions from site content",
        ],
        state: "Planned",
      },
      {
        title: "Developer handoff",
        icon: "Handshake",
        description: "Built for professional developers who use their own AI tools.",
        points: [
          "Developers connect their own AI tools and subscriptions",
          "No need for the platform to fund every developer's AI usage",
          "Full control to manage and customise generated websites",
        ],
        state: "Planned",
      },
    ],
    architecture: [
      {
        title: "Multi-tenant by design",
        description:
          "Every client website is a separate tenant with isolated data and access rules, so one client can never see another's content.",
      },
      {
        title: "Agent-based workflow",
        description:
          "Specialised agents for frontend, backend, database, design and animation work on a shared project plan instead of one general-purpose prompt.",
      },
      {
        title: "Bring your own AI",
        description:
          "Developers plug in their own AI providers and subscriptions, which keeps platform costs predictable and gives developers freedom of choice.",
      },
      {
        title: "Security first",
        description:
          "Client separation, secure access and data isolation are planned from the start rather than added later.",
      },
    ],
    progress: {
      done: [
        "Project documentation",
        "Technical architecture proposals",
        "Development plans",
        "Security considerations",
        "Early prototypes and client-separation testing",
      ],
      next: [
        "Continue prototype development",
        "Build the core platform and client dashboards",
        "Implement the requirements discovery flow",
        "Develop and integrate the first AI agents",
        "Private testing before any commercial launch",
      ],
    },
  },
];

projects.push(
  {
    slug: "taskfloe-ai",
    title: "TaskFloe AI",
    tagline: "An AI-powered task management app for organising daily tasks.",
    summary:
      "A full-stack web app for organising daily tasks, with a responsive HTML, CSS and JavaScript interface, a Node.js back end and Supabase (PostgreSQL) for data storage.",
    status: "In development",
    category: "Full-stack web app",
    technologies: ["HTML", "CSS", "JavaScript", "Node.js", "Supabase"],
    highlights: [
      "Developing a full-stack web app for organising daily tasks, with a responsive HTML, CSS and JavaScript interface and a Node.js back end.",
      "Integrating Supabase (PostgreSQL) for data storage; user authentication, core task management features and AI integration are in progress.",
    ],
  },
  {
    slug: "developer-portfolio",
    title: "Developer Portfolio Website",
    tagline: "This website: a responsive, animated developer portfolio built with Next.js and deployed on Vercel.",
    summary:
      "A responsive portfolio with a dark glassmorphism design, built and deployed on Vercel in 5 days, with the first working version live in 1 day.",
    status: "Live",
    category: "Website",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Motion", "Vercel", "Claude Code"],
    liveUrl: "https://abdullah-portfolio-puce-rho.vercel.app",
    repoUrl: "https://github.com/abdullahmuneerabbasi0-stack/abdullah-portfolio",
    highlights: [
      "Built and deployed a responsive portfolio on Vercel in 5 days (first working version in 1 day), with 7 page sections built from reusable React components.",
      "Generated project case-study pages at /projects/[slug] from a single typed TypeScript content file using the Next.js App Router, so adding a project needs no new layout code.",
      "Improved search and social sharing by adding an auto-generated sitemap, robots.txt, a dynamic Open Graph preview image and JSON-LD structured data.",
    ],
  },
);

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
