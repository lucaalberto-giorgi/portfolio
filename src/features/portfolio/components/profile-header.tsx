import { FlipSentences } from "@/components/flip-sentences";
import { USER } from "@/features/portfolio/data/user";

import { AvailabilityBadge } from "./availability-badge";
import { ProfileActions } from "./profile-actions";
import { VerifiedIcon } from "./verified-icon";

// Profile block for the single-column (mobile/tablet) layout: stacked on
// mobile, side-by-side from sm. The desktop split layout uses ProfileSidebar.
export function ProfileHeader() {
  return (
    <div className="screen-line-after border-x border-edge p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <img
          className="size-24 shrink-0 rounded-full object-cover ring-1 ring-border ring-offset-2 ring-offset-background select-none sm:size-28"
          alt={`${USER.displayName}'s avatar`}
          src={USER.avatar}
          width={112}
          height={112}
          fetchPriority="high"
        />

        <div className="flex flex-1 flex-col gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-balance sm:text-3xl">
                {USER.displayName}
              </h1>

              <VerifiedIcon
                className="size-5 text-info select-none"
                aria-label="Verified"
              />
            </div>

            <div className="flex min-h-6 items-start">
              <FlipSentences
                className="font-mono text-sm text-balance text-muted-foreground"
                interval={3}
              >
                {USER.flipSentences}
              </FlipSentences>
            </div>

            <AvailabilityBadge className="mt-1" />
          </div>

          <ProfileActions />
        </div>
      </div>
    </div>
  );
}
