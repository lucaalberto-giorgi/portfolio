import dynamic from "next/dynamic";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { HeaderPill } from "./header-pill";
import { SiteHeaderMark } from "./site-header-mark";
import { SiteHeaderWrapper } from "./site-header-wrapper";

const BrandContextMenu = dynamic(() =>
  import("@/components/brand-context-menu").then((mod) => mod.BrandContextMenu)
);

export function SiteHeader() {
  return (
    <SiteHeaderWrapper
      className={cn(
        "sticky top-0 z-50 max-w-screen overflow-x-clip bg-background px-2 pt-2",
        "data-[affix=true]:shadow-[0_0_16px_0_black]/8 dark:data-[affix=true]:shadow-[0_0_16px_0_black]",
        "not-dark:data-[affix=true]:**:data-header-container:after:bg-border",
        "transition-shadow duration-300"
      )}
    >
      <div
        className="screen-line-before screen-line-after relative mx-auto flex h-12 items-center border-x border-edge px-2 after:z-1 after:transition-[background-color] md:max-w-3xl"
        data-header-container
      >
        <BrandContextMenu>
          <Link
            className="has-data-[visible=false]:pointer-events-none [&_svg]:h-8"
            href="/"
            aria-label="Home"
          >
            <SiteHeaderMark />
          </Link>
        </BrandContextMenu>

        <div className="pointer-events-none absolute inset-x-0 flex justify-center">
          <div className="pointer-events-auto">
            <HeaderPill />
          </div>
        </div>
      </div>
    </SiteHeaderWrapper>
  );
}
