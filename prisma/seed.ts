import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seeding process...');

    const settings = [
        // General settings
        { key: 'siteName', value: 'ByteLinks', group: 'general' },
        { key: 'company', value: 'ByteBrush Studios', group: 'general' },
        { key: 'domain', value: 'https://aka.bytebrush.dev', group: 'general' },
        { key: 'supportEmail', value: 'support@bytebrush.dev', group: 'general' },
        { key: 'enableBasePages', value: 'true', group: 'general' },

        // Authentication settings
        { key: 'allowedDomains', value: JSON.stringify(['bytebrush.dev']), group: 'auth' },

        // SEO settings
        { key: 'metaTitle', value: 'ByteLinks - Branded Link Management', group: 'seo' },
        { key: 'metaDescription', value: 'Create and manage branded short links with custom metadata for social media previews.', group: 'seo' },
        { key: 'metaImageUrl', value: '/bytebrush/logo.png', group: 'seo' },

        // Design settings
        { key: 'favicon', value: '/favicon.ico', group: 'design' },
        { key: 'logoUrl', value: '/bytebrush/logo.png', group: 'design' },
        { key: 'primaryColor', value: '#22c55e', group: 'design' },
        { key: 'secondaryColor', value: '#3b82f6', group: 'design' },

        // Link settings
        { key: 'redirectDelay', value: '0', group: 'links' },
        { key: 'trackingPixelEnabled', value: 'true', group: 'links' },
        { key: 'defaultLinkActive', value: 'true', group: 'links' },
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
        console.log('INITIAL_ADMIN_EMAIL or INITIAL_ADMIN_PASSWORD');
        return process.exit(1);
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
