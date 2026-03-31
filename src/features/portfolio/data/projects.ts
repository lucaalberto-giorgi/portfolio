import type { Project } from "../types/projects";

export const PROJECTS: Project[] = [
  {
    id: "receipt-flow",
    title: "Receipt Flow",
    period: {
      start: "03.2026",
    },
    link: "https://receipt-flow-neon.vercel.app",
    githubLink: "https://github.com/lucaalberto-giorgi/receipt-flow",
    skills: [
      "React",
      "Vite",
      "Tailwind CSS",
      "FastAPI",
      "Python",
      "OpenAI",
      "CSV Export",
      "Analytics",
      "Vercel",
      "Render",
    ],
    description: `An AI-powered receipt processing and expense tracking web application. Users can upload receipts, automatically extract structured data using AI, auto-categorise expenses, search saved entries, view analytics, delete items, and export data to CSV.`,
    preview: "/images/receipt-flow.png",
    isExpanded: true,
  },
  {
    id: "amazon-app",
    title: "Lucazon - Amazon Clone",
    period: {
      start: "01.2025",
    },
    link: "https://amazon-appclone.vercel.app",
    githubLink: "https://github.com/lucaalberto-giorgi/amazon-app",
    skills: [
      "JavaScript",
      "HTML5",
      "CSS3",
      "LocalStorage",
      "Vanilla JS",
      "E-commerce",
      "Vercel",
    ],
    description: `A fully functional Amazon clone built with vanilla JavaScript, HTML, and CSS. Features include product browsing, search functionality, shopping cart, and checkout process with LocalStorage persistence.`,
    preview: "/images/amazon-preview.png",
    isExpanded: true,
  },
];
