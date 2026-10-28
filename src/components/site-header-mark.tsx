import { getBrandIconSvg } from "@/lib/brand-icon";

/**
 * The brand chip from the favicon, at header size: the hero's chip in
 * miniature, so the header keeps it in view once the hero scrolls away.
 */
export function SiteHeaderMark() {
  return (
    <span
      aria-hidden
      className="block size-8 overflow-hidden rounded-[9px] ring-1 ring-foreground/10 [&_svg]:size-full"
      dangerouslySetInnerHTML={{ __html: getBrandIconSvg({ shape: "square" }) }}
    />
  );
}
