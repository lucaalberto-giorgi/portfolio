import { getSectionPin } from "@/config/sections";

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
      <SectionTitle pin={getSectionPin("skills")}>Skills</SectionTitle>
      <SectionContent>
        {/* A table, as on a datasheet: the rows are parallel and scan as such. */}
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full border-collapse text-left text-[15px] leading-6">
            <thead className="bg-muted text-sm text-muted-foreground">
              <tr>
                <th
                  scope="col"
                  className="w-[7.5rem] px-4 py-2.5 font-medium sm:w-36 sm:px-5"
                >
                  Area
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">
                  Technologies
                </th>
              </tr>
            </thead>
            <tbody>
              {SKILL_GROUPS.map((group) => (
                <tr
                  key={group.title}
                  className="border-t border-border align-top"
                >
                  <th scope="row" className="px-4 py-3 font-semibold sm:px-5">
                    {group.title}
                  </th>
                  <td className="px-4 py-3 sm:px-5">
                    {group.items.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionContent>
    </Section>
  );
}
