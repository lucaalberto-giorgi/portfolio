import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 256,
  height: 256,
};
export const contentType = "image/png";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
        }}
      >
        <div
          style={{
            fontSize: 140,
            fontWeight: 600,
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          LG
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
