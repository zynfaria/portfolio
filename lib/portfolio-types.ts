export interface Profile {
  name: string;
  role: string;
  headline: string;
  intro: string;
  about: string;
  email: string;
  githubUrl: string;
  resumeUrl: string;
  resumeSummary: string;
  skills: string[];
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  title: string;
  category: string;
  description: string;
  tags: string[];
  imageUrls?: string[];
  imageUrl: string;
  projectUrl: string;
  sourceUrl: string;
}

export interface ContentRecord<T> {
  id: string;
  data: T;
  position: number;
}

export interface PortfolioContent {
  profile: Profile;
  experiences: ContentRecord<Experience>[];
  projects: ContentRecord<Project>[];
}

export const defaultProfile: Profile = {
  name: "Jose Berrios",
  role: "Full-stack software engineer",
  headline: "I build digital experiences that work.",
  intro:
    "I’m Jose — a software engineer working across frontend, backend, e-commerce, and AI. I turn ideas into useful, well-crafted products.",
  about:
    "My work spans the full web development process: shaping frontend experiences, building backend services, creating e-commerce stores with Shopify, and integrating AI into products. I care about making technology feel clear, useful, and dependable.",
  email: "",
  githubUrl: "https://github.com/zynfaria",
  resumeUrl: "",
  resumeSummary: "",
  skills: [
    "Frontend: React · Next.js · TypeScript",
    "Styling: Tailwind CSS · Responsive UI",
    "Backend: APIs · Server-side logic",
    "Commerce: Shopify · E-commerce",
    "AI: AI APIs · Product integrations",
    "Workflow: Git · GitHub · Deployment",
  ],
};

export const defaultProjects: Project[] = [
  {
    title: "Commerce experiences",
    category: "E-commerce · Shopify",
    description:
      "Custom storefronts and e-commerce journeys shaped around business needs.",
    tags: ["Shopify", "React", "E-commerce"],
    imageUrl: "",
    projectUrl: "",
    sourceUrl: "",
  },
  {
    title: "End-to-end web products",
    category: "Web application · Full stack",
    description:
      "Responsive applications connecting polished interfaces with dependable backend systems.",
    tags: ["Next.js", "APIs", "Database"],
    imageUrl: "",
    projectUrl: "",
    sourceUrl: "",
  },
  {
    title: "AI in everyday workflows",
    category: "AI · Product integration",
    description:
      "Product features that use AI to make existing experiences more capable and useful.",
    tags: ["AI", "Integrations", "Automation"],
    imageUrl: "",
    projectUrl: "",
    sourceUrl: "",
  },
];
