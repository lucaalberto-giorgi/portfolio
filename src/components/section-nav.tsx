"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  type ComponentProps,
  type MouseEvent,
  type RefObject,
  useEffect,
  useState,
} from "react";

import { cn } from "@/lib/utils";

/** Homepage sections in the header menu; 1-4 jump to them on a keyboard. */
export const SECTIONS = [
  { id: "experience", label: "Experience", hotkey: "1" },
  { id: "projects", label: "Projects", hotkey: "2" },
  { id: "education", label: "Education", hotkey: "3" },
  { id: "skills", label: "Skills", hotkey: "4" },
] as const;

export const SECTION_IDS = SECTIONS.map(({ id }) => id);

/** The dock adds Contact; the header shows it as a button instead. */
export const DOCK_SECTIONS = [
  ...SECTIONS,
  { id: "contact", label: "Contact" },
] as const;

export type DockSectionId = (typeof DOCK_SECTIONS)[number]["id"];

export const DOCK_SECTION_IDS = DOCK_SECTIONS.map(({ id }) => id);

/**
 * Link to a homepage section. Next's Link ignores a click when its URL is
 * already the current one, so after scrolling away, a second click on the
 * same section did nothing; in that case scroll to the section directly.
 */
export function SectionLink({
  sectionId,
  onClick,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { sectionId: string }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    const isPlainClick =
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey;
    const section = document.getElementById(sectionId);

    if (
      event.defaultPrevented ||
      !isPlainClick ||
      !section ||
      window.location.hash !== `#${sectionId}`
    ) {
      return;
    }

    event.preventDefault();
    section.scrollIntoView();
  };

  return <Link href={`/#${sectionId}`} onClick={handleClick} {...props} />;
}

/** Fraction of the viewport height where a section counts as "being read". */
const READING_LINE = 0.3;

/* Active-section indicator: glides between items */
export const PILL = {
  move: { type: "spring", visualDuration: 0.3, bounce: 0.15 } as const,
  fade: { duration: 0.15, ease: "easeOut" } as const,
};

/** Tracks which section sits under the reading line (null between them). */
export function useSectionSpy(ids: readonly string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * READING_LINE;
      let next: string | null = null;

      for (const id of ids) {
        const section = document.getElementById(id);
        if (!section) continue;

        const { top, height } = section.getBoundingClientRect();
        if (top <= line && line < top + height) {
          next = id;
          break;
        }
      }

      // Short final sections never reach the reading line; at the very end
      // of the page, the last one on screen counts as read.
      const atEnd =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      const last = document.getElementById(ids[ids.length - 1]);
      if (
        atEnd &&
        last &&
        last.getBoundingClientRect().top < window.innerHeight
      ) {
        next = last.id;
      }

      setActiveId(next);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ids]);

  return activeId;
}

type ItemRect = { x: number; width: number };

/**
 * Measures the item for `id` inside `listRef` (matched by `data-section`).
 * `snap` is true when the item has just become visible, so a pill can appear
 * in place instead of sliding in from wherever it was last shown.
 */
export function useItemRect(
  listRef: RefObject<HTMLElement | null>,
  id: string | null
) {
  const [state, setState] = useState<{
    rect: ItemRect;
    visible: boolean;
    snap: boolean;
  }>({ rect: { x: 0, width: 0 }, visible: false, snap: true });

  useEffect(() => {
    const measure = () => {
      const item = id
        ? listRef.current?.querySelector<HTMLElement>(`[data-section="${id}"]`)
        : null;

      setState((previous) => {
        // Hidden at this breakpoint (no width) or nothing to point at.
        if (!item || item.offsetWidth === 0) {
          return { ...previous, visible: false };
        }

        return {
          rect: { x: item.offsetLeft, width: item.offsetWidth },
          visible: true,
          snap: !previous.visible,
        };
      });
    };

    measure();
    window.addEventListener("resize", measure);

    return () => window.removeEventListener("resize", measure);
  }, [listRef, id]);

  return state;
}

/** Highlight that sits behind the item at `rect`. */
export function SectionPill({
  rect,
  visible,
  snap,
  reduceMotion,
  className,
}: {
  rect: ItemRect;
  visible: boolean;
  snap: boolean;
  reduceMotion: boolean;
  className?: string;
}) {
  const instant = reduceMotion || snap;

  return (
    <motion.li
      aria-hidden
      className={cn("pointer-events-none absolute left-0", className)}
      initial={false}
      animate={{ x: rect.x, width: rect.width, opacity: visible ? 1 : 0 }}
      transition={{
        x: instant ? { duration: 0 } : PILL.move,
        width: instant ? { duration: 0 } : PILL.move,
        opacity: reduceMotion ? { duration: 0 } : PILL.fade,
      }}
    />
  );
}
