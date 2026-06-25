import type { Experience } from "../types/experiences";

export const EXPERIENCES: Experience[] = [
  {
    id: "affinity",
    companyName: "Affinity (Shipping) LLP",
    companyLogo: "/images/affinity-logo.png",
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
        description: `- Built an **AI-assisted content tool** that generates structured, multi-section web articles from source documents, with an end-to-end authoring, editing, and publishing workflow and a public-facing reader.
- Designed and shipped an internal **recruitment management tool** with candidate tracking, automated email notifications, and AI-assisted CV/role matching.
- Built a native **customer-feedback feature** (React + Supabase), replacing a previous third-party integration.
- Carried out a **code and security review** and authored engineering documentation and technical recommendations.`,
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
    companyLogo: "/images/uel-logo.png",
    invertLogoOnDark: true,
    positions: [
      {
        id: "c47f5903-88ae-4512-8a50-0b91b0cf99b6",
        title: "University of East London",
        employmentPeriod: {
          start: "01.2024",
          end: "2026",
        },
        icon: "education",
        isExpanded: true,
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
