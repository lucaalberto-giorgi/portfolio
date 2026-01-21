import { USER } from "@/features/portfolio/data/user";
import type { NavItem } from "@/types/nav";

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.APP_URL || "https://luca.giorgi.com",
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const MAIN_NAV: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Projects",
    href: "/projects",
  },
];

export const GITHUB_USERNAME = "lucaalberto-giorgi";
export const SOURCE_CODE_GITHUB_REPO = "lucaalberto-giorgi/portfolio";
export const SOURCE_CODE_GITHUB_URL = "https://github.com/lucaalberto-giorgi/portfolio";

export const SPONSORSHIP_URL = "";

export const UTM_PARAMS = {
  utm_source: "portfolio",
};
