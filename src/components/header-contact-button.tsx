"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { SectionLink } from "./same-page-link";

/** Ids on the rows of Get in touch / Download CV buttons (hero and Contact). */
const ACTION_ROW_IDS = ["hero-actions", "contact-actions"];

/** Same curve as `ease-snappy`, so the slot opens in step with the fade. */
const SLOT_TRANSITION = {
  duration: 0.3,
  ease: [0.23, 1, 0.32, 1],
} as const;

/* ─────────────────────────────────────────────────────────
 * INTERACTION STORYBOARD (header Contact button, sm and up)
 *
 *  top of home   hidden; its slot is closed so the theme toggle sits
 *                on the header's right edge (the hero has Get in touch)
 *  scroll        once the hero's buttons pass under the header, the slot
 *                opens (the menu slides left to make room) and the
 *                button fades and scales in; reverses on the way back
 *  contact       hidden again while the Contact section's buttons are on
 *                screen, so clicking it hides it once it has done its job
 *  page load     the first reading snaps, so opening /#projects shows
 *                the button without animating
 * ───────────────────────────────────────────────────────── */

export function HeaderContactButton() {
  const pathname = usePathname();
  const reduceMotion = !!useReducedMotion();
  // Starts true so the button is already hidden on the first paint at the top.
  const [actionsInView, setActionsInView] = useState(true);
  const [hasSettled, setHasSettled] = useState(false);

  useEffect(() => {
    // The hero row is only on the homepage; the footer's is on every page.
    const actionRows = ACTION_ROW_IDS.map((id) =>
      document.getElementById(id)
    ).filter((row) => row !== null);

    // The sticky header covers the top of the viewport.
    const headerHeight =
      document.querySelector("header")?.getBoundingClientRect().height ?? 0;
    const rowsInView = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        // A fast scroll can batch several changes per row; in order, the
        // latest one wins.
        for (const entry of entries) {
          if (entry.isIntersecting) rowsInView.add(entry.target);
          else rowsInView.delete(entry.target);
        }
        setActionsInView(rowsInView.size > 0);
        // Let the first reading render without animation, then animate.
        requestAnimationFrame(() => setHasSettled(true));
      },
      { rootMargin: `-${Math.round(headerHeight)}px 0px 0px 0px` }
    );

    actionRows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [pathname]);

  const hidden = actionsInView;
  const instant = reduceMotion || !hasSettled;

  return (
    // The slot clips the button while it opens; the padding (cancelled by
    // negative margins) leaves room for the focus ring.
    <motion.div
      className="-my-1 -mr-1 flex overflow-hidden py-1 pr-1 max-sm:hidden"
      initial={false}
      animate={{ width: hidden ? 0 : "auto" }}
      transition={instant ? { duration: 0 } : SLOT_TRANSITION}
    >
      <Button
        asChild
        className={cn(
          "ml-2 shrink-0 px-3.5",
          "transition-[background-color,opacity,scale] duration-200 ease-snappy",
          instant && "transition-none",
          hidden && "pointer-events-none scale-95 opacity-0"
        )}
      >
        <SectionLink sectionId="contact" inert={hidden}>
          Contact
        </SectionLink>
      </Button>
    </motion.div>
  );
}
