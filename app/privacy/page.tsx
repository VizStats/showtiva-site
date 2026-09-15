import type { Metadata } from "next";

import { PRIVACY } from "@/lib/legal";
import InfoShell from "../_site/InfoShell";
import LegalDocument from "../_site/LegalDocument";

// The footer copy comes from the site store, read per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: PRIVACY.title, description: PRIVACY.description };

export default function Page() {
  return (
    <InfoShell>
      <LegalDocument doc={PRIVACY} />
    </InfoShell>
  );
}
