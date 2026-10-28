import { cn } from "@/lib/utils";

/**
 * A pin number in a small square pad. The same numbers label the hero
 * chip's pins, the header menu, the section titles and the 1-4 shortcuts, so
 * the pad says "this is pin 2, press 2 to come back here".
 */
export function PinPad({
  children,
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-[1.125rem] shrink-0 items-center justify-center rounded-[5px] border border-border text-[10.5px] leading-none font-semibold text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
