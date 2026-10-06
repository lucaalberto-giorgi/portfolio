import { PROJECTS } from "@/features/portfolio/data/projects";
import { getPublicLink } from "@/features/portfolio/utils/project-links";

const content = `# Projects

${PROJECTS.map((item) => {
  const skills =
    item.skills.length > 0 ? `\n\nSkills: ${item.skills.join(", ")}` : "";
  const description = item.description ? `\n\n${item.description.trim()}` : "";
  const link = getPublicLink(item);
  const url = link ? `\n\nProject URL: ${link}` : "";
  return `## ${item.title}${url}${skills}${description}`;
}).join("\n\n")}
`;

export const dynamic = "force-static";

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
