"use client";

import {
  FolderGit2Icon,
  GithubIcon,
  HomeIcon,
  LinkedinIcon,
  MailIcon,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { META_THEME_COLORS } from "@/config/site";
import { USER } from "@/features/portfolio/data/user";
import { useIsClient } from "@/hooks/use-is-client";
import { useMetaColor } from "@/hooks/use-meta-color";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";
import { decodeEmail } from "@/utils/string";

import { MoonIcon } from "./animated-icons/moon";
import { SunMediumIcon } from "./animated-icons/sun-medium";
import { Button } from "./ui/button";

const GITHUB_URL = "https://github.com/lucaalberto-giorgi";
const LINKEDIN_URL =
  "https://www.linkedin.com/in/luca-alberto-giorgi-89710a357";

const ITEM_BUTTON =
  "size-10 transition-all duration-200 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:bg-accent";

const TOOLTIP =
  "pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 translate-y-1 scale-95 whitespace-nowrap rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-md transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100";

function Divider() {
  return (
    <span aria-hidden className="mx-0.5 h-5 w-px shrink-0 bg-border sm:mx-1" />
  );
}

function PillItem({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="group relative">
      {children}
      <span role="tooltip" className={TOOLTIP}>
        {label}
      </span>
    </div>
  );
}

function ThemePillButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const { setMetaColor } = useMetaColor();
  const playClick = useSound("/audio/ui-sounds/click.wav");

  const switchTheme = useCallback(() => {
    playClick(0.5);
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setMetaColor(
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    );
  }, [resolvedTheme, setTheme, setMetaColor, playClick]);

  useHotkeys("d", switchTheme);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(ITEM_BUTTON, "[&_svg]:!size-[22px]")}
      aria-label="Theme"
      onClick={switchTheme}
    >
      <MoonIcon className="relative hidden after:absolute after:-inset-2 [html.dark_&]:block" />
      <SunMediumIcon className="relative hidden after:absolute after:-inset-2 [html.light_&]:block" />
      <span className="sr-only">Theme Toggle</span>
    </Button>
  );
}

function EmailPillButton() {
  const isClient = useIsClient();
  const emailDecoded = decodeEmail(USER.email);
  const href = isClient ? `mailto:${emailDecoded}` : "#";
  const label = isClient ? `Send email to ${emailDecoded}` : "Email address";

  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className={ITEM_BUTTON}
      aria-label={label}
    >
      <a href={href}>
        <MailIcon className="size-[22px]" />
      </a>
    </Button>
  );
}

export function HeaderPill() {
  return (
    <nav
      aria-label="Primary"
      className={cn(
        "flex h-12 items-center gap-0.5 rounded-full border border-border bg-background/80 px-2 shadow-sm backdrop-blur-md",
        "sm:gap-1"
      )}
    >
      <PillItem label="Home">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className={ITEM_BUTTON}
          aria-label="Home"
        >
          <Link href="/">
            <HomeIcon className="size-[22px]" />
          </Link>
        </Button>
      </PillItem>

      <PillItem label="Projects">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className={ITEM_BUTTON}
          aria-label="Projects"
        >
          <Link href="/#projects">
            <FolderGit2Icon className="size-[22px]" />
          </Link>
        </Button>
      </PillItem>

      <Divider />

      <PillItem label="GitHub">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className={ITEM_BUTTON}
          aria-label="GitHub"
        >
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <GithubIcon className="size-[22px]" />
          </a>
        </Button>
      </PillItem>

      <PillItem label="LinkedIn">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className={ITEM_BUTTON}
          aria-label="LinkedIn"
        >
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            <LinkedinIcon className="size-[22px]" />
          </a>
        </Button>
      </PillItem>

      <PillItem label="Email">
        <EmailPillButton />
      </PillItem>

      <Divider />

      <PillItem label="Theme">
        <ThemePillButton />
      </PillItem>
    </nav>
  );
}
