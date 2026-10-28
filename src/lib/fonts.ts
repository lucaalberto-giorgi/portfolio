import { GeistMono } from "geist/font/mono";
import { Archivo as FontSans } from "next/font/google";

// Archivo's width axis (62 to 125) does the work a second family would:
// section titles run slightly expanded, like engineering labels, and the
// chip's marking runs fully expanded, while body copy stays at normal width.
export const fontSans = FontSans({
  axes: ["wdth"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = GeistMono;
