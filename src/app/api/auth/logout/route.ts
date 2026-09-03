import { clearSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  await clearSessionCookie();
  return Response.json({ ok: true });
}
