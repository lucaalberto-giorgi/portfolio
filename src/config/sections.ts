/**
 * Homepage sections in the header menu. Each one's hotkey is also its pin
 * number on the hero chip and the number on its section title, so 1-4 jump
 * to the matching section from anywhere.
 */
export const SECTIONS = [
  { id: "experience", label: "Experience", hotkey: "1" },
  { id: "projects", label: "Projects", hotkey: "2" },
  { id: "education", label: "Education", hotkey: "3" },
  { id: "skills", label: "Skills", hotkey: "4" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/** The pin number for a section, as shown on its title. */
export function getSectionPin(id: SectionId) {
  return SECTIONS.find((section) => section.id === id)?.hotkey;
}
