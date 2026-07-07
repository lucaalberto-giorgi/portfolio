import type { Project } from "../types/projects";

export const PROJECTS: Project[] = [
  {
    id: "dissertation-cv-job-matching",
    title: "AI CV & Job Matching System",
    period: {
      start: "01.2026",
      end: "05.2026",
    },
    link: "https://dissertation-hazel.vercel.app",
    githubLink: "https://github.com/lucaalberto-giorgi/dissertation",
    skills: [
      "React",
      "Vite",
      "FastAPI",
      "Python",
      "OpenAI API",
      "Supabase",
      "pypdf",
      "REST API",
      "TypeScript",
    ],
    description: `My First-Class dissertation project: a full-stack tool that scores a candidate's CV against a job description in real time.

- Built the full stack (React + Vite frontend, FastAPI backend) with a clean upload-and-review interface.
- Extracted CV text from uploaded PDFs and generated OpenAI embeddings to compute semantic + keyword match scores.
- Surfaced matched skills, missing skills, and an AI-generated rationale alongside the overall score, persisting results in Supabase.`,
    preview: "/images/dissertation.webp",
    isExpanded: true,
  },
  {
    id: "receipt-flow",
    title: "Receipt Flow",
    period: {
      start: "03.2026",
      end: "04.2026",
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
    description: `An AI-powered receipt-processing and expense-tracking app that turns uploaded receipts into structured, searchable data.

- Built with a React + Vite frontend and a FastAPI backend, using OpenAI to extract structured data from uploaded receipts.
- Implemented auto-categorisation, search, analytics, and CSV export across a shared expense workspace with real-time dashboard updates.
- Focused on UX resilience with error, loading, and empty states across the upload and review flow.`,
    preview: "/images/receipt-flow.webp",
    isExpanded: true,
  },
  {
    id: "amazon-app",
    title: "Lucazon - Amazon Clone",
    period: {
      start: "01.2025",
      end: "03.2025",
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
    description: `A fully functional Amazon clone built from scratch with no frameworks, as an exercise in core JavaScript and DOM fundamentals.

- Built entirely with vanilla JavaScript, HTML, and CSS.
- Implemented product browsing, search, a shopping cart, and a checkout flow.
- Persisted cart and order state in the browser using LocalStorage.`,
    preview: "/images/amazon-preview.webp",
    isExpanded: true,
  },
];
