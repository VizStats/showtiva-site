import { notFound, redirect } from "next/navigation";

import { getSections } from "@/lib/content";
import { SHORTS_SECTION_ID } from "@/lib/content-types";

// Read per request, like the rest of the catalog, so reordering the Shorts
// row in the admin changes which short the feed opens on.
export const dynamic = "force-dynamic";

/**
 * A stable door into the feed.
 *
 * /shorts/[id] needs an id, which anything linking in from outside the
 * catalog — the landing page, a shared link, a bookmark — has no way to know.
 * This resolves the first short in the row and hands over, so the feed has one
 * address that always works.
 */
export default async function ShortsIndexPage() {
  const sections = await getSections();
  const first = sections.find((section) => section.id === SHORTS_SECTION_ID)?.movies[0];

  if (!first) notFound();

  redirect(`/shorts/${first.id}`);
}
