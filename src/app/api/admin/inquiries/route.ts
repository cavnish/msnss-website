import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { desc } from "drizzle-orm";
import { requireAuth } from "@/lib/admin-api";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  const rows = await db.select().from(inquiries).orderBy(desc(inquiries.id));
  return Response.json(rows);
}
