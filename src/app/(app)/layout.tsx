import dynamic from "next/dynamic";

import { MobileDock } from "@/components/mobile-dock";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const ScrollToTop = dynamic(() =>
  import("@/components/scroll-to-top").then((mod) => mod.ScrollToTop)
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="max-w-screen overflow-x-clip">{children}</main>
      <SiteFooter />
      <MobileDock />
      {/* On phones the dock sits where this button would go. */}
      <ScrollToTop className="max-sm:hidden" />
    </>
  );
}
