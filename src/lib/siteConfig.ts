// Client-side compatible settings accessor
import { SiteSettings } from './settings';

// Legacy compatibility API
export const siteConfig = {
    _cachedSettings: null as SiteSettings | null,

    get siteName() { return this._cachedSettings?.siteName || 'ByteBrush Links'; },
    get company() { return this._cachedSettings?.company || 'ByteBrush Studios'; },
    get domain() { return this._cachedSettings?.domain || 'https://aka.bytebrush.dev'; },
    get supportEmail() { return this._cachedSettings?.supportEmail || 'support@bytebrush.dev'; },
    get allowedDomains() { return this._cachedSettings?.allowedDomains || ['bytebrush.dev']; },
    get enableBasePages() { return this._cachedSettings?.enableBasePages ?? true; },
};

export async function fetchAndCacheSettings(): Promise<void> {
    try {
        // We'll use a fetch API call to get the settings
        const response = await fetch('/api/settings');
        if (!response.ok) throw new Error('Failed to fetch settings');
        siteConfig._cachedSettings = await response.json();
    } catch (error) {
        console.error('Error initializing settings:', error);
    }
}
