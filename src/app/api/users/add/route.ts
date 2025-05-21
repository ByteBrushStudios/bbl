import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hash } from "bcrypt";

// Define validation schema for creating a user
const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["USER", "ADMIN", "SUPERADMIN"]),
    discordId: z.string().optional(),
    image: z.string().url().optional(),
});

export async function POST(request: Request) {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || (!session.user.isAdmin && !session.user.isSuperAdmin)) {
        return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // Only SUPERADMIN can create SUPERADMIN users
    if (!session.user.isSuperAdmin && session.user.role !== "SUPERADMIN") {
        return NextResponse.json({ error: "Only super admins can create admin users" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const validatedData = createUserSchema.parse(body);

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email already exists" }, { status: 409 });
        }

        // Hash the password
        const hashedPassword = await hash(validatedData.password, 12);

        // Create the user
        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
                role: validatedData.role,
                discordId: validatedData.discordId,
                image: validatedData.image,
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                discordId: true,
                role: true,
                createdAt: true,
                // Don't return password
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
        }

        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}
