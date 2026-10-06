"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────
 * INTERACTION STORYBOARD
 *
 *  scroll      a section crosses the reading line: its item turns ink
 *              and the active pill glides over to it (spring)
 *  scroll      reading line is outside every nav section (hero,
 *              GitHub, contact): the pill fades out where it is
 *  press 1-4   page jumps to that section instantly (keyboard actions
 *              never wait on an animation) and its keycap flashes
 *  hover       label turns ink, keycap darkens (CSS, 150ms)
 * ───────────────────────────────────────────────────────── */

const SECTIONS = [
  { id: "experience", label: "Experience", hotkey: "1" },
  { id: "projects", label: "Projects", hotkey: "2" },
  {
    id: "education",
    label: "Education",
    hotkey: "3",
    className: "max-sm:hidden",
  },
  { id: "skills", label: "Skills", hotkey: "4", className: "max-md:hidden" },
];

const SECTION_IDS = SECTIONS.map(({ id }) => id);
const HOTKEYS = SECTIONS.map(({ hotkey }) => hotkey);

/* Active-section pill */
const PILL = {
  move: { type: "spring", visualDuration: 0.3, bounce: 0.15 } as const, // glide between items
  fade: { duration: 0.15, ease: "easeOut" } as const, // appear / disappear in place
};

/* Keycap flash after a hotkey press */
const KEYCAP = {
  pressedMs: 180, // how long the key reads as pressed
};

/* Scroll spy: a 1%-tall band 30% down the viewport is the reading line */
const SPY = {
  rootMargin: "-30% 0px -69% 0px",
};

function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const crossing = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            crossing.add(entry.target.id);
          } else {
            crossing.delete(entry.target.id);
          }
        }

        setActiveId(ids.find((id) => crossing.has(id)) ?? null);
      },
      { rootMargin: SPY.rootMargin }
    );

    for (const id of ids) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

export function SiteNav() {
  const reduceMotion = useReducedMotion();
  const activeId = useActiveSection(SECTION_IDS);
  const listRef = useRef<HTMLUListElement>(null);

  // The pill keeps its last position while hidden so it fades out in place
  // rather than collapsing to the left edge.
  const [pillRect, setPillRect] = useState({ x: 0, width: 0 });
  const [isPillVisible, setIsPillVisible] = useState(false);
  const [pressedHotkey, setPressedHotkey] = useState<string | null>(null);

  useEffect(() => {
    const measure = () => {
      const item = listRef.current?.querySelector<HTMLElement>(
        `[data-section="${activeId}"]`
      );

      // Items hidden at this breakpoint have no width; keep the pill hidden.
      if (!activeId || !item || item.offsetWidth === 0) {
        setIsPillVisible(false);
        return;
      }

      setPillRect({ x: item.offsetLeft, width: item.offsetWidth });
      setIsPillVisible(true);
    };

    measure();
    window.addEventListener("resize", measure);

    return () => window.removeEventListener("resize", measure);
  }, [activeId]);

  useHotkeys(HOTKEYS, (event) => {
    const section = SECTIONS.find(({ hotkey }) => hotkey === event.key);
    if (!section) return;

    document.getElementById(section.id)?.scrollIntoView();
    setPressedHotkey(section.hotkey);
  });

  useEffect(() => {
    if (!pressedHotkey) return;

    const timer = setTimeout(() => setPressedHotkey(null), KEYCAP.pressedMs);

    return () => clearTimeout(timer);
  }, [pressedHotkey]);

  return (
    <nav aria-label="Primary">
      <ul
        ref={listRef}
        className="relative flex items-center gap-0.5 rounded-lg border border-border bg-background/60 p-0.5"
      >
        <motion.li
          aria-hidden
          className="pointer-events-none absolute inset-y-0.5 left-0 rounded-md bg-accent ring-1 ring-border"
          initial={false}
          animate={{
            x: pillRect.x,
            width: pillRect.width,
            opacity: isPillVisible ? 1 : 0,
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { x: PILL.move, width: PILL.move, opacity: PILL.fade }
          }
        />

        {SECTIONS.map((section) => {
          const isActive = activeId === section.id;

          return (
            <li key={section.id} className={section.className}>
              <Link
                href={`/#${section.id}`}
                data-section={section.id}
                data-active={isActive}
                aria-current={isActive ? "true" : undefined}
                aria-keyshortcuts={section.hotkey}
                className={cn(
                  "group relative flex h-7 items-center gap-2 rounded-md px-2.5 text-sm text-muted-foreground outline-none",
                  "transition-[color,background-color,scale] duration-150 ease-snappy active:scale-[0.97]",
                  "hover:text-foreground hover:not-data-[active=true]:bg-accent/50",
                  "focus-visible:ring-2 focus-visible:ring-ring/50",
                  "data-[active=true]:text-foreground"
                )}
              >
                <Kbd
                  data-pressed={pressedHotkey === section.hotkey}
                  aria-hidden
                  className={cn(
                    "hidden lg:inline-flex",
                    "transition-[scale,color,border-color,background-color] duration-150 ease-snappy",
                    "group-hover:border-foreground/25 group-hover:text-foreground",
                    "group-data-[active=true]:border-foreground/25 group-data-[active=true]:text-foreground",
                    "data-[pressed=true]:scale-90 data-[pressed=true]:border-foreground data-[pressed=true]:bg-foreground data-[pressed=true]:text-background"
                  )}
                >
                  {section.hotkey}
                </Kbd>
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
