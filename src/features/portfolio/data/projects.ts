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
      "OpenRouter",
      "Supabase",
      "Vercel",
      "pypdf",
      "REST API",
      "TypeScript",
    ],
    description: `My First-Class dissertation project: a full-stack tool that scores a candidate's CV against a job description in real time.

- Built the full stack (React + Vite frontend, FastAPI backend) with a clean upload-and-review interface, deployed as a single Vercel project.
- Extracted CV text from uploaded PDFs and generated text embeddings through OpenRouter to compute a calibrated semantic and keyword match score.
- Surfaced matched skills, missing skills, and an explainable Strong/Moderate/Weak verdict alongside the score, anonymising each CV before scoring and persisting results in Supabase.`,
    preview: "/images/dissertation.webp",
    isExpanded: true,
  },
  {
    id: "forma",
    title: "Forma",
    period: {
      start: "06.2026",
      end: "07.2026",
    },
    link: "https://forma-two-delta.vercel.app",
    githubLink: "https://github.com/lucaalberto-giorgi/forma",
    skills: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "OpenRouter",
      "Claude API",
      "i18n",
      "Vercel",
    ],
    description: `A web app that turns a few questions about your body and goals into a complete, personalised training and nutrition plan in about two minutes.

- Built with Next.js 15 (App Router), React 19, and Tailwind CSS, using Framer Motion for a polished, animated landing page and plan builder.
- Wrote the nutrition engine from scratch, computing Mifflin-St Jeor BMR, TDEE, and goal-based calorie and macro targets alongside an automatic weekly training split.
- Generated meal suggestions with an LLM through OpenRouter, routing simple requests to Claude Haiku and dietary-constrained ones to Claude Sonnet while keeping the macro split as the source of truth, and shipped the interface in four languages.`,
    preview: "/images/forma-banner.webp",
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
    ],
    description: `An AI-powered receipt-processing and expense-tracking app that turns uploaded receipts into structured, searchable data.

- Built with a React + Vite frontend and a FastAPI backend, using OpenAI to extract structured data from uploaded receipts.
- Implemented auto-categorisation, search, analytics, and CSV export across a shared expense workspace with real-time dashboard updates.
- Designed a ledger-inspired interface with numbered entries and review stamps, and added a one-click demo mode that loads sample receipts so the dashboard is never empty on a first visit.`,
    preview: "/images/receipt-flow.webp",
    isExpanded: true,
  },
];
