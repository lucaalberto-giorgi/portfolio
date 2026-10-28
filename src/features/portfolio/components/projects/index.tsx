import { getSectionPin } from "@/config/sections";

import { PROJECTS } from "../../data/projects";
import { getSketchFigure } from "../figures";
import { Section, SectionContent, SectionTitle } from "../section";
import { ProjectItem } from "./project-item";

export function Projects() {
  return (
    <Section id="projects">
      <SectionTitle pin={getSectionPin("projects")}>Projects</SectionTitle>
      <SectionContent>
        {PROJECTS.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            figure={getSketchFigure(project.id)}
          />
        ))}
      </SectionContent>
    </Section>
  );
}
