'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteSettings } from '@/lib/settings';

// Default settings
const defaultSettings: SiteSettings = {
    siteName: 'ByteBrush Links',
    company: 'ByteBrush Studios',
    domain: 'https://aka.bytebrush.dev',
    supportEmail: 'support@bytebrush.dev',
    discordServer: 'https://discord.gg/Vv2bdC44Ge',
    githubRepo: '',
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

// Context
const SettingsContext = createContext<{
    settings: SiteSettings;
    loading: boolean;
}>({
    settings: defaultSettings,
    loading: true,
});

export function useSettings() {
    return useContext(SettingsContext);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSettings() {
            try {
                const res = await fetch('/api/settings');
                if (!res.ok) throw new Error('Failed to load settings');

                const data = await res.json();
                setSettings(data);
            } catch (error) {
                console.error('Error loading settings:', error);
                // Fall back to default settings
            } finally {
                setLoading(false);
            }
        }

        loadSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
}
