import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getLanding, resolveRole } from "@/lib/site";
import { INTRO_SEEN_COOKIE } from "@/lib/site-types";

import LandingClient from "./LandingClient";

// Read the site copy store on every request so edits appear without a
// rebuild. Filesystem reads are not treated as a request-time API, so without
// this the copy would be baked into the build output.
export const dynamic = "force-dynamic";

// `searchParams` is a Promise in this Next version and must be awaited.
type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  // The landing is a first-visit screen. Anyone who has already sat through
  // the intro goes straight to the catalog, and because the cookie arrives
  // with the request that happens before a frame of the landing renders.
  //
  // `?role=` is the exception: it is how the landing is previewed per
  // audience, so an explicit role always shows the page.
  const seen = (await cookies()).get(INTRO_SEEN_COOKIE)?.value === "1";
  if (seen && !params.role) redirect("/watch");

  // `?role=` selects the audience; anything unrecognised falls back to family.
  const role = resolveRole(params.role);
  const { content, introMinimizeDelayMs, stripeStaggerSeconds } = await getLanding(role);

  return (
    <LandingClient
      role={role}
      content={content}
      introMinimizeDelayMs={introMinimizeDelayMs}
      stripeStaggerSeconds={stripeStaggerSeconds}
    />
  );
}
