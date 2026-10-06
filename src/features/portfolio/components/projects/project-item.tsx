import { BoxIcon, ExternalLinkIcon, GithubIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { UTM_PARAMS } from "@/config/site";
import { addQueryParams } from "@/utils/url";

import type { Project } from "../../types/projects";
import { formatPeriod } from "../../utils/format-period";
import { getDemoLink } from "../../utils/project-links";
import { Entry } from "../entry";
import { RichText, StackList } from "../section";

export function ProjectItem({ project }: { project: Project }) {
  const demoLink = getDemoLink(project);
  const hasLinks = Boolean(demoLink || project.githubLink);

  const logo = project.logo ? (
    <Image
      src={project.logo}
      alt=""
      width={64}
      height={64}
      quality={100}
      className="size-10 rounded-lg ring-1 ring-border"
      unoptimized
    />
  ) : (
    <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground ring-1 ring-border">
      <BoxIcon className="size-5" />
    </div>
  );

  return (
    <Entry
      id={project.id}
      logo={logo}
      title={
        <>
          {project.title}
          {project.inProgress && (
            <span className="ml-2.5 inline-flex translate-y-[-2px] items-center rounded-full border border-border px-2 py-px align-middle text-xs leading-5 font-medium text-muted-foreground">
              In progress
            </span>
          )}
        </>
      }
      subtitle={
        <span className="tabular-nums">
          {formatPeriod(project.period.start, project.period.end)}
        </span>
      }
      aside={
        hasLinks && (
          <div className="flex items-center gap-2">
            {demoLink && (
              <Button asChild>
                <a
                  href={addQueryParams(demoLink, UTM_PARAMS)}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Open the ${project.title} live demo`}
                >
                  <ExternalLinkIcon />
                  Live demo
                </a>
              </Button>
            )}

            {project.githubLink && (
              // Source becomes the primary action when there's no public demo.
              <Button asChild variant={demoLink ? "outline" : "default"}>
                <a
                  href={addQueryParams(project.githubLink, UTM_PARAMS)}
                  target="_blank"
                  rel="noopener"
                  aria-label={`View the ${project.title} source on GitHub`}
                >
                  <GithubIcon />
                  GitHub
                </a>
              </Button>
            )}
          </div>
        )
      }
    >
      {project.description && (
        // The first paragraph is the one-line pitch, so it leads at body size.
        <RichText className="[&>p:first-child]:text-base [&>p:first-child]:leading-7">
          {project.description}
        </RichText>
      )}
      <StackList items={project.skills} />
    </Entry>
  );
}
