import { format, subMonths } from "date-fns";
import { unstable_cache } from "next/cache";

import type { Activity } from "@/components/kibo-ui/contribution-graph";
import { GITHUB_USERNAME } from "@/config/site";

/** How far back the graph goes: recent enough to read as current activity. */
export const CONTRIBUTION_MONTHS = 6;

type GitHubContributionsResponse = {
  contributions: Activity[];
};

export const getGitHubContributions = unstable_cache(
  async (): Promise<Activity[]> => {
    try {
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`
      );

      if (!res.ok) {
        return [];
      }

      const data = (await res.json()) as GitHubContributionsResponse;
      // ISO dates compare correctly as strings.
      const since = format(
        subMonths(new Date(), CONTRIBUTION_MONTHS),
        "yyyy-MM-dd"
      );

      return (data.contributions ?? []).filter(({ date }) => date >= since);
    } catch {
      // Third-party API down, network error, or malformed response:
      // degrade to an empty result instead of crashing the page render.
      return [];
    }
  },
  ["github-contributions", `${CONTRIBUTION_MONTHS}m`],
  { revalidate: 86400 } // Cache for 1 day (86400 seconds)
);
