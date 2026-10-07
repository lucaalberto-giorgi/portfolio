import { USER } from "@/features/portfolio/data/user";

import { AvailabilityBadge } from "./availability-badge";
import { ProfileActions } from "./profile-actions";

export function Hero() {
  return (
    <section className="pt-10 pb-6 sm:pt-16 lg:pt-24 lg:pb-10">
      <div className="flex items-center gap-5 sm:gap-6">
        <img
          className="size-20 shrink-0 rounded-full object-cover ring-1 ring-border ring-offset-2 ring-offset-background select-none sm:size-28"
          alt={`${USER.displayName}'s avatar`}
          src={USER.avatar}
          width={112}
          height={112}
          fetchPriority="high"
        />

        <div>
          <h1 className="text-lg leading-7 font-semibold sm:text-xl">
            {USER.displayName}
          </h1>
          <p className="text-[15px] leading-6 text-muted-foreground sm:text-base sm:leading-7">
            {USER.jobTitle} in {USER.address.split(",")[0]}
          </p>
        </div>
      </div>

      {/* Opening statement: the largest text on the page, set calm and plain. */}
      <p className="mt-8 max-w-[20em] text-[2rem] leading-[1.2] font-medium tracking-[-0.02em] text-balance motion-safe:animate-in motion-safe:duration-500 motion-safe:fade-in motion-safe:slide-in-from-bottom-1 sm:mt-10 sm:text-[2.5rem] sm:leading-[1.15] lg:text-[2.875rem]">
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
    </section>
  );
}
