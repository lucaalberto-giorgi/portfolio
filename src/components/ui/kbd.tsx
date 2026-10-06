import { cn } from "@/lib/utils";

/** Keycap for keyboard-shortcut hints. The thicker bottom edge reads as a key. */
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-[5px] border border-b-2 border-border px-1",
        "font-mono text-[10px] leading-none font-medium text-muted-foreground select-none",
        className
      )}
      {...props}
    />
  );
}

export { Kbd };
