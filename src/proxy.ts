import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // /services → /solutions
  if (path === "/services" || path.startsWith("/services/")) {
    const target =
      path.replace(/^\/services/, "/solutions") || "/solutions";

    return NextResponse.redirect(
      new URL(target + req.nextUrl.search, req.url),
      308
    );
  }

  // Protect admin pages except login
  if (
    path.startsWith("/admin") &&
    path !== "/admin/login" &&
    !req.cookies.get("msnss_admin")
  ) {
    const login = new URL("/admin/login", req.url);
    login.searchParams.set("next", path);

    return NextResponse.redirect(login);
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", path);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/services",
    "/services/:path*",
  ],
};