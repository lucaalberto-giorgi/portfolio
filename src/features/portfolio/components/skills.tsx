import { Section, SectionContent, SectionTitle } from "./section";

// Full, categorised stack (kept in sync with the CV). Everything here is
// evidenced by the experience, projects, or education above, no filler.
const SKILL_GROUPS: { title: string; items: string[] }[] = [
  {
    title: "Frontend",
    items: [
      "React",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Vite",
    ],
  },
  {
    title: "Backend",
    items: ["FastAPI (Python)", "REST APIs"],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "Next.js", "Supabase", "Sanity"],
  },
  {
    title: "AI",
    items: ["LLM Integration", "OpenAI API", "NLP Fundamentals"],
  },
];

export function Skills() {
  return (
    <Section id="skills">
      <SectionTitle>Skills</SectionTitle>
      <SectionContent>
        <dl className="grid gap-x-6 text-[15px] leading-7 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-y-2">
          {SKILL_GROUPS.map((group) => (
            <div key={group.title} className="contents">
              <dt className="text-muted-foreground">{group.title}</dt>
              <dd className="mb-3 sm:mb-0">{group.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </SectionContent>
    </Section>
  );
}
