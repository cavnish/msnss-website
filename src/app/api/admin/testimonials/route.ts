import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/admin-api";
import { testimonialInput } from "@/lib/testimonial-validation";
export const dynamic = "force-dynamic";

export async function GET() {
  const u = await requireAuth();
  if (u) return u;
  return Response.json(await db.select().from(testimonials).orderBy(asc(testimonials.sortOrder), desc(testimonials.id)));
}

export async function POST(req: Request) {
  const u = await requireAuth();
  if (u) return u;
  try {
    const p = testimonialInput.safeParse(await req.json());
    if (!p.success) return Response.json({ error: p.error.issues[0]?.message }, { status: 400 });
    const b = p.data;
    const [row] = await db.insert(testimonials).values({ ...b, role: b.role || null, company: b.company || null, timeAgo: b.timeAgo || null }).returning();
    return Response.json(row, { status: 201 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Unable to create testimonial." }, { status: 500 });
  }
}
