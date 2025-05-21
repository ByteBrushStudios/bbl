import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hash } from "bcrypt";

// Define validation schema for updating a user
const updateUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Invalid email format").optional(),
    password: z.string().min(8, "Password must be at least 8 characters").optional(),
    role: z.enum(["USER", "ADMIN", "SUPERADMIN"]).optional(),
    image: z.string().url().optional(),
    discordId: z.string().optional().nullable(),
});

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || (!session.user.isAdmin && !session.user.isSuperAdmin)) {
        return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: params.id },
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
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || (!session.user.isAdmin && !session.user.isSuperAdmin)) {
        return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    try {
        // Get the target user
        const targetUser = await prisma.user.findUnique({
            where: { id: params.id },
        });

        if (!targetUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Only SUPERADMIN can modify other SUPERADMIN or ADMIN users
        if (
            (targetUser.role === "SUPERADMIN" || targetUser.role === "ADMIN") &&
            !session.user.isSuperAdmin
        ) {
            return NextResponse.json(
                { error: "Only super admins can modify admin/superadmin users" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const validatedData = updateUserSchema.parse(body);

        // Prepare update data
        const updateData: any = {};

        if (validatedData.name) updateData.name = validatedData.name;
        if (validatedData.email) updateData.email = validatedData.email;
        if (validatedData.role) updateData.role = validatedData.role;
        if (validatedData.image) updateData.image = validatedData.image;
        if (validatedData.discordId !== undefined) updateData.discordId = validatedData.discordId;

        // Hash the password if provided
        if (validatedData.password) {
            updateData.password = await hash(validatedData.password, 12);
        }

        // Update the user
        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: updateData,
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
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
        }

        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || (!session.user.isAdmin && !session.user.isSuperAdmin)) {
        return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    try {
        // Get the target user
        const targetUser = await prisma.user.findUnique({
            where: { id: params.id },
        });

        if (!targetUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Only SUPERADMIN can delete other SUPERADMIN or ADMIN users
        if (
            (targetUser.role === "SUPERADMIN" || targetUser.role === "ADMIN") &&
            !session.user.isSuperAdmin
        ) {
            return NextResponse.json(
                { error: "Only super admins can delete admin/superadmin users" },
                { status: 403 }
            );
        }

        // Check if it's the last SUPERADMIN
        if (targetUser.role === "SUPERADMIN") {
            const superAdminCount = await prisma.user.count({
                where: { role: "SUPERADMIN" },
            });

            if (superAdminCount <= 1) {
                return NextResponse.json(
                    { error: "Cannot delete the last super admin user" },
                    { status: 403 }
                );
            }
        }

        // Delete the user
        await prisma.user.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
