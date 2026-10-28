"use client";

import { CpuIcon, TypeIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { getBrandIconSvg } from "@/lib/brand-icon";
import { copyText } from "@/utils/copy";

import { getWordmarkSVG } from "./brand-wordmark";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";

export function BrandContextMenu({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent className="w-64">
        <ContextMenuItem
          onClick={() => {
            copyText(getBrandIconSvg());
            toast.success("Copied Icon as SVG");
          }}
        >
          <CpuIcon />
          Copy Icon as SVG
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => {
            const svg = getWordmarkSVG(
              resolvedTheme === "light" ? "#000" : "#fff"
            );
            copyText(svg);
            toast.success("Copied Logotype as SVG");
          }}
        >
          <TypeIcon />
          Copy Logotype as SVG
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
