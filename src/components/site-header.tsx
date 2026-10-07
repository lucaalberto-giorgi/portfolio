import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";

import { HeaderContactButton } from "./header-contact-button";
import { HomeLink } from "./same-page-link";
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
          <HomeLink className="flex [&_svg]:h-8" aria-label="Home">
            <SiteHeaderMark />
          </HomeLink>
        </BrandContextMenu>

        {/* Phones get the bottom dock (MobileDock) instead of this menu. */}
        <div className="ml-auto hidden self-stretch sm:flex">
          <SiteNav />
        </div>

        {/* No gap: the Contact button spaces itself so its slot can close. */}
        <div className="flex items-center max-sm:ml-auto">
          <ThemeToggle />
          <HeaderContactButton />
        </div>
      </div>
    </SiteHeaderWrapper>
  );
}
