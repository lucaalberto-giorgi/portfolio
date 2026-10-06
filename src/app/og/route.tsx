import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { USER } from "@/features/portfolio/data/user";
import { urlToName } from "@/utils/url";

// Rendered once at build time; any query string on shared links is ignored.
export const dynamic = "force-static";

const SIZE = { width: 1200, height: 630 };
const PORTRAIT_WIDTH = 480;

// Site tokens (see globals.css), repeated here because the image renderer
// can't read CSS variables.
const COLORS = {
  paper: "#ffffff",
  ink: "#141b2d",
  graphite: "#5b6478",
  signal: "#16a34a",
};

function readAsset(path: string) {
  return readFile(join(process.cwd(), "src/assets", path));
}

export async function GET() {
  const [medium, semiBold, portrait] = await Promise.all([
    readAsset("fonts/InstrumentSans-Medium.ttf"),
    readAsset("fonts/InstrumentSans-SemiBold.ttf"),
    readAsset("images/og-portrait.jpg"),
  ]);

  const portraitSrc = `data:image/jpeg;base64,${portrait.toString("base64")}`;
  const city = USER.address.split(",")[0];
  const domain = urlToName(USER.website).replace(/^www\./, "");

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.paper,
        color: COLORS.ink,
        fontFamily: "Instrument Sans",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: SIZE.width - PORTRAIT_WIDTH,
          padding: "56px 64px 56px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            LG
          </div>
          <div
            style={{ fontSize: 22, fontWeight: 500, color: COLORS.graphite }}
          >
            {domain}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 60,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
            }}
          >
            {USER.displayName}
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 30,
              fontWeight: 500,
              color: COLORS.graphite,
            }}
          >
            {`${USER.jobTitle} in ${city}`}
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 32,
              fontWeight: 500,
              lineHeight: 1.25,
              letterSpacing: "-0.015em",
            }}
          >
            {USER.headline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 22,
            fontWeight: 500,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              marginRight: 12,
              borderRadius: 999,
              backgroundColor: COLORS.signal,
            }}
          />
          {USER.availability}
        </div>
      </div>

      <img
        src={portraitSrc}
        alt=""
        width={PORTRAIT_WIDTH}
        height={SIZE.height}
        style={{ objectFit: "cover" }}
      />
    </div>,
    {
      ...SIZE,
      fonts: [
        { name: "Instrument Sans", data: medium, weight: 500 },
        { name: "Instrument Sans", data: semiBold, weight: 600 },
      ],
    }
  );
}
