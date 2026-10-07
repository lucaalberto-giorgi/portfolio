import { animate, motionValue } from "motion/react";

/*
 * Section links glide the page to their target instead of jumping there.
 * The glide is a spring with no bounce: it eases out of the click, moves
 * quickly through the middle and settles softly. A second click mid-way
 * picks up its speed instead of restarting, and any scrolling by the visitor
 * (wheel, touch, keys) or Back/Forward hands control straight back.
 */

const GLIDE = { type: "spring", visualDuration: 0.6, bounce: 0 } as const;

/**
 * The visitor scrolling the page themselves, or Back/Forward restoring an
 * earlier scroll position, which a running glide would otherwise override.
 */
const INTERRUPT_EVENTS = [
  "wheel",
  "touchstart",
  "keydown",
  "popstate",
] as const;

type Glide = {
  /** The section being glided to, or null for the top of the page. */
  sectionId: string | null;
};

const pageY = motionValue(0);
pageY.on("change", (y) => window.scrollTo(0, y));

let currentGlide: Glide | null = null;
const listeners = new Set<() => void>();

function setGlide(glide: Glide | null) {
  currentGlide = glide;
  listeners.forEach((listener) => listener());
}

/** The glide in progress, if any. */
export function getGlide() {
  return currentGlide;
}

/** Calls `listener` whenever a glide starts or ends. */
export function subscribeToGlide(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function stopGlide() {
  pageY.stop();
  INTERRUPT_EVENTS.forEach((type) =>
    window.removeEventListener(type, stopGlide)
  );
  setGlide(null);
}

function glideTo(
  top: number,
  sectionId: string | null,
  { instant = false } = {}
) {
  const maxTop = document.documentElement.scrollHeight - window.innerHeight;
  // Aiming past either end would leave the spring pushing against the edge.
  const target = Math.min(Math.max(top, 0), maxTop);

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (instant || reduceMotion) {
    if (currentGlide) stopGlide();
    window.scrollTo(0, target);
    return;
  }

  // A fresh glide starts from rest; one already running keeps its speed.
  if (!pageY.isAnimating()) pageY.jump(window.scrollY);

  const glide = { sectionId };
  setGlide(glide);
  INTERRUPT_EVENTS.forEach((type) =>
    window.addEventListener(type, stopGlide, { passive: true })
  );

  animate(pageY, target, {
    ...GLIDE,
    onComplete: () => {
      // A later glide may have taken over from this one.
      if (currentGlide === glide) stopGlide();
    },
  });
}

/** Glides to `section`, leaving room for the sticky header (scroll-margin). */
export function glideToSection(
  section: HTMLElement,
  options?: { instant?: boolean }
) {
  const scrollMargin = parseFloat(getComputedStyle(section).scrollMarginTop);
  const top =
    window.scrollY + section.getBoundingClientRect().top - (scrollMargin || 0);

  glideTo(top, section.id, options);
}

/** Glides back to the top of the page. */
export function glideToTop(options?: { instant?: boolean }) {
  glideTo(0, null, options);
}
