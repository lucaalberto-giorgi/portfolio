"use client";

import { format, parseISO } from "date-fns";

import {
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import type { Activity } from "@/components/kibo-ui/contribution-graph";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import { GITHUB_USERNAME, UTM_PARAMS } from "@/config/site";
import { addQueryParams } from "@/utils/url";

export function GitHubContributionGraph({
  contributions,
  months,
}: {
  contributions: Activity[];
  /** Length of the window shown, for the total line. */
  months: number;
}) {
  const data = contributions;

  return (
    <TooltipProvider>
      <ContributionGraph
        data={data}
        blockSize={12}
        blockMargin={3}
        blockRadius={2}
      >
        <ContributionGraphCalendar
          className="no-scrollbar supports-timeline-scroll:scroll-fade-effect-x supports-timeline-scroll:[--mask-width:2rem]"
          title="GitHub Contributions"
          // On narrow screens the graph overflows; open on the newest weeks.
          ref={(node: HTMLDivElement | null) => {
            if (node) node.scrollLeft = node.scrollWidth;
          }}
        >
          {({ activity, dayIndex, weekIndex }) => (
            <TooltipRoot>
              <TooltipTrigger render={<g />}>
                <ContributionGraphBlock
                  activity={activity}
                  dayIndex={dayIndex}
                  weekIndex={weekIndex}
                />
              </TooltipTrigger>

              {/* parseISO reads the date as local; new Date() would read it as
                  UTC midnight and show the previous day west of London. */}
              <TooltipContent className="font-sans">
                <p>
                  {activity.count} contribution{activity.count === 1 ? "" : "s"}{" "}
                  on {format(parseISO(activity.date), "dd.MM.yyyy")}
                </p>
              </TooltipContent>
            </TooltipRoot>
          )}
        </ContributionGraphCalendar>

        <ContributionGraphFooter>
          <ContributionGraphTotalCount>
            {({ totalCount }) => (
              // The footer is nowrap; let this line wrap on the narrowest phones.
              <div className="whitespace-normal text-muted-foreground">
                {totalCount.toLocaleString("en")} contributions in the last{" "}
                {months} months on{" "}
                <a
                  className="font-medium underline underline-offset-4"
                  href={addQueryParams(
                    `https://github.com/${GITHUB_USERNAME}`,
                    UTM_PARAMS
                  )}
                  target="_blank"
                  rel="noopener"
                >
                  GitHub
                </a>
                .
              </div>
            )}
          </ContributionGraphTotalCount>

          <ContributionGraphLegend />
        </ContributionGraphFooter>
      </ContributionGraph>
    </TooltipProvider>
  );
}
