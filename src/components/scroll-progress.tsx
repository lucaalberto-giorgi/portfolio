"use client";

import { motion, useScroll, useSpring } from "motion/react";

/* Reading progress */
const PROGRESS = {
  // Light spring so trackpad jitter doesn't make the line stutter.
  spring: { stiffness: 300, damping: 40, restDelta: 0.001 },
};

/** Hairline along the header's bottom edge, filled left to right as the page scrolls. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, PROGRESS.spring);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left bg-foreground/60"
      style={{ scaleX }}
    />
  );
}
