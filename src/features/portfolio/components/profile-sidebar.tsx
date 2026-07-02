import { CodeXmlIcon, MapPinIcon } from "lucide-react";

import { FlipSentences } from "@/components/flip-sentences";
import { USER } from "@/features/portfolio/data/user";

import { CurrentLocalTimeItem } from "./overview/current-local-time-item";
import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from "./overview/intro-item";
import { ProfileActions } from "./profile-actions";
import { VerifiedIcon } from "./verified-icon";

/**
 * Stacked, vertically-oriented profile used as the sticky left column of the
 * split layout on large screens. The horizontal `ProfileHeader` is still used
 * for the single-column (mobile/tablet) layout.
 */
export function ProfileSidebar() {
  return (
    <div className="flex flex-col gap-5 bg-background px-6 pt-4 pb-6">
      <img
        className="size-32 rounded-full object-cover ring-1 ring-border ring-offset-2 ring-offset-background select-none"
        alt={`${USER.displayName}'s avatar`}
        src={USER.avatar}
        fetchPriority="high"
      />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-balance">
            {USER.displayName}
          </h1>

          <VerifiedIcon
            className="size-4.5 text-info select-none"
            aria-label="Verified"
          />
        </div>

        <div className="flex h-10 items-start">
          <FlipSentences
            className="font-mono text-sm text-balance text-muted-foreground"
            interval={3}
          >
            {USER.flipSentences}
          </FlipSentences>
        </div>
      </div>

      <div className="-mx-6 border-t border-edge" />

      <div className="space-y-3">
        <IntroItem>
          <IntroItemIcon>
            <CodeXmlIcon />
          </IntroItemIcon>
          <IntroItemContent aria-label={`Role: ${USER.jobTitle}`}>
            {USER.jobTitle}
          </IntroItemContent>
        </IntroItem>

        <IntroItem>
          <IntroItemIcon>
            <MapPinIcon />
          </IntroItemIcon>
          <IntroItemContent>
            <IntroItemLink
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(USER.address)}`}
              aria-label={`Location: ${USER.address}`}
            >
              {USER.address}
            </IntroItemLink>
          </IntroItemContent>
        </IntroItem>

        <CurrentLocalTimeItem timeZone={USER.timeZone} />
      </div>

      <div className="-mx-6 border-t border-edge" />

      <ProfileActions />
    </div>
  );
}
