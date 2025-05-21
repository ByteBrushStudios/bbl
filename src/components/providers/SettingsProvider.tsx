'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSettings as useSettingsHook } from '@/hooks/useSettings';
import type { SiteSettings } from '@/hooks/useSettings';

// Create the settings context
const SettingsContext = createContext<{
    settings: SiteSettings;
    loading: boolean;
    error: Error | null;
}>({
    settings: {
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
    },
    loading: false,
    error: null
});

// Provider component
export function SettingsProvider({ children }: { children: ReactNode }) {
    const settingsData = useSettingsHook();

    return (
        <SettingsContext.Provider value={settingsData}>
            {children}
        </SettingsContext.Provider>
    );
}

// Hook for using the settings context
export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
