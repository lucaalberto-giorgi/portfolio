"use client";

import {
  BriefcaseBusinessIcon,
  FolderGit2Icon,
  GraduationCapIcon,
  type LucideIcon,
  MailIcon,
  WrenchIcon,
} from "lucide-react";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

import { cn } from "@/lib/utils";

import {
  DOCK_SECTION_IDS,
  DOCK_SECTIONS,
  type DockSectionId,
  SectionPill,
  useItemRect,
  useSectionSpy,
} from "./section-nav";

/* ─────────────────────────────────────────────────────────
 * INTERACTION STORYBOARD (bottom dock, phones only)
 *
 *  always      pinned to the bottom of the screen, within thumb reach
 *  scroll      the ink pill glides to the section being read (spring);
 *              Contact lights up at the end of the page
 *  tap         item scales to 0.96 while pressed, then the page jumps
 * ───────────────────────────────────────────────────────── */

const ICONS: Record<DockSectionId, LucideIcon> = {
  experience: BriefcaseBusinessIcon,
  projects: FolderGit2Icon,
  education: GraduationCapIcon,
  skills: WrenchIcon,
  contact: MailIcon,
};

export function MobileDock() {
  const reduceMotion = !!useReducedMotion();
  const activeId = useSectionSpy(DOCK_SECTION_IDS);
  const listRef = useRef<HTMLUListElement>(null);
  const active = useItemRect(listRef, activeId);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:hidden">
      <nav
        aria-label="Sections"
        className="pointer-events-auto w-full max-w-md rounded-2xl border border-border bg-background p-1 shadow-[0_12px_32px_-12px_rgb(20_27_45/0.45)] dark:border-foreground/15 dark:shadow-[0_12px_32px_-8px_rgb(0_0_0/0.9)]"
      >
        <ul ref={listRef} className="relative flex items-stretch">
          <SectionPill
            {...active}
            reduceMotion={reduceMotion}
            className="inset-y-0 rounded-xl bg-foreground text-background"
          />

          {DOCK_SECTIONS.map((section) => {
            const isActive = activeId === section.id;
            const Icon = ICONS[section.id];

            return (
              <li key={section.id} className="flex flex-1">
                <Link
                  href={`/#${section.id}`}
                  data-section={section.id}
                  data-active={isActive}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative flex w-full flex-col items-center gap-1 rounded-xl px-0.5 pt-2.5 pb-3 text-[11px] leading-none font-medium text-foreground/70 outline-none max-[359px]:text-[10px]",
                    "transition-[color,scale] duration-150 ease-snappy active:scale-[0.96]",
                    "data-[active=true]:text-background",
                    "focus-visible:ring-2 focus-visible:ring-ring/50"
                  )}
                >
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                  {section.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
