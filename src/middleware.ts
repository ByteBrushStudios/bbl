import { getToken } from "next-auth/jwt";
import { siteConfig } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Get user session
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  const isLoggedIn = !!session;
  const isAdmin = session?.isAdmin || false;

  // If homepage is disabled and we're on the home page, redirect appropriately
  if (pathname === "/" && !siteConfig.enableHomepage) {
    if (isLoggedIn) {
      // Redirect to admin dashboard if user is admin
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    } else {
      // Redirect to sign-in page if not logged in
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }
  }

  // Admin-only routes, must be logged in and admin
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Auth routes - redirect to homepage if already logged in
  if (pathname.startsWith("/auth/signin") && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/auth/signin",
    "/api/links/:path*"
  ],
};
