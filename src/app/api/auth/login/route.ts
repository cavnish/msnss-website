import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  verifyPassword,
  createSession,
  setSessionCookie,
  isSecureRequest,
} from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const previous = loginAttempts.get(ip);
  if (previous && previous.resetAt > now && previous.count >= 10) {
    return Response.json({ error: "Too many login attempts. Please try again later." }, { status: 429 });
  }
  loginAttempts.set(ip, { count: previous && previous.resetAt > now ? previous.count + 1 : 1, resetAt: now + 15 * 60 * 1000 });
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    const { email, password } = parsed.data;
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email.toLowerCase()));

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    await setSessionCookie(token, isSecureRequest(req));
    loginAttempts.delete(ip);
    return Response.json({ ok: true, redirect: "/admin" });
  } catch {
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
