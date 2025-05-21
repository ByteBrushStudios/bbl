import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hash } from "bcrypt";

// Define validation schema for password reset
const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(
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

        // Only SUPERADMIN can reset passwords for other SUPERADMIN or ADMIN users
        if (
            (targetUser.role === "SUPERADMIN" || targetUser.role === "ADMIN") &&
            !session.user.isSuperAdmin
        ) {
            return NextResponse.json(
                { error: "Only super admins can reset passwords for admin/superadmin users" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const validatedData = resetPasswordSchema.parse(body);

        // Hash the new password
        const hashedPassword = await hash(validatedData.password, 12);

        // Update the user's password
        await prisma.user.update({
            where: { id: params.id },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error resetting password:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
        }

        return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
    }
}
