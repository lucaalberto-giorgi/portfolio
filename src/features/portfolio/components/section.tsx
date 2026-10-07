import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";

/**
 * A row of the CV-style grid: on large screens the section name sits in a
 * narrow left column, like a heading on the printed CV, with entries to its
 * right. Below `lg` the name stacks above the entries.
 */
function Section({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="section"
      className={cn(
        "grid gap-x-12 gap-y-5 py-10 lg:grid-cols-[11rem_minmax(0,1fr)] lg:py-12",
        // Section links focus the section; no ring around the whole block.
        "outline-none",
        className
      )}
      {...props}
    />
  );
}

function SectionTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="section-title"
      className={cn("text-[15px] leading-7 font-semibold", className)}
      {...props}
    />
  );
}

function SectionContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-content"
      className={cn("min-w-0", className)}
      {...props}
    />
  );
}

/** Plain, comma-separated technology list used under roles and projects. */
function StackList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <p className={cn("text-sm leading-6 text-muted-foreground", className)}>
      <span className="sr-only">Built with: </span>
      {items.join(", ")}
    </p>
  );
}

/**
 * Markdown body copy for roles and projects. Styled with plain selectors
 * rather than `prose` so it inherits the site's ink and graphite tokens.
 */
function RichText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-[42rem] text-[15px] leading-6 text-foreground",
        "[&_p]:my-0 [&_p+p]:mt-3 [&_p+ul]:mt-3",
        "[&_li]:pl-1 [&_li]:marker:text-muted-foreground [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5",
        "[&_strong]:font-semibold",
        "[&_a]:underline [&_a]:underline-offset-4",
        className
      )}
    >
      <Markdown>{children}</Markdown>
    </div>
  );
}

export { RichText, Section, SectionContent, SectionTitle, StackList };
