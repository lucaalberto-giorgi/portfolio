import dynamic from "next/dynamic";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      <div className="page-container flex h-14 items-center gap-8">
        <BrandContextMenu>
          <Link className="flex [&_svg]:h-8" href="/" aria-label="Home">
            <SiteHeaderMark />
          </Link>
        </BrandContextMenu>

        {/* Phones get the bottom dock (MobileDock) instead of this menu. */}
        <div className="ml-auto hidden self-stretch sm:flex">
          <SiteNav />
        </div>

        <div className="flex items-center gap-2 max-sm:ml-auto">
          <ThemeToggle />
          <Button asChild className="px-3.5 max-sm:hidden">
            <Link href="/#contact">Contact</Link>
          </Button>
        </div>
      </div>
    </SiteHeaderWrapper>
  );
}
