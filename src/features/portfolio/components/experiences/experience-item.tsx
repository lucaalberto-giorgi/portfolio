import Image from "next/image";

import { cn } from "@/lib/utils";

import type { Experience } from "../../types/experiences";
import { formatPeriod } from "../../utils/format-period";
import { Entry, EntryPeriod } from "../entry";
import { RichText, StackList } from "../section";

export function ExperienceItem({
  experience,
  titleFrom = "company",
}: {
  experience: Experience;
  /**
   * Which field heads the entry. Education entries store the institution in
   * the position title, so they read better headed by it.
   */
  titleFrom?: "company" | "position";
}) {
  const logo = experience.companyLogo ? (
    <Image
      src={experience.companyLogo}
      alt=""
      width={36}
      height={36}
      quality={100}
      className={cn(
        "object-contain",
        experience.invertLogoOnDark && "dark:invert"
      )}
      unoptimized
    />
  ) : null;

  return (
    <>
      {experience.positions.map((position) => {
        const { start, end } = position.employmentPeriod;
        const isCompanyTitle = titleFrom === "company";

        return (
          <Entry
            key={position.id}
            logo={logo}
            title={isCompanyTitle ? experience.companyName : position.title}
            subtitle={
              isCompanyTitle
                ? [position.title, position.employmentType]
                    .filter(Boolean)
                    .join(", ")
                : undefined
            }
            aside={<EntryPeriod>{formatPeriod(start, end)}</EntryPeriod>}
          >
            {position.description && (
              <RichText>{position.description}</RichText>
            )}
            {position.skills && <StackList items={position.skills} />}
          </Entry>
        );
      })}
    </>
  );
}
