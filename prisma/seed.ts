import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seeding process...');

    // Application default settings - no dependency on config file
    const settings = [
        // General settings
        { key: 'siteName', value: process.env.SITE_NAME || 'ByteBrush Links', group: 'general' },
        { key: 'company', value: process.env.COMPANY_NAME || 'ByteBrush Studios', group: 'general' },
        { key: 'domain', value: process.env.SITE_DOMAIN || 'https://aka.bytebrush.dev', group: 'general' },
        { key: 'supportEmail', value: process.env.SUPPORT_EMAIL || 'support@bytebrush.dev', group: 'general' },
        { key: 'enableBasePages', value: process.env.ENABLE_BASE_PAGES || 'true', group: 'general' },

        // Social links
        { key: 'discordServer', value: process.env.DISCORD_SERVER || 'https://discord.gg/Vv2bdC44Ge', group: 'social' },
        { key: 'githubRepo', value: process.env.GITHUB_REPO || 'https://github.com/bytebrush/bblinks', group: 'social' },

        // Authentication settings
        { key: 'allowedDomains', value: process.env.ALLOWED_DOMAINS || JSON.stringify(['bytebrush.dev']), group: 'auth' },

        // SEO settings
        { key: 'metaTitle', value: process.env.META_TITLE || 'ByteBrush Links - Branded Link Management', group: 'seo' },
        { key: 'metaDescription', value: process.env.META_DESCRIPTION || 'Create and manage branded short links with custom metadata for social media previews.', group: 'seo' },
        { key: 'metaImageUrl', value: process.env.META_IMAGE_URL || '/og-image.png', group: 'seo' },

        // Design settings
        { key: 'favicon', value: process.env.FAVICON || '/favicon.ico', group: 'design' },
        { key: 'logoUrl', value: process.env.LOGO_URL || '/bytebrush/logo.png', group: 'design' },
        { key: 'primaryColor', value: process.env.PRIMARY_COLOR || '#22c55e', group: 'design' }, // Green
        { key: 'secondaryColor', value: process.env.SECONDARY_COLOR || '#3b82f6', group: 'design' }, // Blue

        // Link settings
        { key: 'redirectDelay', value: process.env.REDIRECT_DELAY || '0', group: 'links' },
        { key: 'trackingPixelEnabled', value: process.env.TRACKING_PIXEL_ENABLED || 'true', group: 'links' },
        { key: 'defaultLinkActive', value: process.env.DEFAULT_LINK_ACTIVE || 'true', group: 'links' },
    ];

    console.log('Creating default settings...');

    for (const setting of settings) {
        await prisma.setting.upsert({
            where: { key: setting.key },
            update: { value: setting.value, group: setting.group },
            create: setting,
        });
    }

    // Check if admin user exists, if not create one
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
        console.log('Creating initial admin user...');

        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail },
        });

        if (!existingAdmin) {
            await prisma.user.create({
                data: {
                    name: 'Admin',
                    email: adminEmail,
                    password: await hash(adminPassword, 10),
                    role: 'SUPERADMIN',
                },
            });
            console.log(`Admin user created with email: ${adminEmail}`);
        } else {
            console.log('Admin user already exists, skipping creation');
        }
    } else {
        console.log('INITIAL_ADMIN_EMAIL or INITIAL_ADMIN_PASSWORD not set, skipping admin creation');
    }

    console.log('Seeding complete');
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
