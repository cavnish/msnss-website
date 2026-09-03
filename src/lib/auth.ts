import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "msnss_admin";

let cachedSecret: Uint8Array | null = null;

/**
 * Resolve the signing secret lazily (at first auth use), not at import time,
 * so the production build/data-collection does not require AUTH_SECRET.
 * In production a missing/short secret throws when auth is actually used.
 */
function getSecret(): Uint8Array {
  if (cachedSecret) return cachedSecret;
  const configured = process.env.AUTH_SECRET;
  if (configured && configured.length >= 16) {
    cachedSecret = new TextEncoder().encode(configured);
    return cachedSecret;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "AUTH_SECRET is required in production and must be at least 16 characters. Set it in your environment."
    );
  }
  console.warn(
    "[auth] AUTH_SECRET is not set — using an insecure development fallback. Set AUTH_SECRET before deploying."
  );
  cachedSecret = new TextEncoder().encode("msnss-dev-secret-change-in-production-please-01234");
  return cachedSecret;
}

export type SessionPayload = {
  userId: number;
  email: string;
  name: string;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function setSessionCookie(token: string, secure = true) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    // Only mark Secure on real HTTPS requests. On plain-HTTP origins
    // (e.g. local `npm run start` at http://localhost) a Secure cookie is
    // silently dropped by the browser, which breaks the login redirect.
    secure,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

/** Determine if the current request is served over HTTPS. */
export function isSecureRequest(req: Request): boolean {
  const proto = req.headers.get("x-forwarded-proto");
  if (proto) return proto.split(",")[0].trim() === "https";
  try {
    return new URL(req.url).protocol === "https:";
  } catch {
    return false;
  }
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: payload.userId as number,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}
