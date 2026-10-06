import { ProfileActions } from "@/features/portfolio/components/profile-actions";
import {
  Section,
  SectionContent,
  SectionTitle,
} from "@/features/portfolio/components/section";
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links";
import { USER } from "@/features/portfolio/data/user";
import type { SocialLinkKey } from "@/features/portfolio/types/social-links";

// Short labels for inline text links ("X" rather than "X (formerly Twitter)").
const SOCIAL_LABELS: Record<SocialLinkKey, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  x: "X",
};

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="page-container">
      <Section id="contact">
        <SectionTitle>Contact</SectionTitle>
        <SectionContent className="space-y-6">
          <p className="max-w-[42rem] text-base leading-7">
            Email is the quickest way to reach me. My CV is a one-page PDF.
          </p>

          <ProfileActions />

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] leading-6">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.key}>
                <a
                  className="underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SOCIAL_LABELS[link.key]}
                </a>
              </li>
            ))}
          </ul>
        </SectionContent>
      </Section>

      <div className="flex flex-col gap-1 border-t border-border py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          © {year} {USER.displayName}
        </p>
        <p>Built with Next.js</p>
      </div>
    </footer>
  );
}
