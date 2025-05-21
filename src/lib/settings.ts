import { PrismaClient, Setting } from '@prisma/client';
import { cache } from 'react';

const prisma = new PrismaClient();

// Type definitions for settings
export type SiteSettings = {
    siteName: string;
    company: string;
    domain: string;
    supportEmail: string;
    discordServer: string;
    githubRepo: string;
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
    const settings = await prisma.setting.findMany();

    // Create a map of settings
    const settingsMap = settings.reduce((map, setting) => {
        map[setting.key] = setting.value;
        return map;
    }, {} as Record<string, string>);

    return {
        siteName: settingsMap.siteName || 'ByteLinks',
        company: settingsMap.company || 'ByteBrush Studios',
        domain: settingsMap.domain || 'https://aka.bytebrush.dev',
        supportEmail: settingsMap.supportEmail || 'support@bytebrush.dev',
        discordServer: settingsMap.discordServer || 'https://discord.gg/Vv2bdC44Ge',
        allowedDomains: JSON.parse(settingsMap.allowedDomains || '["bytebrush.dev"]'),
        enableBasePages: settingsMap.enableBasePages === 'true',
        metaTitle: settingsMap.metaTitle || 'ByteLinks - Branded Link Management',
        metaDescription: settingsMap.metaDescription || 'Create and manage branded short links with custom metadata for social media previews.',
        metaImageUrl: settingsMap.metaImageUrl || '/bytebrush/logo.png',
        favicon: settingsMap.favicon || '/favicon.ico',
        logoUrl: settingsMap.logoUrl || '/bytebrush/logo.png',
        primaryColor: settingsMap.primaryColor || '#22c55e',
        secondaryColor: settingsMap.secondaryColor || '#3b82f6',
        redirectDelay: parseInt(settingsMap.redirectDelay || '0', 10),
        trackingPixelEnabled: settingsMap.trackingPixelEnabled === 'true',
        defaultLinkActive: settingsMap.defaultLinkActive === 'true',
    };
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

// Create a compatibility layer for the transition period
// This will be used in places where the old config import is used
export const siteConfig = {
    async getConfig(): Promise<SiteSettings> {
        return await getSettings();
    },

    // This allows code that expects synchronous access to still work during migration
    // Will be fetched from DB on server startup and cached
    _cachedSettings: null as SiteSettings | null,

    get siteName() { return this._cachedSettings?.siteName || 'ByteBrush Links'; },
    get company() { return this._cachedSettings?.company || 'ByteBrush Studios'; },
    get domain() { return this._cachedSettings?.domain || 'https://aka.bytebrush.dev'; },
    get supportEmail() { return this._cachedSettings?.supportEmail || 'support@bytebrush.dev'; },
    get discordServer() { return this._cachedSettings?.discordServer || 'https://discord.gg/Vv2bdC44Ge'; },
    get githubRepo() { return this._cachedSettings?.githubRepo || ''; },
    get allowedDomains() { return this._cachedSettings?.allowedDomains || ['bytebrush.dev']; },
    get enableBasePages() { return this._cachedSettings?.enableBasePages ?? true; },
};

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
