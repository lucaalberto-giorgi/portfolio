import { GeistMono } from "geist/font/mono";
import { Instrument_Sans as FontSans } from "next/font/google";

// Variable width axis lets the hero headline run condensed while body copy
// stays at normal width, so the whole site uses a single family.
export const fontSans = FontSans({
  axes: ["wdth"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = GeistMono;
