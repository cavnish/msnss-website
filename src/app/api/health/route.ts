import { db } from "@/db";
import { sql } from "drizzle-orm";
import { supabaseEnabled } from "@/lib/storage";

export const dynamic = "force-dynamic";

/**
 * Readiness endpoint. Reports boolean readiness only — never secret values.
 * Returns 200 when the database is reachable (the hard dependency); other
 * subsystems are reported as configured/not-configured for operators.
 */
export async function GET() {
  let database = false;
  try {
    await db.execute(sql`select 1`);
    database = true;
  } catch {
    database = false;
  }

  const email = Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM && process.env.OWNER_EMAIL);
  const authSecret = Boolean(process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 16);
  const siteUrl = Boolean(process.env.NEXT_PUBLIC_SITE_URL);

  const body = {
    ok: database,
    status: database ? "ok" : "degraded",
    checks: {
      database,
      storage: supabaseEnabled ? "supabase" : "local-fallback",
      email: email ? "configured" : "not-configured",
      authSecret: authSecret ? "configured" : "missing",
      siteUrl: siteUrl ? "configured" : "missing",
    },
    timestamp: new Date().toISOString(),
  };

  return Response.json(body, { status: database ? 200 : 503 });
}
