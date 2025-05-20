import { auth } from "@/auth";
import { siteConfig } from "@/lib/config";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.isAdmin;

  // Admin-only routes, must be logged in and admin
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/signin", nextUrl));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // Auth routes - redirect to homepage if already logged in
  if (nextUrl.pathname.startsWith("/auth/signin") && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

// See https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/signin",
    "/api/links/:path*"
  ],
};
