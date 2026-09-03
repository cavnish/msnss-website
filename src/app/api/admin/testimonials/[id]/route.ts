import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/admin-api";
import { testimonialInput } from "@/lib/testimonial-validation";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAuth();
  if (u) return u;
  try {
    const p = testimonialInput.safeParse(await req.json());
    if (!p.success) return Response.json({ error: p.error.issues[0]?.message }, { status: 400 });
    const b = p.data;
    const [row] = await db.update(testimonials).set({ ...b, role: b.role || null, company: b.company || null, timeAgo: b.timeAgo || null, updatedAt: new Date() }).where(eq(testimonials.id, Number((await params).id))).returning();
    if (!row) return Response.json({ error: "Testimonial not found" }, { status: 404 });
    return Response.json(row);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Unable to update testimonial." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAuth();
  if (u) return u;
  await db.delete(testimonials).where(eq(testimonials.id, Number((await params).id)));
  return Response.json({ ok: true });
}
