import { getBrandIconSvg } from "@/lib/brand-icon";

export const dynamic = "force-static";

export function GET() {
  return new Response(getBrandIconSvg({ shape: "rounded" }), {
    headers: { "Content-Type": "image/svg+xml" },
  });
}
