"use client";

import {
  BriefcaseBusinessIcon,
  FolderGit2Icon,
  GithubIcon,
  GraduationCapIcon,
  HomeIcon,
  LinkedinIcon,
  MailIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { META_THEME_COLORS } from "@/config/site";
import { USER } from "@/features/portfolio/data/user";
import { useIsClient } from "@/hooks/use-is-client";
import { useMetaColor } from "@/hooks/use-meta-color";
import { cn } from "@/lib/utils";
import { decodeEmail } from "@/utils/string";

const GITHUB_URL = "https://github.com/lucaalberto-giorgi";
const LINKEDIN_URL =
  "https://www.linkedin.com/in/luca-alberto-giorgi-89710a357";

const SECTIONS = [
  { label: "Home", href: "/", Icon: HomeIcon },
  { label: "Experience", href: "/#experience", Icon: BriefcaseBusinessIcon },
  { label: "Education", href: "/#education", Icon: GraduationCapIcon },
  { label: "Projects", href: "/#projects", Icon: FolderGit2Icon },
];

const ROW =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground";

export function MobileMenu({ className }: { className?: string }) {
  const isClient = useIsClient();
  const { resolvedTheme, setTheme } = useTheme();
  const { setMetaColor } = useMetaColor();

  const switchTheme = useCallback(() => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
    setMetaColor(
      next === "dark" ? META_THEME_COLORS.dark : META_THEME_COLORS.light
    );
  }, [resolvedTheme, setTheme, setMetaColor]);

  const emailHref = isClient ? `mailto:${decodeEmail(USER.email)}` : "#";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          className={cn(
            "group/toggle flex flex-col gap-1 data-[state=open]:bg-accent",
            className
          )}
        >
          <span className="flex h-0.5 w-4 transform rounded-[1px] bg-foreground transition-transform group-data-[state=open]/toggle:translate-y-0.75 group-data-[state=open]/toggle:rotate-45" />
          <span className="flex h-0.5 w-4 transform rounded-[1px] bg-foreground transition-transform group-data-[state=open]/toggle:-translate-y-0.75 group-data-[state=open]/toggle:-rotate-45" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-72 gap-0 p-0">
        <SheetHeader className="border-b border-edge">
          <SheetTitle className="font-mono text-sm">Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation, social links, and theme toggle.
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-0.5 p-2">
          {SECTIONS.map(({ label, href, Icon }) => (
            <SheetClose key={href} asChild>
              <Link href={href} className={ROW}>
                <Icon />
                {label}
              </Link>
            </SheetClose>
          ))}
        </nav>

        <div className="mx-2 border-t border-edge" />

        <nav className="flex flex-col gap-0.5 p-2">
          <SheetClose asChild>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={ROW}
            >
              <GithubIcon />
              GitHub
            </a>
          </SheetClose>

          <SheetClose asChild>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={ROW}
            >
              <LinkedinIcon />
              LinkedIn
            </a>
          </SheetClose>

          <SheetClose asChild>
            <a href={emailHref} className={ROW}>
              <MailIcon />
              Email
            </a>
          </SheetClose>
        </nav>

        <div className="mx-2 border-t border-edge" />

        <div className="p-2">
          <button
            type="button"
            onClick={switchTheme}
            className={cn(ROW, "w-full")}
          >
            <SunIcon className="hidden [html.light_&]:block" />
            <MoonIcon className="hidden [html.dark_&]:block" />
            Toggle theme
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
