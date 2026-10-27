"use client";

import { animate } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/** How much of a sketch must be on screen before it plays. */
const VISIBLE_THRESHOLD = 0.45;

/**
 * Plays a sketch's storyboard once, the first time it scrolls into view.
 * `timeline` holds the time (ms) each stage starts; the returned `stage` is
 * how many have started. With reduced motion it goes straight to the end.
 */
export function useSketchStage(timeline: readonly number[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const timers: number[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setStage(timeline.length);
          return;
        }

        timeline.forEach((startsAt, index) => {
          timers.push(window.setTimeout(() => setStage(index + 1), startsAt));
        });
      },
      { threshold: VISIBLE_THRESHOLD }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [timeline]);

  /** Props that switch an element to its "after" state from `stageIndex`. */
  const at = (stageIndex: number) => ({ "data-on": stage >= stageIndex });

  return { ref, stage, at };
}

/**
 * Frame for a project sketch, in the product's own palette. It is a picture
 * of the product, so it is hidden from assistive tech (the project text says
 * the same) and opens the live demo for pointer users only; the Live demo
 * button is the keyboard path.
 */
export function SketchStage({
  href,
  label,
  stageRef,
  palette,
  className,
  children,
}: {
  href?: string;
  label: string;
  stageRef: React.Ref<HTMLDivElement>;
  /** The product's colours as CSS variables, for its parts to use. */
  palette: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}) {
  const frame = (
    <div
      ref={stageRef}
      style={palette}
      data-sketch
      className={cn(
        "@container relative h-80 overflow-hidden rounded-2xl ring-1 ring-foreground/8 select-none",
        "transition-[box-shadow] duration-150 ease-out [@media(hover:hover)]:group-hover/stage:ring-foreground/25",
        "supports-corner-shape:rounded-[2rem] supports-corner-shape:corner-squircle",
        className
      )}
    >
      {children}
    </div>
  );

  if (!href) {
    return <div aria-hidden>{frame}</div>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      tabIndex={-1}
      aria-hidden
      title={label}
      className="group/stage block transition-[scale] duration-150 ease-snappy active:scale-[0.99]"
    >
      {frame}
    </a>
  );
}

/** A number that counts up to `to` once `on` turns true. */
export function CountUp({
  to,
  on,
  duration = 0.9,
  className,
}: {
  to: number;
  on: boolean;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !on) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = String(to);
      return;
    }

    const controls = animate(0, to, {
      duration,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (value) => {
        node.textContent = String(Math.round(value));
      },
    });

    return () => controls.stop();
  }, [on, to, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      0
    </span>
  );
}
