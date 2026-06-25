import type { SocialLink, SocialLinkKey } from "../types/social-links";

export const SOCIAL_LINKS: SocialLink[] = [
  {
    key: "linkedin",
    icon: "/images/link-icons/linkedin.webp",
    title: "LinkedIn",
    description: "Luca Alberto Giorgi",
    href: "https://www.linkedin.com/in/luca-alberto-giorgi",
  },
  {
    key: "x",
    icon: "/images/link-icons/x.webp",
    title: "X (formerly Twitter)",
    description: "@lucaalberto2004",
    href: "https://x.com/lucaalberto2004",
  },
  {
    key: "github",
    icon: "/images/link-icons/github.webp",
    title: "GitHub",
    description: "lucaalberto-giorgi",
    href: "https://github.com/lucaalberto-giorgi",
  },
];

/** Social links keyed by their stable `key` for direct lookup. */
export const SOCIAL_LINKS_BY_KEY = Object.fromEntries(
  SOCIAL_LINKS.map((link) => [link.key, link])
) as Record<SocialLinkKey, SocialLink>;
