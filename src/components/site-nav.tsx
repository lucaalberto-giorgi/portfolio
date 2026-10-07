"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { cn } from "@/lib/utils";

import { SectionLink } from "./same-page-link";
import {
  PILL,
  SECTION_IDS,
  SECTIONS,
  useItemRect,
  useSectionSpy,
} from "./section-nav";

/* ─────────────────────────────────────────────────────────
 * INTERACTION STORYBOARD (header menu, sm and up)
 *
 *  scroll      the section under the reading line turns ink and an
 *              underline on the header's edge glides to it (spring)
 *  scroll      outside the four sections (intro, GitHub, contact):
 *              the underline fades out where it is
 *  hover       label turns ink and a faint underline appears (150ms)
 *  press 1-4   jumps straight to that section (no animation on
 *              keyboard actions; the underline follows)
 *
 *  Phones use the bottom dock instead (MobileDock).
 * ───────────────────────────────────────────────────────── */

const HOTKEYS = SECTIONS.map(({ hotkey }) => hotkey);

export function SiteNav() {
  const reduceMotion = !!useReducedMotion();
  const activeId = useSectionSpy(SECTION_IDS);
  const listRef = useRef<HTMLUListElement>(null);
  const active = useItemRect(listRef, activeId);

  useHotkeys(HOTKEYS, (event) => {
    const section = SECTIONS.find(({ hotkey }) => hotkey === event.key);
    document.getElementById(section?.id ?? "")?.scrollIntoView();
  });

  return (
    <nav aria-label="Primary" className="flex self-stretch">
      <ul ref={listRef} className="relative flex items-stretch gap-7">
        {SECTIONS.map((section) => {
          const isActive = activeId === section.id;

          return (
            <li key={section.id} className="flex">
              <SectionLink
                sectionId={section.id}
                data-section={section.id}
                data-active={isActive}
                aria-current={isActive ? "true" : undefined}
                aria-keyshortcuts={section.hotkey}
                className={cn(
                  "relative flex items-center text-sm text-muted-foreground outline-none",
                  "transition-colors duration-150 ease-snappy hover:text-foreground data-[active=true]:text-foreground",
                  // Hover preview of the underline, on the same edge.
                  "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-border after:opacity-0 after:transition-opacity after:duration-150 hover:after:opacity-100",
                  "focus-visible:text-foreground focus-visible:after:bg-ring focus-visible:after:opacity-100"
                )}
              >
                {section.label}
              </SectionLink>
            </li>
          );
        })}

        <ActiveUnderline {...active} reduceMotion={reduceMotion} />
      </ul>
    </nav>
  );
}

/** Ink line on the header's edge, under the active link. */
function ActiveUnderline({
  rect,
  visible,
  snap,
  reduceMotion,
}: {
  rect: { x: number; width: number };
  visible: boolean;
  snap: boolean;
  reduceMotion: boolean;
}) {
  const instant = reduceMotion || snap;

  return (
    <motion.li
      aria-hidden
      className="pointer-events-none absolute -bottom-px left-0 h-0.5 rounded-full bg-foreground"
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
