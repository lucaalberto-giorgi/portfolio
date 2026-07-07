"use client";

import { useTheme } from "next-themes";
import { useCallback } from "react";

import { META_THEME_COLORS } from "@/config/site";
import { useMetaColor } from "@/hooks/use-meta-color";
import { useSound } from "@/hooks/use-sound";

/**
 * Returns a callback that flips light <-> dark, plays the UI click, and keeps
 * the browser theme-color meta in sync. Shared by the header dock and the
 * self-referential portfolio project card so both toggles behave identically.
 */
export function useThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { setMetaColor } = useMetaColor();
  const playClick = useSound("/audio/ui-sounds/click.wav");

  return useCallback(() => {
    playClick(0.5);
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
    setMetaColor(
      next === "dark" ? META_THEME_COLORS.dark : META_THEME_COLORS.light
    );
  }, [resolvedTheme, setTheme, setMetaColor, playClick]);
}
