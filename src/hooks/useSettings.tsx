'use client';

import { useState, useEffect } from 'react';

// Define the SiteSettings type for client-side use
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

// Default settings as a fallback
const defaultSettings: SiteSettings = {
    siteName: 'ByteBrush Links',
    company: 'ByteBrush Studios',
    domain: 'https://aka.bytebrush.dev',
    supportEmail: 'support@bytebrush.dev',
    allowedDomains: ['bytebrush.dev'],
    enableBasePages: true,
    metaTitle: 'ByteBrush Links - Branded Link Management',
    metaDescription: 'Create and manage branded short links with custom metadata for social media previews.',
    metaImageUrl: '/og-image.png',
    favicon: '/favicon.ico',
    logoUrl: '/bytebrush/logo.png',
    primaryColor: '#22c55e',
    secondaryColor: '#3b82f6',
    redirectDelay: 0,
    trackingPixelEnabled: true,
    defaultLinkActive: true,
};

export function useSettings() {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                // Use API route instead of direct Prisma call
                const response = await fetch('/api/settings');

                if (!response.ok) {
                    throw new Error('Failed to fetch settings');
                }

                const data = await response.json();
                setSettings(data);
            } catch (err) {
                console.error('Failed to fetch settings:', err);
                setError(err instanceof Error ? err : new Error('Unknown error fetching settings'));
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return { settings, loading, error };
}
