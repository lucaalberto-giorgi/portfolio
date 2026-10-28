import { USER } from "@/features/portfolio/data/user";

import { AvailabilityBadge } from "./availability-badge";
import { HeroChip } from "./chip/hero-chip";
import { ProfileActions } from "./profile-actions";

export function Hero() {
  return (
    // minmax(0, 1fr): the chip figure must not widen the text column on phones.
    <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-x-10 gap-y-10 pt-10 pb-8 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:pt-20 lg:pb-14">
      <div>
        <div className="flex items-center gap-5 sm:gap-6">
          <img
            className="size-20 shrink-0 rounded-full object-cover ring-1 ring-border ring-offset-2 ring-offset-background select-none sm:size-24"
            alt={`${USER.displayName}'s avatar`}
            src={USER.avatar}
            width={96}
            height={96}
            fetchPriority="high"
          />

          <div>
            <h1 className="text-lg leading-7 font-semibold sm:text-[21px]">
              {USER.displayName}
            </h1>
            <p className="text-[15px] leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {USER.jobTitle} in {USER.address.split(",")[0]}
            </p>
          </div>
        </div>

        {/* Opening statement: the largest text on the page, set calm and plain. */}
        <p className="mt-8 max-w-[15em] text-[2rem] leading-[1.15] font-medium tracking-[-0.025em] text-balance sm:mt-10 sm:text-[2.625rem] lg:text-[2.875rem]">
          {USER.headline}
        </p>

        {/* The header's Contact button fades in once this row scrolls away. */}
        <div
          id="hero-actions"
          className="mt-8 flex flex-col gap-5 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8"
        >
          <ProfileActions />
          <AvailabilityBadge />
        </div>
      </div>

      <HeroChip className="max-lg:mx-auto" />
    </section>
  );
}
