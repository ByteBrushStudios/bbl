'use client';

import { useState, useEffect } from "react";
import {
    Settings, Link2, Mail, Globe, Save, Server,
    Image as ImageIcon, Search, Type, PaintBucket,
    Clock, Zap, Palette, Bell, FileImage, Loader,
    ExternalLink, Check
} from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { Tab } from "@headlessui/react";
import { SiteSettings } from "@/lib/settings";
import Image from "next/image";

// Initial empty state for settings
const initialSettings: Partial<SiteSettings> = {};

// Schema for validating settings
const settingsSchema = z.object({
    siteName: z.string().min(1, "Site name is required"),
    company: z.string().min(1, "Company name is required"),
    domain: z.string().url("Please enter a valid URL"),
    supportEmail: z.string().email("Please enter a valid email"),
    discordServer: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
    githubRepo: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
    allowedDomains: z.array(z.string()),
    metaTitle: z.string(),
    metaDescription: z.string(),
    metaImageUrl: z.string(),
    logoUrl: z.string(),
    favicon: z.string(),
    primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please enter a valid hex color"),
    secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please enter a valid hex color"),
    redirectDelay: z.number().min(0).max(10),
    trackingPixelEnabled: z.boolean(),
    defaultLinkActive: z.boolean(),
    enableBasePages: z.boolean(),
});

export default function SettingsPage() {
    const { data: session } = useSession();
    const [settings, setSettings] = useState<Partial<SiteSettings>>(initialSettings);
    const [formData, setFormData] = useState<Partial<SiteSettings>>(initialSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");
    const [selectedTab, setSelectedTab] = useState(0);
    const [tempAllowedDomain, setTempAllowedDomain] = useState("");

    const isSuperAdmin = session?.user?.isSuperAdmin || false;

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch('/api/settings');
                if (!response.ok) throw new Error('Failed to fetch settings');

                const data = await response.json();
                setSettings(data);
                setFormData(data);
            } catch (err) {
                console.error('Error fetching settings:', err);
                setError('Failed to load settings. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddAllowedDomain = () => {
        if (!tempAllowedDomain) return;

        // Basic domain validation
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
        if (!domainRegex.test(tempAllowedDomain)) {
            setError('Please enter a valid domain');
            return;
        }

        setFormData(prev => ({
            ...prev,
            allowedDomains: [...(prev.allowedDomains || []), tempAllowedDomain]
        }));

        setTempAllowedDomain("");
    };

    const handleRemoveAllowedDomain = (domain: string) => {
        setFormData(prev => ({
            ...prev,
            allowedDomains: (prev.allowedDomains || []).filter(d => d !== domain)
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        try {
            // Validate the form data
            settingsSchema.parse(formData);

            // Convert the form data to a format suitable for the API
            const dataToSend: Record<string, string> = {};
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'allowedDomains') {
                    dataToSend[key] = JSON.stringify(value);
                } else if (typeof value === 'boolean') {
                    dataToSend[key] = String(value);
                } else if (typeof value === 'number') {
                    dataToSend[key] = String(value);
                } else if (value !== undefined) {
                    dataToSend[key] = value as string;
                }
            });

            // Send the data to the API
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update settings');
            }

            // Update the settings state with the new values
            setSettings({ ...formData });

            // Show success message
            setSuccessMessage('Settings saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0].message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setSaving(false);
        }
    };

    // Tab categories
    const tabs = [
        { name: 'General', icon: <Settings size={16} /> },
        { name: 'SEO & Design', icon: <Search size={16} /> },
        { name: 'Links', icon: <Link2 size={16} /> },
        { name: 'Authentication', icon: <Lock size={16} /> },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 max-w-6xl mx-auto">
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl sm:text-3xl font-bold">
                    <span className="gradient-text">System Settings</span>
                </h1>
                <p className="text-slate-400 mt-1">
                    Configure your site settings and customize the application
                </p>
            </motion.div>

            {successMessage && (
                <motion.div
                    className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-md flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <Check size={20} className="mr-2" />
                    <span>{successMessage}</span>
                </motion.div>
            )}

            {error && (
                <motion.div
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <AlertCircle size={20} className="mr-2" />
                    <span>{error}</span>
                </motion.div>
            )}

            <motion.div
                className="card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                    <Tab.List className="flex p-1 mb-6 space-x-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        {tabs.map((tab, idx) => (
                            <Tab
                                key={idx}
                                className={({ selected }) =>
                                    `flex items-center gap-1.5 w-full py-2.5 text-sm font-medium leading-5 text-slate-400 rounded-md transition-all
                  ${selected
                                        ? 'bg-slate-900 text-green-400 shadow'
                                        : 'hover:bg-slate-800/50 hover:text-slate-300'}`
                                }
                            >
                                {tab.icon}
                                {tab.name}
                            </Tab>
                        ))}
                    </Tab.List>

                    <Tab.Panels>
                        <Tab.Panel>
                            {/* General Settings */}
                            <form onSubmit={handleSave} className="space-y-6">
                                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-slate-800">
                                    General Information
                                </h3>

                                <div>
                                    <label htmlFor="siteName" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                        <Type size={14} />
                                        Site Name
                                    </label>
                                    <input
                                        type="text"
                                        id="siteName"
                                        name="siteName"
                                        value={formData.siteName || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                        disabled={!isSuperAdmin}
                                    />
                                    <p className="mt-1 text-xs text-slate-400">
                                        The name of your link management service displayed throughout the site
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="company" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                        <Building size={14} />
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        id="company"
                                        name="company"
                                        value={formData.company || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                        disabled={!isSuperAdmin}
                                    />
                                    <p className="mt-1 text-xs text-slate-400">
                                        Your organization or company name
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="domain" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                        <Globe size={14} />
                                        Base URL
                                    </label>
                                    <input
                                        type="url"
                                        id="domain"
                                        name="domain"
                                        value={formData.domain || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                        disabled={!isSuperAdmin}
                                    />
                                    <p className="mt-1 text-xs text-slate-400">
                                        The domain used for your short links (must include https://)
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="supportEmail" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                        <Mail size={14} />
                                        Support Email
                                    </label>
                                    <input
                                        type="email"
                                        id="supportEmail"
                                        name="supportEmail"
                                        value={formData.supportEmail || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                        disabled={!isSuperAdmin}
                                    />
                                    <p className="mt-1 text-xs text-slate-400">
                                        Email address displayed for support inquiries
                                    </p>
                                </div>

                                <h3 className="text-lg font-semibold text-white mb-4 mt-8 pb-2 border-b border-slate-800">
                                    External Links
                                </h3>

                                <div>
                                    <label htmlFor="discordServer" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" />
                                            <path d="M7.5 7.5c3.5-1 5.5-1 9 0" />
                                            <path d="M7 16.5c3.5 1 6.5 1 10 0" />
                                            <path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2.833-1.667 3.5-3 .667-1.667.5-5.833-1.5-11.5-1.457-1.015-3-1.34-4.5-1.5l-1 2.5" />
                                            <path d="M8.5 17c0 1-1.356 3-1.832 3-1.429 0-2.698-1.667-3.333-3-.635-1.667-.48-5.833 1.428-11.5C6.151 4.485 7.545 4.16 9 4l1 2.5" />
                                        </svg>
                                        Discord Server URL
                                    </label>
                                    <input
                                        type="url"
                                        id="discordServer"
                                        name="discordServer"
                                        value={formData.discordServer || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                        disabled={!isSuperAdmin}
                                    />
                                    <p className="mt-1 text-xs text-slate-400">
                                        Link to your Discord server (optional)
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="githubRepo" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                        <Github size={14} />
                                        GitHub Repository URL
                                    </label>
                                    <input
                                        type="url"
                                        id="githubRepo"
                                        name="githubRepo"
                                        value={formData.githubRepo || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                        disabled={!isSuperAdmin}
                                    />
                                    <p className="mt-1 text-xs text-slate-400">
                                        Link to your GitHub repository (optional)
                                    </p>
                                </div>

                                <div className="flex items-center pt-4">
                                    <input
                                        type="checkbox"
                                        id="enableBasePages"
                                        name="enableBasePages"
                                        checked={formData.enableBasePages || false}
                                        onChange={(e) => setFormData(prev => ({ ...prev, enableBasePages: e.target.checked }))
                                        }
                                        className="h-4 w-4 rounded border-slate-700 text-green-600 focus:ring-green-500 bg-slate-800"
                                        disabled={!isSuperAdmin}
                                    />
                                    <label htmlFor="enableBasePages" className="ml-2 block text-sm text-slate-300">
                                        Enable base pages (home, FAQ, etc.)
                                    </label>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    When enabled, the system will use the built-in landing pages. Disable if you want to use your own custom pages.
                                </p>

                                <div className="pt-4 border-t border-slate-800">
                                    <motion.button
                                        type="submit"
                                        disabled={saving || !isSuperAdmin}
                                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-300 disabled:opacity-50 disabled:hover:bg-green-500 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                                        whileHover={!saving && isSuperAdmin ? { scale: 1.05 } : {}}
                                        whileTap={!saving && isSuperAdmin ? { scale: 0.95 } : {}}
                                    >
                                        {saving ? (
                                            <>
                                                <Loader size={16} className="animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} />
                                                Save Settings
                                            </>
                                        )}
                                    </motion.button>

                                    {!isSuperAdmin && (
                                        <p className="mt-3 text-sm text-amber-400">
                                            <Shield size={14} className="inline mr-1" />
                                            You need super admin privileges to modify these settings
                                        </p>
                                    )}
                                </div>
                            </form>
                        </Tab.Panel>

                        <Tab.Panel>
                            {/* SEO & Design Settings */}
                            <form onSubmit={handleSave} className="space-y-6">
                                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-slate-800">
                                    SEO Settings
                                </h3>

                                <div>
                                    <label htmlFor="metaTitle" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                        <Type size={14} />
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        id="metaTitle"
                                        name="metaTitle"
                                        value={formData.metaTitle || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                        disabled={!isSuperAdmin}
                                    />
                                    <p className="mt-1 text-xs text-slate-400">
                                        The title that appears in search engine results and browser tabs
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="metaDescription" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                        <FileText size={14} />
                                        Meta Description
                                    </label>
                                    <textarea
                                        id="metaDescription"
                                        name="metaDescription"
                                        value={formData.metaDescription || ''}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                        disabled={!isSuperAdmin}
                                    />
                                    <p className="mt-1 text-xs text-slate-400">
                                        A brief description of your site that appears in search engine results
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="metaImageUrl" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                        <FileImage size={14} />
                                        Meta Image URL
                                    </label>
                                    <input
                                        type="text"
                                        id="metaImageUrl"
                                        name="metaImageUrl"
                                        value={formData.metaImageUrl || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                        disabled={!isSuperAdmin}
                                    />
                                    <p className="mt-1 text-xs text-slate-400">
                                        The image that appears when your site is shared on social media
                                    </p>
                                </div>

                                <h3 className="text-lg font-semibold text-white mb-4 mt-8 pb-2 border-b border-slate-800">
                                    Design & Branding
                                </h3>

                                <div>
                                    <label htmlFor="logoUrl" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                        <ImageIcon size={14} />
                                        Logo URL
                                    </label>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            id="logoUrl"
                                            name="logoUrl"
                                            value={formData.logoUrl || ''}
                                            onChange={handleChange}
                                            className="flex-1 px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                            disabled={!isSuperAdmin}
                                        />
                                        {formData.logoUrl && (
                                            <div className="h-10 w-10 relative rounded-md overflow-hidden bg-slate-800 border border-slate-700">
                                                <Image
                                                    src={formData.logoUrl}
                                                    alt="Logo Preview"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs text-slate-400">
                                        URL to your site logo (recommended size: 512x512px)
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="favicon" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                        <ImageIcon size={14} />
                                        Favicon URL
                                    </label>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            id="favicon"
                                            name="favicon"
                                            value={formData.favicon || ''}
                                            onChange={handleChange}
                                            className="flex-1 px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                            disabled={!isSuperAdmin}
                                        />
                                        {formData.favicon && (
                                            <div className="h-10 w-10 relative rounded-md overflow-hidden bg-slate-800 border border-slate-700">
                                                <Image
                                                    src={formData.favicon}
                                                    alt="Favicon Preview"
                                                    width={32}
                                                    height={32}
                                                    className="object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs text-slate-400">
                                        URL to your favicon (recommended size: 32x32px)
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="primaryColor" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                            <PaintBucket size={14} />
                                            Primary Color
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                id="primaryColor"
                                                name="primaryColor"
                                                value={formData.primaryColor || '#22c55e'}
                                                onChange={handleChange}
                                                className="h-10 w-10 bg-transparent border-0 cursor-pointer rounded overflow-hidden"
                                                disabled={!isSuperAdmin}
                                            />
                                            <input
                                                type="text"
                                                value={formData.primaryColor || '#22c55e'}
                                                onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))
                                                }
                                                className="flex-1 px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                                placeholder="#22c55e"
                                                disabled={!isSuperAdmin}
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Main brand color (hex code)
                                        </p>
                                    </div>

                                    <div>
                                        <label htmlFor="secondaryColor" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                            <Palette size={14} />
                                            Secondary Color
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                id="secondaryColor"
                                                name="secondaryColor"
                                                value={formData.secondaryColor || '#3b82f6'}
                                                onChange={handleChange}
                                                className="h-10 w-10 bg-transparent border-0 cursor-pointer rounded overflow-hidden"
                                                disabled={!isSuperAdmin}
                                            />
                                            <input
                                                type="text"
                                                value={formData.secondaryColor || '#3b82f6'}
                                                onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))
                                                }
                                                className="flex-1 px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                                placeholder="#3b82f6"
                                                disabled={!isSuperAdmin}
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Accent color for highlights (hex code)
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-800">
                                    <motion.button
                                        type="submit"
                                        disabled={saving || !isSuperAdmin}
                                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-300 disabled:opacity-50 disabled:hover:bg-green-500 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                                        whileHover={!saving && isSuperAdmin ? { scale: 1.05 } : {}}
                                        whileTap={!saving && isSuperAdmin ? { scale: 0.95 } : {}}
                                    >
                                        {saving ? (
                                            <>
                                                <Loader size={16} className="animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} />
                                                Save Settings
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </Tab.Panel>

                        <Tab.Panel>
                            {/* Link Settings */}
                            <form onSubmit={handleSave} className="space-y-6">
                                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-slate-800">
                                    Link Configuration
                                </h3>

                                <div>
                                    <label htmlFor="redirectDelay" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                        <Clock size={14} />
                                        Redirect Delay (seconds)
                                    </label>
                                    <input
                                        type="number"
                                        id="redirectDelay"
                                        name="redirectDelay"
                                        value={formData.redirectDelay || 0}
                                        onChange={handleChange}
                                        min="0"
                                        max="10"
                                        step="1"
                                        className="w-full px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                        disabled={!isSuperAdmin}
                                    />
                                    <p className="mt-1 text-xs text-slate-400">
                                        Delay in seconds before redirecting users (0 for immediate redirect)
                                    </p>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="trackingPixelEnabled"
                                        name="trackingPixelEnabled"
                                        checked={formData.trackingPixelEnabled || false}
                                        onChange={(e) => setFormData(prev => ({ ...prev, trackingPixelEnabled: e.target.checked }))
                                        }
                                        className="h-4 w-4 rounded border-slate-700 text-green-600 focus:ring-green-500 bg-slate-800"
                                        disabled={!isSuperAdmin}
                                    />
                                    <label htmlFor="trackingPixelEnabled" className="ml-2 block text-sm text-slate-300">
                                        Enable visit tracking pixel
                                    </label>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Track visits even when JavaScript is disabled using a tracking pixel
                                </p>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="defaultLinkActive"
                                        name="defaultLinkActive"
                                        checked={formData.defaultLinkActive || false}
                                        onChange={(e) => setFormData(prev => ({ ...prev, defaultLinkActive: e.target.checked }))
                                        }
                                        className="h-4 w-4 rounded border-slate-700 text-green-600 focus:ring-green-500 bg-slate-800"
                                        disabled={!isSuperAdmin}
                                    />
                                    <label htmlFor="defaultLinkActive" className="ml-2 block text-sm text-slate-300">
                                        Set new links as active by default
                                    </label>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    When enabled, newly created links will be active immediately
                                </p>

                                <div className="pt-4 border-t border-slate-800">
                                    <motion.button
                                        type="submit"
                                        disabled={saving || !isSuperAdmin}
                                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-300 disabled:opacity-50 disabled:hover:bg-green-500 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                                        whileHover={!saving && isSuperAdmin ? { scale: 1.05 } : {}}
                                        whileTap={!saving && isSuperAdmin ? { scale: 0.95 } : {}}
                                    >
                                        {saving ? (
                                            <>
                                                <Loader size={16} className="animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} />
                                                Save Settings
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </Tab.Panel>

                        <Tab.Panel>
                            {/* Authentication Settings */}
                            <form onSubmit={handleSave} className="space-y-6">
                                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-slate-800">
                                    Email Domain Restrictions
                                </h3>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-green-400 mb-3">
                                        <Mail size={14} />
                                        Allowed Email Domains
                                    </label>

                                    <div className="bg-slate-800/50 rounded-md border border-slate-700 p-4 mb-4">
                                        <p className="text-sm text-slate-300 mb-3">
                                            Only users with email addresses from these domains will be able to register and sign in.
                                        </p>

                                        {/* Add new domain */}
                                        <div className="flex gap-2 mb-4">
                                            <input
                                                type="text"
                                                value={tempAllowedDomain}
                                                onChange={(e) => setTempAllowedDomain(e.target.value)}
                                                placeholder="example.com"
                                                className="flex-1 px-4 py-2 border border-slate-700 rounded-md bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                                disabled={!isSuperAdmin}
                                            />
                                            <motion.button
                                                type="button"
                                                onClick={handleAddAllowedDomain}
                                                disabled={!isSuperAdmin}
                                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-300 disabled:opacity-50 disabled:hover:bg-green-500 disabled:cursor-not-allowed font-medium"
                                                whileHover={isSuperAdmin ? { scale: 1.05 } : {}}
                                                whileTap={isSuperAdmin ? { scale: 0.95 } : {}}
                                            >
                                                Add Domain
                                            </motion.button>
                                        </div>

                                        {/* Domain list */}
                                        <div className="space-y-2">
                                            {(formData.allowedDomains || []).length === 0 ? (
                                                <p className="text-sm text-slate-500 py-2">No domains added. All email domains will be allowed.</p>
                                            ) : (
                                                (formData.allowedDomains || []).map(domain => (
                                                    <div key={domain} className="flex items-center justify-between bg-slate-900 rounded-md p-2 border border-slate-800">
                                                        <span className="text-slate-300">{domain}</span>
                                                        {isSuperAdmin && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveAllowedDomain(domain)}
                                                                className="text-red-400 hover:text-red-300 p-1 rounded-md"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-800">
                                    <motion.button
                                        type="submit"
                                        disabled={saving || !isSuperAdmin}
                                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-300 disabled:opacity-50 disabled:hover:bg-green-500 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                                        whileHover={!saving && isSuperAdmin ? { scale: 1.05 } : {}}
                                        whileTap={!saving && isSuperAdmin ? { scale: 0.95 } : {}}
                                    >
                                        {saving ? (
                                            <>
                                                <Loader size={16} className="animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} />
                                                Save Settings
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </motion.div>

            {/* Preview Panel */}
            <motion.div
                className="card p-6 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Eye size={18} className="text-green-400" />
                    Preview
                </h3>

                <div className="border border-slate-700 rounded-md p-4 bg-slate-800/50">
                    <div className="flex items-center gap-3 mb-4">
                        {formData.logoUrl ? (
                            <div className="w-10 h-10 relative rounded-md overflow-hidden">
                                <Image
                                    src={formData.logoUrl}
                                    alt="Logo Preview"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-green-500/20 rounded-md flex items-center justify-center">
                                <span className="text-green-500 font-bold">BB</span>
                            </div>
                        )}
                        <div>
                            <p className="font-bold text-white">{formData.siteName || 'ByteBrush Links'}</p>
                            <p className="text-xs text-slate-400">{formData.domain?.replace('https://', '') || 'aka.bytebrush.dev'}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-900 rounded-md border border-slate-800 mb-4">
                        <div className="h-8 mb-2 rounded bg-slate-800 w-3/4"></div>
                        <div className="h-20 rounded bg-slate-800 w-full"></div>
                        <div className="mt-4 flex gap-2">
                            <div
                                className="h-10 rounded w-32"
                                style={{ backgroundColor: formData.primaryColor || '#22c55e' }}
                            ></div>
                            <div
                                className="h-10 rounded w-32"
                                style={{ backgroundColor: formData.secondaryColor || '#3b82f6' }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-400">Preview reflects your current settings</p>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: formData.primaryColor || '#22c55e' }}
                                title="Primary Color"
                            ></div>
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: formData.secondaryColor || '#3b82f6' }}
                                title="Secondary Color"
                            ></div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// Needed icons
function Building({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <line x1="9" y1="22" x2="9" y2="2"></line>
            <line x1="15" y1="22" x2="15" y2="2"></line>
        </svg>
    );
}

function Lock({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
    );
}

function Github({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
    );
}

function Shield({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
    );
}
