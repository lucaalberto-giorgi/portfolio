"use client";

import {
  BriefcaseBusinessIcon,
  FolderGit2Icon,
  GithubIcon,
  GraduationCapIcon,
  HomeIcon,
  LinkedinIcon,
  MailIcon,
} from "lucide-react";
import type { MotionValue } from "motion/react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useCallback, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { META_THEME_COLORS } from "@/config/site";
import { SOCIAL_LINKS_BY_KEY } from "@/features/portfolio/data/social-links";
import { USER } from "@/features/portfolio/data/user";
import { useIsClient } from "@/hooks/use-is-client";
import { useMetaColor } from "@/hooks/use-meta-color";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";
import { decodeEmail } from "@/utils/string";

import { MoonIcon } from "./animated-icons/moon";
import { SunMediumIcon } from "./animated-icons/sun-medium";

const GITHUB_URL = SOCIAL_LINKS_BY_KEY.github.href;
const LINKEDIN_URL = SOCIAL_LINKS_BY_KEY.linkedin.href;

// Dock magnification tuning. Kept modest so peak items stay within the
// slim sticky header instead of ballooning like a macOS bottom dock.
const BASE_SIZE = 40; // matches the previous size-10 buttons
const PEAK_SIZE = 54;
const ICON_PEAK_SCALE = 1.25;
const PROXIMITY = 110; // px from an item's center where magnification fades out
const SPRING = { mass: 0.1, stiffness: 170, damping: 14 } as const;

const ITEM_BUTTON = cn(
  "absolute inset-0 flex items-center justify-center rounded-full",
  "text-foreground/80 transition-colors outline-none",
  "hover:bg-accent hover:text-foreground",
  "focus-visible:bg-accent focus-visible:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
);

const TOOLTIP =
  "pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 translate-y-1 scale-95 whitespace-nowrap rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-md transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100";

// Keep mouse clicks from leaving focus on a dock item — otherwise the focus
// ring ("glow") and the focus-within tooltip would stick after clicking.
// Keyboard focus (Tab) is unaffected, so the focus ring still shows for it.
const preventFocusOnPointer = (e: React.MouseEvent) => e.preventDefault();

function Divider() {
  return (
    <span aria-hidden className="mx-0.5 h-5 w-px shrink-0 bg-border sm:mx-1" />
  );
}

type DockItemProps = {
  mouseX: MotionValue<number>;
  reduce: boolean;
  label: string;
  icon: React.ReactNode;
  href?: string;
  target?: string;
  onClick?: () => void;
};

function DockItem({
  mouseX,
  reduce,
  label,
  icon,
  href,
  target,
  onClick,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Signed horizontal distance from the cursor to this item's center.
  const distance = useTransform(mouseX, (x) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Number.POSITIVE_INFINITY;
    return x - bounds.x - bounds.width / 2;
  });

  const sizeTransform = useTransform(
    distance,
    [-PROXIMITY, 0, PROXIMITY],
    [BASE_SIZE, PEAK_SIZE, BASE_SIZE]
  );
  const size = useSpring(sizeTransform, SPRING);

  const iconScaleTransform = useTransform(
    distance,
    [-PROXIMITY, 0, PROXIMITY],
    [1, ICON_PEAK_SCALE, 1]
  );
  const iconScale = useSpring(iconScaleTransform, SPRING);

  const dimension = reduce ? BASE_SIZE : size;

  const iconNode = (
    <motion.span
      aria-hidden
      className="pointer-events-none flex items-center justify-center"
      style={{ scale: reduce ? 1 : iconScale }}
    >
      {icon}
    </motion.span>
  );

  const isInternal = href?.startsWith("/") && target !== "_blank";

  let interactive: React.ReactNode;
  if (onClick) {
    interactive = (
      <button
        type="button"
        className={ITEM_BUTTON}
        aria-label={label}
        onClick={onClick}
        onMouseDown={preventFocusOnPointer}
      >
        {iconNode}
        <span className="sr-only">{label}</span>
      </button>
    );
  } else if (isInternal) {
    interactive = (
      <Link
        className={ITEM_BUTTON}
        href={href!}
        aria-label={label}
        onMouseDown={preventFocusOnPointer}
      >
        {iconNode}
      </Link>
    );
  } else {
    interactive = (
      <a
        className={ITEM_BUTTON}
        href={href}
        aria-label={label}
        onMouseDown={preventFocusOnPointer}
        {...(target === "_blank"
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {iconNode}
      </a>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="group relative flex shrink-0 items-center justify-center"
      style={{ width: dimension, height: dimension }}
    >
      {interactive}
      <span role="tooltip" className={TOOLTIP}>
        {label}
      </span>
    </motion.div>
  );
}

type DockChildProps = {
  mouseX: MotionValue<number>;
  reduce: boolean;
};

function ThemeDockItem({ mouseX, reduce }: DockChildProps) {
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
    <DockItem
      mouseX={mouseX}
      reduce={reduce}
      label="Theme"
      onClick={switchTheme}
      icon={
        <>
          <MoonIcon className="relative hidden after:absolute after:-inset-2 [html.dark_&]:block" />
          <SunMediumIcon className="relative hidden after:absolute after:-inset-2 [html.light_&]:block" />
        </>
      }
    />
  );
}

function EmailDockItem({ mouseX, reduce }: DockChildProps) {
  const isClient = useIsClient();
  const emailDecoded = decodeEmail(USER.email);
  const href = isClient ? `mailto:${emailDecoded}` : "#";
  const label = isClient ? `Send email to ${emailDecoded}` : "Email address";

  return (
    <DockItem
      mouseX={mouseX}
      reduce={reduce}
      label={label}
      href={href}
      icon={<MailIcon className="size-[22px]" />}
    />
  );
}

export function HeaderPill() {
  const reduce = !!useReducedMotion();
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

  return (
    <nav
      aria-label="Primary"
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      className={cn(
        "flex h-12 items-center gap-0.5 rounded-full border border-border bg-background/80 px-2 shadow-sm backdrop-blur-md",
        "sm:gap-1"
      )}
    >
      <DockItem
        mouseX={mouseX}
        reduce={reduce}
        label="Home"
        href="/"
        icon={<HomeIcon className="size-[22px]" />}
      />

      <DockItem
        mouseX={mouseX}
        reduce={reduce}
        label="Experience"
        href="/#experience"
        icon={<BriefcaseBusinessIcon className="size-[22px]" />}
      />

      <DockItem
        mouseX={mouseX}
        reduce={reduce}
        label="Education"
        href="/#education"
        icon={<GraduationCapIcon className="size-[22px]" />}
      />

      <DockItem
        mouseX={mouseX}
        reduce={reduce}
        label="Projects"
        href="/#projects"
        icon={<FolderGit2Icon className="size-[22px]" />}
      />

      <Divider />

      <DockItem
        mouseX={mouseX}
        reduce={reduce}
        label="GitHub"
        href={GITHUB_URL}
        target="_blank"
        icon={<GithubIcon className="size-[22px]" />}
      />

      <DockItem
        mouseX={mouseX}
        reduce={reduce}
        label="LinkedIn"
        href={LINKEDIN_URL}
        target="_blank"
        icon={<LinkedinIcon className="size-[22px]" />}
      />

      <EmailDockItem mouseX={mouseX} reduce={reduce} />

      <Divider />

      <ThemeDockItem mouseX={mouseX} reduce={reduce} />
    </nav>
  );
}
