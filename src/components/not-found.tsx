import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { HeroChip } from "@/features/portfolio/components/chip/hero-chip";
import { cn } from "@/lib/utils";

/**
 * The homepage chip, marked as the error. Its pins still work: section links
 * fall back to the homepage, so the way out is the same as the way around.
 */
export function NotFound({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-[calc(100svh-5.5rem)] flex-col items-center justify-center px-5 py-12",
        className
      )}
    >
      <h1 className="text-center text-[2rem] leading-tight font-medium tracking-[-0.025em] sm:text-[2.625rem]">
        Page not found
      </h1>
      <p className="mt-3 max-w-[26rem] text-center text-base leading-7 text-muted-foreground">
        Nothing is connected to this address.
      </p>

      <HeroChip
        marking="Error 404"
        caption="Pins 1 to 4 lead back to a section of the homepage."
        className="mt-4"
      />

      <Button asChild size="lg" className="mt-8 px-5">
        <Link href="/">
          <ArrowLeftIcon />
          Back to the homepage
        </Link>
      </Button>
    </div>
  );
}
