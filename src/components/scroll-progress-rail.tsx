"use client";

import { motion, useReducedMotion, useScroll } from "motion/react";

/**
 * A slim vertical progress line in the homepage right gutter that fills as you
 * scroll, balancing the ScrollClimber on the left. Decorative + ambient: hidden
 * below xl, aria-hidden, pointer-events-none. Under reduced motion it shows a
 * static full line instead of tracking scroll.
 */
export function ScrollProgressRail() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-1/2 right-[calc(50%_-_35rem)] z-40 hidden h-[70vh] w-[6px] -translate-y-1/2 overflow-hidden rounded-full bg-foreground/10 xl:block"
    >
      <motion.div
        className="h-full w-full origin-top rounded-full bg-foreground/70"
        style={{ scaleY: reduce ? 1 : scrollYProgress }}
      />
    </div>
  );
}
