import { getGitHubContributions } from "../../data/github-contributions";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "../panel";
import { GitHubContributionGraph } from "./graph";

export async function GitHubContributions() {
  const contributions = await getGitHubContributions();

  // No data (e.g. the GitHub stats API was unreachable) — hide the whole
  // section rather than render an empty graph.
  if (contributions.length === 0) {
    return null;
  }

  return (
    <Panel id="contributions">
      <PanelHeader>
        <PanelTitle>GitHub Activity</PanelTitle>
      </PanelHeader>

      <PanelContent className="px-0 py-4">
        <GitHubContributionGraph contributions={contributions} />
      </PanelContent>
    </Panel>
  );
}
