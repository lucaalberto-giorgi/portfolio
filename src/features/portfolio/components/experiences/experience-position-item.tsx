import { InfinityIcon } from "lucide-react";
import React from "react";

import { Markdown } from "@/components/markdown";
import {
  CollapsibleChevronsIcon,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleWithContext,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Tag } from "@/components/ui/tag";
import { ProseMono } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

import type { ExperiencePosition } from "../../types/experiences";

export function ExperiencePositionItem({
  position,
}: {
  position: ExperiencePosition;
}) {
  const { start, end } = position.employmentPeriod;
  const isOngoing = !end;

  return (
    <CollapsibleWithContext defaultOpen={position.isExpanded} asChild>
      <div className="relative">
        <CollapsibleTrigger
          className={cn(
            "block w-full text-left",
            "relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-0 before:-z-1 before:rounded-lg before:transition-[background-color] before:ease-out hover:before:bg-accent2"
          )}
        >
          <div className="relative z-1 mb-1 flex items-center gap-3">
            <h4 className="flex-1 font-medium text-balance">
              {position.title}
            </h4>

            <div
              className="shrink-0 text-muted-foreground [&_svg]:size-4"
              aria-hidden
            >
              <CollapsibleChevronsIcon />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {position.employmentType && (
              <>
                <dl>
                  <dt className="sr-only">Employment Type</dt>
                  <dd>{position.employmentType}</dd>
                </dl>

                <Separator
                  className="data-[orientation=vertical]:h-4"
                  orientation="vertical"
                />
              </>
            )}

            <dl>
              <dt className="sr-only">Employment Period</dt>
              <dd className="flex items-center gap-0.5">
                <span>{start}</span>
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
              </dd>
            </dl>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden duration-300 data-[state=closed]:animate-collapsible-fade-up data-[state=open]:animate-collapsible-fade-down">
          {position.description && (
            <ProseMono className="pt-2">
              <Markdown>{position.description}</Markdown>
            </ProseMono>
          )}
        </CollapsibleContent>

        {Array.isArray(position.skills) && position.skills.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 pt-3">
            {position.skills.map((skill, index) => (
              <li key={index} className="flex">
                <Tag>{skill}</Tag>
              </li>
            ))}
          </ul>
        )}
      </div>
    </CollapsibleWithContext>
  );
}
