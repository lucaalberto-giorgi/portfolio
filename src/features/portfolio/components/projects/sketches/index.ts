import type { ComponentType } from "react";

import { CvMatcherSketch } from "./cv-matcher-sketch";
import { ReceiptFlowSketch } from "./receipt-flow-sketch";
import { SlancioSketch } from "./slancio-sketch";

/** A sketch of each project's key moment, keyed by project id. */
export const PROJECT_SKETCHES: Record<
  string,
  ComponentType<{ href?: string }>
> = {
  "dissertation-cv-job-matching": CvMatcherSketch,
  slancio: SlancioSketch,
  "receipt-flow": ReceiptFlowSketch,
};
