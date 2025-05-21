import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getSettings, updateSettings } from '@/lib/settings';

const prisma = new PrismaClient();

// GET /api/settings - Get all settings
export async function GET() {
    try {
        const settings = await getSettings();
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

// POST /api/settings - Update settings
export async function POST(request: Request) {
    try {
        // Check authentication and authorization
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Ensure user is super admin
        if (!(session.user as any).isSuperAdmin) {
            return NextResponse.json({ error: 'Only super admins can update settings' }, { status: 403 });
        }

        // Get request body
        const updates = await request.json();

        // Update settings
        const count = await updateSettings(updates);

        // Revalidate all pages to reflect the new settings
        revalidatePath('/');

        return NextResponse.json({
            success: true,
            message: `Updated ${count} settings successfully`
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
