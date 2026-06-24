import { cn } from "@/lib/utils";

import { Icons } from "./icons";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="max-w-screen overflow-x-hidden px-2">
      <div className="screen-line-before mx-auto border-x border-edge pt-4 md:max-w-4xl">
        <p className="mb-4 px-4 text-center font-mono text-sm text-balance text-muted-foreground">
          © {year} Luca Alberto Giorgi · Built with Next.js
        </p>

        <div className="screen-line-before screen-line-after flex w-full before:z-1 after:z-1">
          <div className="mx-auto flex items-center justify-center gap-6 border-x border-edge bg-background px-6">
            <a
              className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
              href="https://www.linkedin.com/in/luca-alberto-giorgi-89710a357"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.linkedin className="size-4" />
              <span className="sr-only">LinkedIn</span>
            </a>

            <Separator />

            <a
              className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
              href="https://x.com/lucaalberto2004"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.x className="size-4" />
              <span className="sr-only">X</span>
            </a>

            <Separator />

            <a
              className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
              href="https://github.com/lucaalberto-giorgi"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.github className="size-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </div>

      <div className="pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex h-2" />
      </div>
    </footer>
  );
}

function Separator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex h-11 w-px bg-edge", className)} {...props} />;
}
