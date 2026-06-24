import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { USER } from "@/features/portfolio/data/user";

const CV_FILE = "/luca-alberto-giorgi-cv.pdf";
const CV_DOWNLOAD_NAME = "Luca-Alberto-Giorgi-CV.pdf";

export function ProfileActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button asChild size="sm">
        <a
          href={CV_FILE}
          download={CV_DOWNLOAD_NAME}
          aria-label={`Download ${USER.displayName}'s CV (PDF file)`}
        >
          <DownloadIcon />
          Download CV
        </a>
      </Button>
    </div>
  );
}
