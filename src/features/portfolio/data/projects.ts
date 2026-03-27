import type { Project } from "../types/projects";

export const PROJECTS: Project[] = [
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
