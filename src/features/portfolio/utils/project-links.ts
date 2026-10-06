import type { Project } from "../types/projects";

/** The live demo URL, or undefined while the project is still in progress. */
export function getDemoLink(project: Project) {
  return project.inProgress ? undefined : project.link;
}

/** Best public URL for a project: the live demo, else its source code. */
export function getPublicLink(project: Project) {
  return getDemoLink(project) ?? project.githubLink;
}
