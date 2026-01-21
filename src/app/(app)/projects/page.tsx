import { Panel, PanelContent, PanelHeader, PanelTitle } from "@/features/portfolio/components/panel";

export default function ProjectsPage() {
  return (
    <div className="mx-auto md:max-w-3xl">
      <Panel>
        <PanelHeader>
          <PanelTitle>Projects</PanelTitle>
        </PanelHeader>
        <PanelContent>
          <p className="text-muted-foreground">
            Projects coming soon...
          </p>
        </PanelContent>
      </Panel>
    </div>
  );
}

