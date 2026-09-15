import { redirect } from "next/navigation";

// The blurred-banner layout was tried here as "v2" and is now the title page
// itself, so this address only forwards to it.

type PageProps = { params: Promise<{ id: string }> };

export default async function TitleV2Redirect({ params }: PageProps) {
  const { id } = await params;
  redirect(`/watch/${encodeURIComponent(id)}`);
}
