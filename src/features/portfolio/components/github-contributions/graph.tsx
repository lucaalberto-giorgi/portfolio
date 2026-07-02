"use client";

import { format } from "date-fns";

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
}: {
  contributions: Activity[];
}) {
  const data = contributions;

  return (
    <TooltipProvider>
      <ContributionGraph
        className="mx-auto py-2"
        data={data}
        blockSize={12}
        blockMargin={3}
        blockRadius={2}
      >
        <ContributionGraphCalendar
          className="no-scrollbar px-2 supports-timeline-scroll:scroll-fade-effect-x supports-timeline-scroll:[--mask-width:2rem]"
          title="GitHub Contributions"
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

              <TooltipContent className="font-sans">
                <p>
                  {activity.count} contribution{activity.count > 1 ? "s" : null}{" "}
                  on {format(new Date(activity.date), "dd.MM.yyyy")}
                </p>
              </TooltipContent>
            </TooltipRoot>
          )}
        </ContributionGraphCalendar>

        <ContributionGraphFooter className="px-2">
          <ContributionGraphTotalCount>
            {({ totalCount, year }) => (
              <div className="text-muted-foreground">
                {totalCount.toLocaleString("en")} contributions in {year} on{" "}
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
