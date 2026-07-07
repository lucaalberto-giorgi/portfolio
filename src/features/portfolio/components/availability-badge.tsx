import { cn } from "@/lib/utils";

/**
 * Always-visible "open to work" signal shown near the name in both the sidebar
 * and the mobile profile header. Uses the same primary fill as the "Get in
 * touch" button so it inverts with the theme (dark pill in light mode, light
 * pill in dark mode). The pinging dot honours reduced motion.
 */
export function AvailabilityBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1",
        "bg-primary font-mono text-xs font-medium text-primary-foreground select-none",
        className
      )}
    >
      <span className="relative flex size-1.5" aria-hidden>
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-80 motion-reduce:animate-none" />
        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
      </span>
      Available for work
    </span>
  );
}
