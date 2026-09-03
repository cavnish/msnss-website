import { db } from "@/db";
import { catalogues } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { readFile } from "fs/promises";
import path from "path";
import { UPLOAD_ROOT } from "@/lib/storage";

export const dynamic = "force-dynamic";

function safeFileName(name: string) {
  return (name || "MSNSS-Catalogue.pdf").replace(/[^a-zA-Z0-9._-]/g, "_");
}

/**
 * Streams the active catalogue PDF with attachment headers and increments the
 * download counter. Works for both Supabase Storage URLs and local uploads.
 */
export async function GET() {
  const [item] = await db.select().from(catalogues).where(eq(catalogues.active, true)).orderBy(desc(catalogues.id)).limit(1);
  if (!item) return new Response("No active catalogue", { status: 404 });

  const filename = safeFileName(item.fileName);
  let buffer: Buffer;

  try {
    if (/^https?:\/\//i.test(item.fileUrl)) {
      // Remote (Supabase Storage) — fetch then re-serve with attachment headers.
      const res = await fetch(item.fileUrl, { cache: "no-store" });
      if (!res.ok) return new Response("Catalogue file unavailable", { status: 502 });
      buffer = Buffer.from(await res.arrayBuffer());
    } else {
      // Local upload served via /api/media/<...> or stored under uploads/.
      const rel = item.fileUrl.replace(/^\/api\/media\//, "").replace(/^\/+/, "");
      const filePath = path.join(UPLOAD_ROOT, rel.replace(/^uploads\//, ""));
      if (!filePath.startsWith(UPLOAD_ROOT)) return new Response("Not found", { status: 404 });
      buffer = await readFile(filePath);
    }
  } catch {
    return new Response("Catalogue file unavailable", { status: 502 });
  }

  // Best-effort counter increment; never block the download on failure.
  try {
    await db.update(catalogues).set({ downloadCount: sql`${catalogues.downloadCount}+1` }).where(eq(catalogues.id, item.id));
  } catch {
    /* ignore */
  }

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
