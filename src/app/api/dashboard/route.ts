import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth";

export async function GET() {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (!session.user?.isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        // Get basic stats for the dashboard
        const totalLinks = await prisma.link.count();
        const totalVisits = await prisma.link.aggregate({
            _sum: {
                visits: true,
            },
        });

        // Get recent links
        const recentLinks = await prisma.link.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        });

        // Get top links by visits
        const topLinks = await prisma.link.findMany({
            orderBy: {
                visits: "desc",
            },
            take: 5,
        });

        return NextResponse.json({
            totalLinks,
            totalVisits: totalVisits._sum.visits || 0,
            recentLinks,
            topLinks
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
}
