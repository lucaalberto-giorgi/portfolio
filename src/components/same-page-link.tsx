"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

import { glideToSection, glideToTop } from "@/lib/page-glide";

/*
 * Next's Link does nothing when its URL is the one its router thinks is
 * current. On this single-page site that broke two cases: a second click on
 * a section link (or on the logo) once you had scrolled away, and any click
 * after a hash typed into the address bar, which the router never sees. When
 * the target is on this page, these links glide there and update the URL
 * themselves; Next keeps its router in sync with `history.pushState`.
 * Otherwise they behave like a normal Link.
 */

type SamePageLinkProps = Omit<ComponentProps<typeof Link>, "href">;

/** A left click without modifiers, i.e. not "open in a new tab/window". */
function isPlainClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

/** Enter on a focused link: jump straight there, like the 1-4 shortcuts. */
function isKeyboardClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.detail === 0;
}

/**
 * Moves focus to `section`, as a native in-page link would, so Tab carries on
 * from there rather than from a header button that may have just hidden.
 */
function focusSection(section: HTMLElement) {
  if (!section.hasAttribute("tabindex")) section.tabIndex = -1;
  section.focus({ preventScroll: true });
}

/** Link to a homepage section by its id. */
export function SectionLink({
  sectionId,
  onClick,
  ...props
}: SamePageLinkProps & { sectionId: string }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    const section = document.getElementById(sectionId);

    if (event.defaultPrevented || !isPlainClick(event) || !section) {
      return;
    }

    event.preventDefault();

    // Push before scrolling so Back returns to where the click happened.
    const hash = `#${sectionId}`;
    if (window.location.hash !== hash) {
      window.history.pushState(null, "", hash);
    }

    glideToSection(section, { instant: isKeyboardClick(event) });
    focusSection(section);
  };

  return <Link href={`/#${sectionId}`} onClick={handleClick} {...props} />;
}

/** Link to the homepage that returns to the top when already there. */
export function HomeLink({ onClick, ...props }: SamePageLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    const { pathname, search, hash } = window.location;

    if (
      event.defaultPrevented ||
      !isPlainClick(event) ||
      pathname !== "/" ||
      search
    ) {
      return;
    }

    event.preventDefault();

    if (hash) {
      window.history.pushState(null, "", "/");
    }

    glideToTop({ instant: isKeyboardClick(event) });
  };

  return <Link href="/" onClick={handleClick} {...props} />;
}
