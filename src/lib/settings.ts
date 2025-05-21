// Server-side settings implementation
import { PrismaClient, Setting } from '@prisma/client';
import { cache } from 'react';

const prisma = new PrismaClient();

// Define the default settings
export const defaultSettings = {
    siteName: 'ByteBrush Links',
    company: 'ByteBrush Studios',
    domain: 'https://aka.bytebrush.dev',
    supportEmail: 'support@bytebrush.dev',
    allowedDomains: JSON.stringify(['bytebrush.dev']),
    enableBasePages: 'true',
    metaTitle: 'ByteBrush Links - Branded Link Management',
    metaDescription: 'Create and manage branded short links with custom metadata for social media previews.',
    metaImageUrl: '/og-image.png',
    favicon: '/favicon.ico',
    logoUrl: '/bytebrush/logo.png',
    primaryColor: '#22c55e',
    secondaryColor: '#3b82f6',
    redirectDelay: '0',
    trackingPixelEnabled: 'true',
    defaultLinkActive: 'true',
};

// Type definitions for settings
export type SiteSettings = {
    siteName: string;
    company: string;
    domain: string;
    supportEmail: string;
    allowedDomains: string[];
    enableBasePages: boolean;
    metaTitle: string;
    metaDescription: string;
    metaImageUrl: string;
    favicon: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    redirectDelay: number;
    trackingPixelEnabled: boolean;
    defaultLinkActive: boolean;
};

// Cache the settings for performance
export const getSettings = cache(async (): Promise<SiteSettings> => {
    try {
        const settings = await prisma.setting.findMany();

        // Create a map of settings
        const settingsMap = settings.reduce((map, setting) => {
            map[setting.key] = setting.value;
            return map;
        }, {} as Record<string, string>);

        return {
            siteName: settingsMap.siteName || defaultSettings.siteName,
            company: settingsMap.company || defaultSettings.company,
            domain: settingsMap.domain || defaultSettings.domain,
            supportEmail: settingsMap.supportEmail || defaultSettings.supportEmail,
            allowedDomains: JSON.parse(settingsMap.allowedDomains || defaultSettings.allowedDomains),
            enableBasePages: settingsMap.enableBasePages === 'true',
            metaTitle: settingsMap.metaTitle || defaultSettings.metaTitle,
            metaDescription: settingsMap.metaDescription || defaultSettings.metaDescription,
            metaImageUrl: settingsMap.metaImageUrl || defaultSettings.metaImageUrl,
            favicon: settingsMap.favicon || defaultSettings.favicon,
            logoUrl: settingsMap.logoUrl || defaultSettings.logoUrl,
            primaryColor: settingsMap.primaryColor || defaultSettings.primaryColor,
            secondaryColor: settingsMap.secondaryColor || defaultSettings.secondaryColor,
            redirectDelay: parseInt(settingsMap.redirectDelay || defaultSettings.redirectDelay),
            trackingPixelEnabled: settingsMap.trackingPixelEnabled === 'true',
            defaultLinkActive: settingsMap.defaultLinkActive === 'true',
        };
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        // Return default settings if there's an error
        return {
            siteName: defaultSettings.siteName,
            company: defaultSettings.company,
            domain: defaultSettings.domain,
            supportEmail: defaultSettings.supportEmail,
            discordServer: defaultSettings.discordServer,
            githubRepo: defaultSettings.githubRepo,
            allowedDomains: JSON.parse(defaultSettings.allowedDomains),
            enableBasePages: defaultSettings.enableBasePages === 'true',
            metaTitle: defaultSettings.metaTitle,
            metaDescription: defaultSettings.metaDescription,
            metaImageUrl: defaultSettings.metaImageUrl,
            favicon: defaultSettings.favicon,
            logoUrl: defaultSettings.logoUrl,
            primaryColor: defaultSettings.primaryColor,
            secondaryColor: defaultSettings.secondaryColor,
            redirectDelay: parseInt(defaultSettings.redirectDelay),
            trackingPixelEnabled: defaultSettings.trackingPixelEnabled === 'true',
            defaultLinkActive: defaultSettings.defaultLinkActive === 'true',
        };
    }
});

// Update a single setting
export async function updateSetting(key: string, value: string): Promise<Setting> {
    return prisma.setting.update({
        where: { key },
        data: { value },
    });
}

// Update multiple settings
export async function updateSettings(updates: Record<string, string>): Promise<number> {
    let count = 0;

    // Update each setting in a transaction
    await prisma.$transaction(
        Object.entries(updates).map(([key, value]) => {
            count++;
            return prisma.setting.update({
                where: { key },
                data: { value },
            });
        })
    );

    return count;
}

// Initialization function to be called at app startup
export async function initializeSettings(): Promise<void> {
    try {
        siteConfig._cachedSettings = await getSettings();
        console.log('Settings initialized successfully');
    } catch (error) {
        console.error('Error initializing settings:', error);
        // Continue with default values
    }
}
