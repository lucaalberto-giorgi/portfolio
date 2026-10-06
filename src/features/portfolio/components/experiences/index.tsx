import { EXPERIENCES } from "../../data/experiences";
import { Section, SectionContent, SectionTitle } from "../section";
import { ExperienceItem } from "./experience-item";

// The degree is stored in EXPERIENCES under this id, but on the page it gets
// its own section (and the #education anchor), as on the CV.
const EDUCATION_ID = "education";

export function Experiences() {
  return (
    <Section id="experience">
      <SectionTitle>Experience</SectionTitle>
      <SectionContent>
        {EXPERIENCES.filter(({ id }) => id !== EDUCATION_ID).map(
          (experience) => (
            <ExperienceItem key={experience.id} experience={experience} />
          )
        )}
      </SectionContent>
    </Section>
  );
}

export function Education() {
  const education = EXPERIENCES.find(({ id }) => id === EDUCATION_ID);

  if (!education) {
    return null;
  }

  return (
    <Section id={EDUCATION_ID}>
      <SectionTitle>Education</SectionTitle>
      <SectionContent>
        <ExperienceItem experience={education} titleFrom="position" />
      </SectionContent>
    </Section>
  );
}
