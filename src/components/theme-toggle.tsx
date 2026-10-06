"use client";

import { useHotkeys } from "react-hotkeys-hook";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useThemeToggle } from "@/hooks/use-theme-toggle";

import { MoonIcon } from "./animated-icons/moon";
import { SunMediumIcon } from "./animated-icons/sun-medium";

const THEME_HOTKEY = "d";

export function ThemeToggle({ className }: { className?: string }) {
  const switchTheme = useThemeToggle();

  useHotkeys(THEME_HOTKEY, switchTheme);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={className}
            onClick={switchTheme}
            aria-label="Toggle theme"
            aria-keyshortcuts={THEME_HOTKEY}
          />
        }
      >
        <MoonIcon size={18} className="hidden [html.dark_&]:block" />
        <SunMediumIcon size={18} className="hidden [html.light_&]:block" />
      </TooltipTrigger>

      <TooltipContent
        side="bottom"
        className="flex items-center gap-2 px-2.5 py-1.5 text-xs"
      >
        Toggle theme
        <Kbd className="border-background/25 text-background/80">
          {THEME_HOTKEY.toUpperCase()}
        </Kbd>
      </TooltipContent>
    </Tooltip>
  );
}
