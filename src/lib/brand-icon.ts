/**
 * The brand icon, "Chip": a processor outline in white on the site's navy
 * ink, with the signal green as a spark at its core: software and hardware
 * thinking, with AI at the centre. From the Paper file's "Favicon concepts"
 * board, refined to two pins a side so they stay separate at 16px. Geometry
 * is on a 256 grid.
 *
 * Shared by /favicon.svg, /icon, and /apple-icon.
 */

const COLORS = {
  ink: "#141b2d",
  paper: "#ffffff",
  spark: "#22c55e",
};

const SIZE = 256;

const CHIP = [
  // Body
  `<rect x="68" y="68" width="120" height="120" rx="24" fill="none" stroke="${COLORS.paper}" stroke-width="18"/>`,
  // Pins, two per side
  `<path d="M106 40V58M106 198V216M40 106H58M198 106H216M150 40V58M150 198V216M40 150H58M198 150H216" fill="none" stroke="${COLORS.paper}" stroke-width="16" stroke-linecap="round"/>`,
  // Spark at the core
  `<path fill="${COLORS.spark}" d="M128 90Q135.6 120.4 166 128Q135.6 135.6 128 166Q120.4 135.6 90 128Q120.4 120.4 128 90Z"/>`,
].join("");

type BrandIconOptions = {
  /** "rounded" for browser tabs; "square" for app icons the OS will mask. */
  shape?: "rounded" | "square";
  /**
   * Shrink the chip toward the centre (0 to 1). Maskable app icons need their
   * content inside the central safe zone.
   */
  scale?: number;
};

export function getBrandIconSvg({
  shape = "rounded",
  scale = 1,
}: BrandIconOptions = {}) {
  const offset = (SIZE * (1 - scale)) / 2;
  const radius = shape === "rounded" ? 56 : 0;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">`,
    `<rect width="${SIZE}" height="${SIZE}" rx="${radius}" fill="${COLORS.ink}"/>`,
    `<g transform="translate(${offset} ${offset}) scale(${scale})">${CHIP}</g>`,
    `</svg>`,
  ].join("");
}

/** The icon as a data URI, for next/og image responses. */
export function getBrandIconDataUri(options?: BrandIconOptions) {
  return `data:image/svg+xml;base64,${btoa(getBrandIconSvg(options))}`;
}
