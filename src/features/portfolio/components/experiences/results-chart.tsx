import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/** The mark a First-Class degree needs, drawn as the chart's threshold. */
const FIRST_CLASS_MARK = 70;

const TICKS = [0, 50, 100];

/**
 * Marks out of 100 as a ranked bar chart, like the "typical characteristics"
 * graphs in a datasheet: one series in ink, so no legend; solid hairline
 * gridlines; a dashed line for the one real threshold. Every mark also
 * appears in the text above, which doubles as the table view.
 */
export function ResultsChart({
  results,
  figure,
}: {
  results: { label: string; mark: number }[];
  figure?: number;
}) {
  const ranked = [...results].sort((a, b) => b.mark - a.mark);

  return (
    <figure className="max-w-[42rem] pt-2">
      <div className="grid grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)_2rem] gap-x-3 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_2rem] sm:gap-x-4">
        {/* Threshold label, above the track at its mark. */}
        <div className="relative col-start-2 h-6">
          <span
            className="absolute bottom-1.5 -translate-x-1/2 text-xs leading-none whitespace-nowrap text-muted-foreground"
            style={{ left: `${FIRST_CLASS_MARK}%` }}
          >
            First ({FIRST_CLASS_MARK})
          </span>
        </div>

        <ol
          aria-label="Marks out of 100"
          className="col-span-3 grid grid-cols-subgrid [@media(hover:hover)]:[&:has(li:hover)_li:not(:hover)_[data-bar]]:opacity-35"
        >
          {ranked.map((result) => (
            <li
              key={result.label}
              className="col-span-3 grid grid-cols-subgrid items-center py-[5px]"
            >
              <span className="text-sm leading-5 text-pretty">
                {result.label}
              </span>

              <span className="relative flex h-full items-center">
                <Gridlines />
                <span
                  data-bar
                  className="relative h-2.5 rounded-r-[4px] bg-foreground transition-opacity duration-150"
                  style={{ width: `${result.mark}%` } as CSSProperties}
                />
              </span>

              <span className="text-right text-sm leading-5 font-semibold tabular-nums">
                {result.mark}
              </span>
            </li>
          ))}
        </ol>

        {/* Axis */}
        <div className="relative col-start-2 mt-1 h-5 border-t border-border">
          {TICKS.map((tick) => (
            <span
              key={tick}
              className={cn(
                "absolute top-1.5 text-xs leading-none text-muted-foreground tabular-nums",
                tick === 0
                  ? "left-0"
                  : tick === 100
                    ? "right-0"
                    : "-translate-x-1/2"
              )}
              style={tick > 0 && tick < 100 ? { left: `${tick}%` } : undefined}
            >
              {tick}
            </span>
          ))}
        </div>
      </div>

      <figcaption className="mt-3 text-sm leading-6 text-muted-foreground">
        {figure && (
          <span className="font-semibold text-foreground">
            Figure {figure}.{" "}
          </span>
        )}
        Marks out of 100 for the dissertation and standout modules. A
        First-Class degree needs {FIRST_CLASS_MARK}.
      </figcaption>
    </figure>
  );
}

/** Hairlines at the ticks and the dashed First-class threshold, per row. */
function Gridlines() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -inset-y-[5px]"
    >
      {TICKS.map((tick) => (
        <span
          key={tick}
          className="absolute inset-y-0 w-px bg-border"
          style={{ left: `calc(${tick}% - ${tick === 100 ? 1 : 0}px)` }}
        />
      ))}
      <span
        className="absolute inset-y-0 w-px border-l border-dashed border-muted-foreground/60"
        style={{ left: `${FIRST_CLASS_MARK}%` }}
      />
    </span>
  );
}
