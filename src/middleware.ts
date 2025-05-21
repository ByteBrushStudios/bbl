import { getToken } from "next-auth/jwt";
import { siteConfig } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Don't run middleware on these paths
    if (
        pathname.includes('.') ||  // Files with extensions (static assets)
        pathname.startsWith('/_next/') ||  // Next.js internal
        pathname.startsWith('/api/') ||  // API routes
        pathname.includes('favicon.ico')
    ) {
        return NextResponse.next();
    } const session = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    const isLoggedIn = !!session;

    const isAdmin = (session && session.isAdmin === true) || false;
    const isSuperAdmin = (session && session.isSuperAdmin === true) || false;

    // Check if ByteBrush pages are disabled
    if (!siteConfig.enableBasePages) {
        // Allow access to auth routes even when pages are disabled
        if (!pathname.startsWith("/auth/") && !pathname.startsWith("/admin/")) {
            if (isLoggedIn) {    // If logged in and has admin or super admin access, redirect to admin dashboard
                if (isAdmin || isSuperAdmin) {
                    return NextResponse.redirect(new URL("/admin", req.url));
                }
                // If logged in but not admin, redirect to unauthorized page
                return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
            } else {
                return NextResponse.redirect(new URL("/auth/signin", req.url));
            }
        }
    }

    if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/auth/signin", req.url));
        }
        if (!isAdmin && !isSuperAdmin) {
            return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
        }
    }

    if (pathname.startsWith("/auth/signin") && isLoggedIn) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all routes except Next.js internals, public assets, and API routes
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
        "/auth/signin",
        "/auth/signout",
        "/auth/unauthorized",
    ],
};
