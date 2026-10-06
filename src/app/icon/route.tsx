import { ImageResponse } from "next/og";

import { getBrandIconDataUri } from "@/lib/brand-icon";

export const runtime = "edge";
export const size = {
  width: 256,
  height: 256,
};
export const contentType = "image/png";

// Also served as the PWA's maskable icon, so the mark is scaled into the
// central safe zone that survives circular and squircle masks.
const MASKABLE_SCALE = 0.8;

export async function GET() {
  return new ImageResponse(
    <img
      src={getBrandIconDataUri({ shape: "square", scale: MASKABLE_SCALE })}
      alt=""
      width={size.width}
      height={size.height}
    />,
    {
      ...size,
    }
  );
}
