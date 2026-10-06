import dynamic from "next/dynamic";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { ScrollProgress } from "./scroll-progress";
import { SiteHeaderMark } from "./site-header-mark";
import { SiteHeaderWrapper } from "./site-header-wrapper";
import { SiteNav } from "./site-nav";
import { ThemeToggle } from "./theme-toggle";

const BrandContextMenu = dynamic(() =>
  import("@/components/brand-context-menu").then((mod) => mod.BrandContextMenu)
);

export function SiteHeader() {
  return (
    <SiteHeaderWrapper
      className={cn(
        "sticky top-0 z-50 border-b border-transparent bg-background/90 backdrop-blur-md",
        "transition-[border-color] duration-300 data-[affix=true]:border-border"
      )}
    >
      <div className="page-container flex h-14 items-center gap-4">
        <BrandContextMenu>
          <Link className="flex [&_svg]:h-8" href="/" aria-label="Home">
            <SiteHeaderMark />
          </Link>
        </BrandContextMenu>

        <div className="ml-auto">
          <SiteNav />
        </div>

        <ThemeToggle className="-mr-2" />
      </div>

      <ScrollProgress />
    </SiteHeaderWrapper>
  );
}
