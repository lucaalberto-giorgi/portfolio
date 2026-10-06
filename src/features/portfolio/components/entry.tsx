import { cn } from "@/lib/utils";

type EntryProps = {
  id?: string;
  logo?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Right-aligned slot for the period or action buttons; wraps below on mobile. */
  aside?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

/**
 * One line item on the CV grid (a role, a degree, a project). Consecutive
 * entries are separated by a rule because they are rows of the same list.
 */
export function Entry({
  id,
  logo,
  title,
  subtitle,
  aside,
  children,
  className,
}: EntryProps) {
  return (
    <article
      id={id}
      className={cn(
        "border-t border-border py-8 first:border-t-0 first:pt-0 last:pb-0",
        className
      )}
    >
      <header className="flex gap-4 sm:gap-5">
        <div className="flex size-10 shrink-0 items-center justify-center select-none">
          {logo}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-x-6 gap-y-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-lg leading-7 font-semibold text-balance">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[15px] leading-6 text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          {aside && <div className="shrink-0 sm:pt-0.5">{aside}</div>}
        </div>
      </header>

      {/* Full width on mobile; aligned under the title from sm (logo + gap). */}
      {children && <div className="mt-4 space-y-4 sm:pl-15">{children}</div>}
    </article>
  );
}

/** Period shown in an entry's aside; tabular figures keep dates aligned. */
export function EntryPeriod({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] leading-6 text-muted-foreground tabular-nums sm:leading-7">
      {children}
    </p>
  );
}
