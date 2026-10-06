import { ImageResponse } from "next/og";

import { getBrandIconDataUri } from "@/lib/brand-icon";

export const runtime = "edge";
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// iOS rounds the corners itself, so the tile stays square.
export async function GET() {
  return new ImageResponse(
    <img
      src={getBrandIconDataUri({ shape: "square" })}
      alt=""
      width={size.width}
      height={size.height}
    />,
    {
      ...size,
    }
  );
}
