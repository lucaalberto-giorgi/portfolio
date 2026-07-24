"use client";

import {
  BoxIcon,
  ExternalLinkIcon,
  GithubIcon,
  InfinityIcon,
} from "lucide-react";
import Image from "next/image";

import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import {
  CollapsibleChevronsIcon,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleWithContext,
} from "@/components/ui/collapsible";
import { Tag } from "@/components/ui/tag";
import { ProseMono } from "@/components/ui/typography";
import { UTM_PARAMS } from "@/config/site";
import { addQueryParams } from "@/utils/url";

import type { Project } from "../../types/projects";

export function ProjectItem({
  className,
  project,
}: {
  className?: string;
  project: Project;
}) {
  const { start, end } = project.period;
  const isOngoing = !end;
  const isSinglePeriod = end === start;
  const githubHref = addQueryParams(
    project.githubLink ?? project.link,
    UTM_PARAMS
  );

  return (
    <CollapsibleWithContext defaultOpen={project.isExpanded} asChild>
      <div className={className}>
        <div className="flex items-center hover:bg-accent2">
          {project.logo ? (
            <Image
              src={project.logo}
              alt={project.title}
              width={64}
              height={64}
              quality={100}
              className="mx-4 flex size-9 shrink-0 rounded-lg ring-1 ring-edge ring-offset-1 ring-offset-background select-none"
              unoptimized
              aria-hidden="true"
            />
          ) : (
            <div
              className="mx-4 flex size-9 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted text-muted-foreground ring-1 ring-edge ring-offset-1 ring-offset-background select-none"
              aria-hidden="true"
            >
              <BoxIcon className="size-5" />
            </div>
          )}

          <div className="flex flex-1 items-center gap-2 border-l border-dashed border-edge pr-2">
            <CollapsibleTrigger className="flex flex-1 items-center p-4 pr-0 text-left">
              <div className="flex-1">
                <h3 className="mb-1 leading-snug font-medium text-balance">
                  {project.title}
                </h3>

                <dl className="text-sm text-muted-foreground">
                  <dt className="sr-only">Period</dt>
                  <dd className="flex items-center gap-0.5">
                    <span>{start}</span>
                    {!isSinglePeriod && (
                      <>
                        <span className="font-mono">—</span>
                        {isOngoing ? (
                          <>
                            <InfinityIcon
                              className="size-4.5 translate-y-[0.5px]"
                              aria-hidden
                            />
                            <span className="sr-only">Present</span>
                          </>
                        ) : (
                          <span>{end}</span>
                        )}
                      </>
                    )}
                  </dd>
                </dl>
              </div>
            </CollapsibleTrigger>

            <div className="flex shrink-0 items-center gap-2">
              <Button asChild size="sm" className="max-sm:px-2">
                <a
                  href={addQueryParams(project.link, UTM_PARAMS)}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Open the ${project.title} live demo`}
                >
                  <ExternalLinkIcon />
                  <span className="max-sm:hidden">Live demo</span>
                </a>
              </Button>

              {project.githubLink && (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="max-sm:px-2"
                >
                  <a
                    href={githubHref}
                    target="_blank"
                    rel="noopener"
                    aria-label={`View the ${project.title} source on GitHub`}
                  >
                    <GithubIcon />
                    <span className="max-sm:hidden">GitHub</span>
                  </a>
                </Button>
              )}
            </div>

            <CollapsibleTrigger
              className="shrink-0 rounded-lg p-2 text-muted-foreground hover:text-foreground [&_svg]:size-4"
              aria-label={`Toggle ${project.title} details`}
            >
              <CollapsibleChevronsIcon />
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent className="group overflow-hidden duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="border-t border-edge shadow-inner">
            <div className="space-y-4 p-4 duration-300 group-data-[state=closed]:animate-fade-out group-data-[state=open]:animate-fade-in">
              {project.description && (
                <ProseMono>
                  <Markdown>{project.description}</Markdown>
                </ProseMono>
              )}

              {project.skills.length > 0 && (
                <ul className="flex flex-wrap gap-1.5">
                  {project.skills.map((skill, index) => (
                    <li key={index} className="flex">
                      <Tag>{skill}</Tag>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </CollapsibleWithContext>
  );
}
