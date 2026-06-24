import type { Experience } from "../types/experiences";

export const EXPERIENCES: Experience[] = [
  {
    id: "affinity",
    companyName: "Affinity (Shipping) LLP",
    positions: [
      {
        id: "f3a9c1e2-7b54-4d6a-9e21-0a1b2c3d4e5f",
        title: "Software Development Intern",
        employmentPeriod: {
          start: "05.2026",
          end: "06.2026",
        },
        employmentType: "Internship",
        icon: "code",
        isExpanded: true,
        description: `- Built an **AI editorial feature** that turns research-report PDFs into polished, multi-section web briefings — end-to-end back-office generation, editing and publishing plus a dedicated public reader, with source-grounded output and prompt-injection hardening.
- Designed and shipped a **hiring / applicant-tracking workflow** in the back-office: applicant detail pages with HR notes and history, AI CV-to-job scoring with guardrails, automated applicant confirmation emails, and routing of website applications into a trackable pipeline.
- Replaced an off-site third-party form with a **native customer-feedback feature** (React + Supabase) surfaced in a new back-office tab.
- Ran a **codebase audit and security review** on joining, reporting findings with reproduction steps, and authored engineering documentation and a third-party service-cost analysis.`,
        skills: [
          "React",
          "TypeScript",
          "Next.js",
          "FastAPI",
          "Python",
          "Supabase",
          "Sanity",
          "LLM Integration",
          "REST APIs",
        ],
      },
    ],
  },
  {
    id: "education",
    companyName: "Education",
    positions: [
      {
        id: "c47f5903-88ae-4512-8a50-0b91b0cf99b6",
        title: "University of East London",
        employmentPeriod: {
          start: "01.2024",
          end: "2026",
        },
        icon: "education",
        description: `- BSc (Hons) Computer Science — First Class.`,
        skills: [
          "C++",
          "Java",
          "Python",
          "Data Structures",
          "Algorithms",
          "Advanced Databases",
          "Systems Design",
          "Distributed Systems",
          "Software Engineering",
        ],
      },
    ],
  },
];
