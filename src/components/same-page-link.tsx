"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

/*
 * Next's Link does nothing when its URL is already the current one. On this
 * single-page site that meant a second click on a section link (or on the
 * logo while at "/") went nowhere once you had scrolled away. These links
 * scroll directly in that case and behave like a normal Link otherwise.
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

/** Link to a homepage section by its id. */
export function SectionLink({
  sectionId,
  onClick,
  ...props
}: SamePageLinkProps & { sectionId: string }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    const section = document.getElementById(sectionId);

    if (
      event.defaultPrevented ||
      !isPlainClick(event) ||
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

/** Link to the homepage that returns to the top when already there. */
export function HomeLink({ onClick, ...props }: SamePageLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    const { pathname, search, hash } = window.location;

    if (
      event.defaultPrevented ||
      !isPlainClick(event) ||
      pathname !== "/" ||
      search ||
      hash
    ) {
      return;
    }

    event.preventDefault();
    window.scrollTo({ top: 0 });
  };

  return <Link href="/" onClick={handleClick} {...props} />;
}
