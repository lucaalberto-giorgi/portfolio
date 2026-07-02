import type { User } from "@/features/portfolio/types/user";

export const USER = {
  firstName: "Luca",
  lastName: "Giorgi",
  displayName: "Luca Alberto Giorgi",
  username: "lucagiorgi",
  gender: "male",
  pronouns: "he/him",
  bio: "First Class Computer Science graduate and full-stack developer building web apps with React, TypeScript & Next.js — based in London, open to junior roles.",
  flipSentences: [
    "First Class CS grad building for the web",
    "I ship full-stack apps with React & Next.js",
    "Currently working with AI-powered products",
    "Open to junior frontend or full-stack roles",
  ],
  address: "London, United Kingdom",
  phoneNumber: "KzQ0NzQyNDk3MjM5MQ==", // E.164 format, base64 encoded (+447424972391)
  email: "bHVjYWxiZXJ0by5naW9yZ2kyMDA0QGdtYWlsLmNvbQ==", // base64 encoded (lucalberto.giorgi2004@gmail.com)
  website: "https://www.lucagiorgi.com",
  jobTitle: "Full-Stack Developer",
  jobs: [
    {
      title: "Graduate",
      company: "University of East London",
      website: "https://www.uel.ac.uk",
    },
  ],
  about: `
I'm a First Class Computer Science graduate focused on frontend and full-stack development. I build clean, responsive web applications with **React**, **TypeScript**, and **Next.js**, with an emphasis on practical projects, readable code, and user-focused design.

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
    "first class computer science",
    "full-stack developer",
    "react developer",
    "typescript developer",
    "next.js developer",
    "junior developer london",
    "university of east london",
    "uel",
  ],
  dateCreated: "2024-01-01", // YYYY-MM-DD
} satisfies User;
