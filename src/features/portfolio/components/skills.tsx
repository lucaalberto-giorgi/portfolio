import Image from "next/image";

import {
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { cn } from "@/lib/utils";

import { TECH_STACK } from "../data/tech-stack";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";

// Filter to only show the technologies the user knows
const SKILLS_TO_SHOW = ["js", "react", "nextjs2", "react-native", "java"];

// Icon key mapping - use React icon for React Native since it's related
const ICON_KEY_MAP: Record<string, string> = {
  "react-native": "react",
};

export function Skills() {
  const skills = TECH_STACK.filter((tech) => SKILLS_TO_SHOW.includes(tech.key));

  return (
    <Panel id="skills">
      <PanelHeader>
        <PanelTitle>Skills</PanelTitle>
      </PanelHeader>

      <PanelContent
        className={cn(
          "[--pattern-foreground:var(--color-zinc-950)]/5 dark:[--pattern-foreground:var(--color-white)]/5",
          "bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center",
<<<<<<< HEAD
          "bg-zinc-950/0.75 dark:bg-white/0.75",
          "py-8"
        )}
      >
        <TooltipProvider>
          <ul className="flex flex-wrap justify-center items-center gap-8 select-none w-full sm:flex-nowrap sm:gap-12">
=======
          "bg-zinc-950/0.75 dark:bg-white/0.75"
        )}
      >
        <TooltipProvider>
          <ul className="flex flex-wrap justify-between items-center gap-4 select-none w-full sm:flex-nowrap">
>>>>>>> 668ab6b64fbfec563c29c094a4f9bc48a8625b96
            {skills.map((tech) => {
              // Use mapped icon key if available, otherwise use original key
              const iconKey = ICON_KEY_MAP[tech.key] || tech.key;

              return (
<<<<<<< HEAD
                <li key={tech.key} className="flex justify-center">
=======
                <li key={tech.key} className="flex flex-1 justify-center">
>>>>>>> 668ab6b64fbfec563c29c094a4f9bc48a8625b96
                  <TooltipRoot>
                    <TooltipTrigger
                      render={
                        <a
                          href={tech.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={tech.title}
                          className="flex justify-center items-center"
                        />
                      }
                    >
                      {tech.theme ? (
                        <>
                          <Image
                            src={`https://assets.chanhdai.com/images/tech-stack-icons/${iconKey}-light.svg`}
                            alt={`${tech.title} light icon`}
<<<<<<< HEAD
                            width={80}
                            height={80}
=======
                            width={64}
                            height={64}
>>>>>>> 668ab6b64fbfec563c29c094a4f9bc48a8625b96
                            className="hidden [html.light_&]:block"
                            unoptimized
                          />
                          <Image
                            src={`https://assets.chanhdai.com/images/tech-stack-icons/${iconKey}-dark.svg`}
                            alt={`${tech.title} dark icon`}
<<<<<<< HEAD
                            width={80}
                            height={80}
=======
                            width={64}
                            height={64}
>>>>>>> 668ab6b64fbfec563c29c094a4f9bc48a8625b96
                            className="hidden [html.dark_&]:block"
                            unoptimized
                          />
                        </>
                      ) : (
                        <Image
                          src={`https://assets.chanhdai.com/images/tech-stack-icons/${iconKey}.svg`}
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
    </Panel>
  );
}

