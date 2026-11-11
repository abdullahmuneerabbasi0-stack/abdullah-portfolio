import { NextResponse, type NextRequest } from "next/server";

/**
 * Fast, optimistic check only: sends visitors without a session cookie to the
 * login page. Real authorisation happens on the server in every admin page,
 * action and API route (see lib/server/auth.ts), so this is not the security
 * boundary and the admin URL is not a secret.
 */
const COOKIE = process.env.NODE_ENV === "production" ? "__Host-admin_session" : "admin_session";
const PUBLIC = ["/admin/login", "/admin/setup"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = req.cookies.has(COOKIE);
  if (pathname.startsWith("/api/admin")) {
    if (!hasSession) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  } else if (!hasSession && !PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  const res = NextResponse.next();
  // Admin pages must never be cached or indexed.
  res.headers.set("Cache-Control", "private, no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
