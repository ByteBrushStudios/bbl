import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import authOptions from '@/auth';
import { getSettings } from '@/lib/settings';

// GET /api/settings - Get all settings
export async function GET() {
    try {
        const settings = await getSettings();
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

// Only admins can update settings
export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and has admin rights
    if (!session || !session.user?.isAdmin) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const data = await request.json();
        const updates: Record<string, string> = {};

        // Process each setting and prepare for database updates
        Object.entries(data).forEach(([key, value]) => {
            // Handle special cases like arrays that need to be stringified
            if (key === 'allowedDomains' && Array.isArray(value)) {
                updates[key] = JSON.stringify(value);
            }
            // Handle boolean values
            else if (typeof value === 'boolean') {
                updates[key] = value.toString();
            }
            // Handle regular string values
            else if (typeof value === 'string') {
                updates[key] = value;
            }
        });

        // Update settings in the database
        const changedCount = await prisma.$transaction(
            Object.entries(updates).map(([key, value]) => {
                return prisma.setting.upsert({
                    where: { key },
                    update: { value },
                    create: {
                        key,
                        value,
                        group: key.includes('color') ? 'design' :
                            key.includes('meta') ? 'seo' : 'general'
                    }
                });
            })
        );

        return NextResponse.json({
            message: `Updated ${changedCount.length} settings successfully`,
            success: true
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
}
