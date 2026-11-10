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
  problem: string[];
  vision: string[];
  features: ProjectFeature[];
  architecture: { title: string; description: string }[];
  progress: { done: string[]; next: string[] };
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
    category: "SaaS · AI",
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

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
