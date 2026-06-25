"use client";

import type { Transition, Variants } from "motion/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Children, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

// Vertical "roll" with a soft blur — the outgoing phrase lifts up and dissolves
// while the next one rises into place. Movement is relative to the text's own
// height (%) so it scales with the font size.
const defaultVariants: Variants = {
  initial: { y: "65%", opacity: 0, filter: "blur(5px)" },
  animate: { y: "0%", opacity: 1, filter: "blur(0px)" },
  exit: { y: "-65%", opacity: 0, filter: "blur(5px)" },
};

// easeOutQuint-style curve — quick to settle, gentle landing.
const defaultTransition: Transition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1],
};

// Honor "reduce motion": cross-fade in place, no travel or blur.
const reducedVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const reducedTransition: Transition = { duration: 0.25, ease: "linear" };

type MotionElement = typeof motion.p | typeof motion.span | typeof motion.code;

type Props = {
  as?: MotionElement;
  className?: string;
  children: React.ReactNode[];

  interval?: number;
  transition?: Transition;
  variants?: Variants;

  onIndexChange?: (index: number) => void;
};

export function FlipSentences({
  as: Component = motion.p,
  className,
  children,

  interval = 2,
  transition,
  variants,

  onIndexChange,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const items = Children.toArray(children);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % items.length;
        onIndexChange?.(next);
        return next;
      });
    }, interval * 1000);

    return () => clearInterval(timer);
  }, [items.length, interval, onIndexChange]);

  const activeVariants =
    variants ?? (shouldReduceMotion ? reducedVariants : defaultVariants);
  const activeTransition =
    transition ?? (shouldReduceMotion ? reducedTransition : defaultTransition);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Component
        key={currentIndex}
        className={cn("inline-block will-change-transform", className)}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={activeTransition}
        variants={activeVariants}
      >
        {items[currentIndex]}
      </Component>
    </AnimatePresence>
  );
}
