import type { ProfilePage as PageSchema, WithContext } from "schema-dts";

import { About } from "@/features/portfolio/components/about";
import { CircuitTraces } from "@/features/portfolio/components/chip/circuit-traces";
import {
  Education,
  Experiences,
} from "@/features/portfolio/components/experiences";
import { GitHubContributions } from "@/features/portfolio/components/github-contributions";
import { Hero } from "@/features/portfolio/components/hero";
import { Projects } from "@/features/portfolio/components/projects";
import { Skills } from "@/features/portfolio/components/skills";
import { USER } from "@/features/portfolio/data/user";

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd()).replace(/</g, "\\u003c"),
        }}
      />

      {/* Full width, so the traces can run down the page margin. */}
      <div className="relative">
        <CircuitTraces />

        <div className="page-container">
          <Hero />
          <About />
          <Experiences />
          <Projects />
          <Education />
          <Skills />
          <GitHubContributions />
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
