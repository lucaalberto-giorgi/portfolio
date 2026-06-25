import type { ProfilePage as PageSchema, WithContext } from "schema-dts";

import { About } from "@/features/portfolio/components/about";
import { Experiences } from "@/features/portfolio/components/experiences";
import { GitHubContributions } from "@/features/portfolio/components/github-contributions";
import { ProfileHeader } from "@/features/portfolio/components/profile-header";
import { ProfileSidebar } from "@/features/portfolio/components/profile-sidebar";
import { Projects } from "@/features/portfolio/components/projects";
import { Skills } from "@/features/portfolio/components/skills";
import { USER } from "@/features/portfolio/data/user";
import { cn } from "@/lib/utils";

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd()).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto w-full max-w-6xl lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] lg:border-x lg:border-edge">
        {/* Left column: sticky profile (large screens only) */}
        <aside className="hidden lg:sticky lg:top-18 lg:block lg:self-start">
          <ProfileSidebar />
        </aside>

        {/* Right column: content (full width on mobile) */}
        <div className="lg:border-l lg:border-edge lg:pt-6 *:[[id]]:scroll-mt-22">
          {/* Profile header for the single-column (mobile/tablet) layout */}
          <div className="lg:hidden">
            <ProfileHeader />
            <Separator />
          </div>

          <About />
          <Separator />

          <Experiences />
          <Separator />

          <Projects />
          <Separator />

          <GitHubContributions />
          <Separator />

          <Skills />
          <Separator />
        </div>
      </div>
    </>
  );
}

function getPageJsonLd(): WithContext<PageSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: new Date(USER.dateCreated).toISOString(),
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": "Person",
      name: USER.displayName,
      identifier: USER.username,
      image: USER.avatar,
    },
  };
}

function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-full border-x border-edge lg:border-x-0",
        "before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw]",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
        className
      )}
    />
  );
}
