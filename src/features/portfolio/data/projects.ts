import type { Project } from "../types/projects";

export const PROJECTS: Project[] = [
  {
    id: "dissertation-cv-job-matching",
    title: "AI CV & Job Matching System",
    period: {
      start: "01.2026",
      end: "05.2026",
    },
    logo: "/images/project-logos/cv-matcher.svg",
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
    isExpanded: true,
  },
  {
    id: "forma",
    title: "Forma",
    // Ongoing while in progress; add `end` back when it ships.
    period: {
      start: "06.2026",
    },
    logo: "/images/project-logos/forma.svg",
    link: "https://forma-two-delta.vercel.app",
    // The repo is private, so a GitHub link would 404 for visitors. Restore
    // `githubLink: "https://github.com/lucaalberto-giorgi/forma"` once public.
    inProgress: true,
    skills: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "PostgreSQL",
      "Claude API",
      "Zod",
      "Framer Motion",
      "Vercel",
    ],
    description: `A coaching app for personal trainers. Coaches manage their clients' programmes, sessions, check-ins, and messages in one place, and each client follows their plan from an app on their phone.

- Built with Next.js, React, TypeScript, and Tailwind CSS on Supabase (EU), with coach and client accounts, invite links, row-level security on every table, and realtime sync so messages arrive in under a second.
- Wrote a client attention system that flags inactivity, low adherence, strength plateaus, and pain reports, and turns them into programme proposals that must pass code checks (load limits, library exercises only) before the coach approves them.
- Added Claude features through Anthropic's API with structured outputs: reply drafts in the coach's voice, triage of client messages and check-ins, AI-assisted rescheduling, and programme edits from plain-language requests, with daily usage caps.`,
    isExpanded: true,
  },
  {
    id: "receipt-flow",
    title: "Receipt Flow",
    period: {
      start: "03.2026",
      end: "04.2026",
    },
    logo: "/images/project-logos/receipt-flow.svg",
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
    isExpanded: true,
  },
];
