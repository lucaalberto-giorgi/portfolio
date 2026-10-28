import type { ComponentType } from "react";

import { CvMatcherSketch } from "./cv-matcher-sketch";
import { ReceiptFlowSketch } from "./receipt-flow-sketch";
import { SlancioSketch } from "./slancio-sketch";

type ProjectSketch = {
  Sketch: ComponentType<{ href?: string }>;
  /**
   * What the sketch shows, as a figure caption. The sketch itself is hidden
   * from assistive tech, so this is also its text description.
   */
  caption: string;
};

/** A sketch of each project's key moment, keyed by project id. */
export const PROJECT_SKETCHES: Record<string, ProjectSketch> = {
  "dissertation-cv-job-matching": {
    Sketch: CvMatcherSketch,
    caption:
      "A CV scored against a job description, with the skills it matches and the one it misses.",
  },
  // Slancio is not on the market yet: say what the sketch is, not what the
  // product does.
  slancio: {
    Sketch: SlancioSketch,
    caption:
      "Slancio's AI at work. The product details stay private until launch.",
  },
  "receipt-flow": {
    Sketch: ReceiptFlowSketch,
    caption:
      "A receipt scanned, posted to the ledger, filed under Food and stamped as reviewed.",
  },
};
