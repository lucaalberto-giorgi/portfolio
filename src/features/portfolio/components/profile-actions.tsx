"use client";

import { DownloadIcon, MailIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { USER } from "@/features/portfolio/data/user";
import { useIsClient } from "@/hooks/use-is-client";
import { decodeEmail } from "@/utils/string";

const CV_FILE = "/luca-alberto-giorgi-cv.pdf";
const CV_DOWNLOAD_NAME = "Luca-Alberto-Giorgi-CV.pdf";

export function ProfileActions() {
  // Decode the email only on the client so it never ships in the SSR HTML
  // (keeps it out of reach of naive address-harvesting scrapers).
  const isClient = useIsClient();
  const email = decodeEmail(USER.email);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button asChild size="sm">
        <a
          href={isClient ? `mailto:${email}` : "#"}
          aria-label={isClient ? `Send an email to ${email}` : "Send an email"}
        >
          <MailIcon />
          Get in touch
        </a>
      </Button>

      <Button asChild variant="outline" size="sm">
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
