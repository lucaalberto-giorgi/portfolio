import { USER } from "@/features/portfolio/data/user";

import { RichText, Section, SectionContent, SectionTitle } from "./section";

export function About() {
  return (
    <Section id="about">
      <SectionTitle>About</SectionTitle>
      <SectionContent>
        <RichText className="text-base leading-7 [&_p+p]:mt-4">
          {USER.about}
        </RichText>
      </SectionContent>
    </Section>
  );
}
