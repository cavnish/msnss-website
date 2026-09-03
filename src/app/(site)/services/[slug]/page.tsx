import { permanentRedirect } from "next/navigation";

// Redirect legacy /services/[slug] URLs to the canonical /solutions/[slug].
export default async function ServiceSlugRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/solutions/${slug}`);
}
