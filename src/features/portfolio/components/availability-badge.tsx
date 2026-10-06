import { USER } from "@/features/portfolio/data/user";
import { cn } from "@/lib/utils";

/**
 * "Open to work" status line. The signal green is reserved for this dot (and
 * the GitHub graph), so it is the one spot of colour in the hero. The ping
 * honours reduced motion.
 */
export function AvailabilityBadge({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 text-[15px] leading-6",
        className
      )}
    >
      <span className="relative flex size-2 shrink-0" aria-hidden>
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex size-2 rounded-full bg-success" />
      </span>
      {USER.availability}
    </p>
  );
}
