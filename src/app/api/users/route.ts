import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Define validation schema for user listing
const userQuerySchema = z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
    role: z.enum(["USER", "ADMIN", "SUPERADMIN"]).optional(),
});

export async function GET(request: Request) {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || (!session.user.isAdmin && !session.user.isSuperAdmin)) {
        return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    try {
        // Get query parameters
        const url = new URL(request.url);
        const queryParams = {
            page: url.searchParams.get("page") || "1",
            limit: url.searchParams.get("limit") || "10",
            search: url.searchParams.get("search") || "",
            role: url.searchParams.get("role") || undefined,
        };

        // Validate query parameters
        const { page, limit, search, role } = userQuerySchema.parse(queryParams);

        // Build filter criteria
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (role) {
            where.role = role;
        }

        // Get users with pagination
        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                discordId: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                // Don't return password
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Get total count for pagination
        const total = await prisma.user.count({ where });

        return NextResponse.json({
            users,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
