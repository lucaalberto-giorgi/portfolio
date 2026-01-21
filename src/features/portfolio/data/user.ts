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
  website: "http://localhost:1408",
  jobTitle: "Computer Science Student",
  jobs: [
    {
      title: "Student",
      company: "University of East London",
      website: "https://www.uel.ac.uk",
    },
  ],
  about: `
During my studies at University of East London, I've developed a strong foundation in **JavaScript** and **React**, focusing on building interactive web applications and understanding modern frontend development principles.

Through coursework and projects, I've gained hands-on experience with JavaScript fundamentals, ES6+ features, and React's component-based architecture, working on assignments that involved creating dynamic user interfaces and managing state.

I'm passionate about writing clean, maintainable code and continuously learning new technologies, with a growing interest in full-stack development using **Next.js**.
`,
  avatar: "https://assets.chanhdai.com/images/chanhdai-avatar-ghibli.webp",
  ogImage:
    "https://assets.chanhdai.com/images/screenshot-og-image-light.png?v=4",
  namePronunciationUrl: "/audio/chanhdai.mp3",
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
