import {
  CONTRIBUTION_MONTHS,
  getGitHubContributions,
} from "../../data/github-contributions";
import { Section, SectionContent, SectionTitle } from "../section";
import { GitHubContributionGraph } from "./graph";

export async function GitHubContributions() {
  const contributions = await getGitHubContributions();

  // No data (e.g. the GitHub stats API was unreachable): hide the whole
  // section rather than render an empty graph.
  if (contributions.length === 0) {
    return null;
  }

  return (
    <Section id="contributions">
      <SectionTitle>GitHub</SectionTitle>
      <SectionContent>
        <GitHubContributionGraph
          contributions={contributions}
          months={CONTRIBUTION_MONTHS}
        />
      </SectionContent>
    </Section>
  );
}
