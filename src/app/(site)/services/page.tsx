import { permanentRedirect } from "next/navigation";

// Services and Solutions render the same CMS records. Consolidate to /solutions
// to avoid duplicate content and keep a single canonical URL set.
export default function ServicesRedirect() {
  permanentRedirect("/solutions");
}
