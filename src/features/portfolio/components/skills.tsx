import Image from "next/image";

import {
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";

import { TECH_STACK } from "../data/tech-stack";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";

// Only show technologies actually used across the projects/experience above,
// listed in display order.
const SKILLS_TO_SHOW = [
  "react",
  "nextjs2",
  "typescript",
  "js",
  "tailwindcss",
  "python",
];

// Full, categorised stack (kept in sync with the CV). Everything here is
// evidenced by the experience, projects, or education above — no filler.
const SKILL_GROUPS: { title: string; items: string[] }[] = [
  {
    title: "Frontend",
    items: [
      "React",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Vite",
    ],
  },
  {
    title: "Backend",
    items: ["FastAPI (Python)", "REST APIs"],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "Next.js", "Supabase", "Sanity"],
  },
  {
    title: "AI",
    items: ["LLM Integration", "OpenAI API", "NLP Fundamentals"],
  },
];

export function Skills() {
  const skills = SKILLS_TO_SHOW.map((key) =>
    TECH_STACK.find((tech) => tech.key === key)
  ).filter(Boolean);

  return (
    <Panel id="skills">
      <PanelHeader>
        <PanelTitle>Skills</PanelTitle>
      </PanelHeader>

      <PanelContent
        className={cn(
          "[--pattern-foreground:var(--color-zinc-950)]/5 dark:[--pattern-foreground:var(--color-white)]/5",
          "bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center",
          "bg-zinc-950/0.75 dark:bg-white/0.75",
          "py-8"
        )}
      >
        <TooltipProvider>
          <ul className="flex w-full flex-wrap items-center justify-center gap-8 select-none sm:flex-nowrap sm:gap-12">
            {skills.map((tech) => {
              const iconKey = tech.key;

              return (
                <li key={tech.key} className="flex justify-center">
                  <TooltipRoot>
                    <TooltipTrigger
                      render={
                        <a
                          href={tech.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={tech.title}
                          className="flex items-center justify-center"
                        />
                      }
                    >
                      {tech.theme ? (
                        <>
                          <Image
                            src={`/images/tech-stack-icons/${iconKey}-light.svg`}
                            alt={`${tech.title} light icon`}
                            width={80}
                            height={80}
                            className="hidden [html.light_&]:block"
                            unoptimized
                          />
                          <Image
                            src={`/images/tech-stack-icons/${iconKey}-dark.svg`}
                            alt={`${tech.title} dark icon`}
                            width={80}
                            height={80}
                            className="hidden [html.dark_&]:block"
                            unoptimized
                          />
                        </>
                      ) : (
                        <Image
                          src={`/images/tech-stack-icons/${iconKey}.svg`}
                          alt={`${tech.title} icon`}
                          width={64}
                          height={64}
                          unoptimized
                        />
                      )}
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>{tech.title}</p>
                    </TooltipContent>
                  </TooltipRoot>
                </li>
              );
            })}
          </ul>
        </TooltipProvider>
      </PanelContent>

      <PanelContent className="space-y-5 border-t border-edge">
        {SKILL_GROUPS.map((group) => (
          <div
            key={group.title}
            className="flex flex-col gap-2 sm:flex-row sm:gap-4"
          >
            <h3 className="shrink-0 pt-0.5 font-mono text-xs tracking-wide text-muted-foreground uppercase sm:w-20">
              {group.title}
            </h3>
            <ul className="flex flex-1 flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li key={item} className="flex">
                  <Tag>{item}</Tag>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </PanelContent>
    </Panel>
  );
}
