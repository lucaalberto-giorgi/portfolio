import { PROJECTS } from "../data/projects";
import { PROJECT_SKETCHES } from "./projects/sketches";

/*
 * Figures are numbered down the page, as in a datasheet: the hero chip is
 * Figure 1, the project sketches follow in order, then the education chart.
 */

const FIRST_SKETCH_FIGURE = 2;

const SKETCHED_PROJECTS = PROJECTS.filter(({ id }) => PROJECT_SKETCHES[id]);

/** The figure number of a project's sketch, if it has one. */
export function getSketchFigure(projectId: string) {
  const index = SKETCHED_PROJECTS.findIndex(({ id }) => id === projectId);
  return index === -1 ? undefined : FIRST_SKETCH_FIGURE + index;
}

/** The education results chart comes after every project sketch. */
export const RESULTS_FIGURE = FIRST_SKETCH_FIGURE + SKETCHED_PROJECTS.length;
