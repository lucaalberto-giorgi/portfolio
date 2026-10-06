import { BrandMark } from "./brand-mark";

// The shared mark's 512x256 canvas leaves wide margins around "LG", which
// made it read tiny in the header. Crop to the letters (with a little room
// for system-ui width differences across platforms) so the height we set is
// mostly glyph and its left edge lines up with the page content.
const HEADER_VIEWBOX = "124 72 264 168";

export function SiteHeaderMark() {
  return <BrandMark viewBox={HEADER_VIEWBOX} />;
}
