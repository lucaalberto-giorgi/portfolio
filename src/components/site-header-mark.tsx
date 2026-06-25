import { BrandMark } from "./brand-mark";

// Always show the "LG" brand mark in the header (previously it was hidden on
// the home page until you scrolled past the hero).
export function SiteHeaderMark() {
  return <BrandMark />;
}
