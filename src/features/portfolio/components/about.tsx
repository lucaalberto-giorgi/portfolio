import { Markdown } from "@/components/markdown";
import { ProseMono } from "@/components/ui/typography";
import { USER } from "@/features/portfolio/data/user";

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";

export function About() {
  return (
    <Panel id="about">
      <PanelHeader>
        <PanelTitle>About</PanelTitle>
      </PanelHeader>

<<<<<<< HEAD
      <PanelContent className="py-6">
=======
      <PanelContent>
>>>>>>> 668ab6b64fbfec563c29c094a4f9bc48a8625b96
        <ProseMono>
          <Markdown>{USER.about}</Markdown>
        </ProseMono>
      </PanelContent>
    </Panel>
  );
}
