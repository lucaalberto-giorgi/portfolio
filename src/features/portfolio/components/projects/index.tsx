import { PROJECTS } from "../../data/projects";
import { Section, SectionContent, SectionTitle } from "../section";
import { ProjectItem } from "./project-item";

export function Projects() {
  return (
    <Section id="projects">
      <SectionTitle>Projects</SectionTitle>
      <SectionContent>
        {PROJECTS.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </SectionContent>
    </Section>
  );
}
