import { Fragment } from "react";

import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links";
import type { SocialLinkKey } from "@/features/portfolio/types/social-links";
import { cn } from "@/lib/utils";

import { Icons } from "./icons";

const SOCIAL_ICONS: Record<
  SocialLinkKey,
  React.ComponentType<{ className?: string }>
> = {
  linkedin: Icons.linkedin,
  x: Icons.x,
  github: Icons.github,
};

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="max-w-screen overflow-x-hidden px-2">
      <div className="screen-line-before mx-auto border-x border-edge md:max-w-6xl lg:grid lg:grid-cols-[20rem_minmax(0,1fr)]">
        {/* Empty left rail — mirrors the profile column of the split layout */}
        <div className="hidden lg:block" aria-hidden />

        {/* Footer content — aligns with the content column on large screens */}
        <div className="pt-4 lg:border-l lg:border-edge">
          <p className="mb-4 px-4 text-center font-mono text-sm text-balance text-muted-foreground">
            © {year} Luca Alberto Giorgi · Built with Next.js
          </p>

          <div className="screen-line-before screen-line-after flex w-full before:z-1 after:z-1">
            <div className="mx-auto flex items-center justify-center gap-6 border-x border-edge bg-background px-6">
              {SOCIAL_LINKS.map((link, index) => {
                const Icon = SOCIAL_ICONS[link.key];

                return (
                  <Fragment key={link.key}>
                    {index > 0 && <Separator />}

                    <a
                      className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="size-4" />
                      <span className="sr-only">{link.title}</span>
                    </a>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex h-2" />
      </div>
    </footer>
  );
}

function Separator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex h-11 w-px bg-edge", className)} {...props} />;
}
