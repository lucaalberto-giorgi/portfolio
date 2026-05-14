import type { User } from "@/features/portfolio/types/user";

export const USER = {
  firstName: "Luca",
  lastName: "Giorgi",
  displayName: "Luca Alberto Giorgi",
  username: "lucagiorgi",
  gender: "male",
  pronouns: "he/him",
  bio: "Third year Computer Science student at University of East London.",
  flipSentences: [
    "Third year Computer Science student at University of East London.",
    "Computer Science Student",
    "Software Developer",
  ],
  address: "London, United Kingdom",
  phoneNumber: "KzQ0NzQyNDk3MjM5MQ==", // E.164 format, base64 encoded (+447424972391)
  email: "bHVjYWxiZXJ0by5naW9yZ2kyMDA0QGdtYWlsLmNvbQ==", // base64 encoded (lucalberto.giorgi2004@gmail.com)
  website: "https://www.lucagiorgi.com",
  jobTitle: "Computer Science Student",
  jobs: [
    {
      title: "Student",
      company: "University of East London",
      website: "https://www.uel.ac.uk",
    },
  ],
  about: `
I'm a Computer Science graduate focused on frontend and full-stack development. I build clean, responsive web applications with **React**, **TypeScript**, and **Next.js**, with an emphasis on practical projects, readable code, and user-focused design.

My recent work includes portfolio projects and an AI-powered CV/job matching system, combining frontend development with backend APIs and AI features. I'm now looking for junior frontend or full-stack opportunities where I can contribute to real products and keep improving.
`,
  avatar: "/images/avatar.png",
  ogImage: "https://www.lucagiorgi.com/og?title=Luca%20Alberto%20Giorgi",
  namePronunciationUrl: "/audio/luca-intro.mp3",
  timeZone: "Europe/London",
  keywords: [
    "lucagiorgi",
    "luca alberto giorgi",
    "luca giorgi",
    "computer science student",
    "university of east london",
    "uel",
    "software developer",
  ],
  dateCreated: "2024-01-01", // YYYY-MM-DD
} satisfies User;
