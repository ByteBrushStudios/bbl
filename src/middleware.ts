import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define isPublicPath - this was missing in the original code
    const isPublicPath =
        pathname === '/' ||
        pathname === '/auth/signin' ||
        pathname === '/auth/signout' ||
        pathname === '/auth/unauthorized' ||
        pathname.startsWith('/bytebrush/') ||
        pathname.match(/^\/[a-zA-Z0-9_-]+$/) !== null; // Matches likely short link patterns

    // Don't run middleware on these paths
    if (
        pathname.includes('.') ||  // Files with extensions (static assets)
        pathname.startsWith('/_next/') ||  // Next.js internal
        pathname.startsWith('/api/') ||  // API routes
        pathname.includes('favicon.ico')
    ) {
        return NextResponse.next();
    }

    const token = await getToken({ req: request });

    // Redirect logic
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // If the user is signed in and trying to access auth pages, redirect to dashboard
    if (token && (pathname.startsWith('/auth'))) {
        return NextResponse.redirect(new URL('/admin', request.url));
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
