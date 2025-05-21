'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSettings } from '@/components/providers/SettingsProvider';
import {
    Settings, Link2, Mail, Globe, Save,
    Server, Cloud, Shield, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/Toast';

export default function SettingsPage() {
    const { data: session } = useSession();
    const globalSettings = useSettings();
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Settings form states
    const [settings, setSettings] = useState({
        siteName: '',
        domain: '',
        supportEmail: '',
        redirectDelay: 0,
        allowedDomains: [],
        trackingPixelEnabled: true,
        defaultLinkActive: true
    });

    // Update local state when global settings are loaded
    useEffect(() => {
        if (globalSettings) {
            setSettings({
                siteName: globalSettings.siteName || '',
                domain: globalSettings.domain || '',
                supportEmail: globalSettings.supportEmail || '',
                redirectDelay: globalSettings.redirectDelay || 0,
                allowedDomains: globalSettings.allowedDomains || [],
                trackingPixelEnabled: globalSettings.trackingPixelEnabled || true,
                defaultLinkActive: globalSettings.defaultLinkActive || true
            });
        }
    }, [globalSettings]);

    const isSuperAdmin = session?.user?.isSuperAdmin || false;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            if (!response.ok) {
                throw new Error('Failed to save settings');
            }

            setSuccessMessage('Settings saved successfully!');
            toast({
                title: 'Success',
                description: 'Settings have been updated successfully.',
                variant: 'success',
            });

            // Force reload the page to update global settings
            window.location.reload();
        } catch (error) {
            console.error('Error saving settings:', error);
            toast({
                title: 'Error',
                description: 'Failed to save settings.',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        }
    };

    const handleCacheRefresh = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccessMessage('Cache refreshed successfully!');
            toast({
                title: 'Success',
                description: 'Cache has been refreshed.',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to refresh cache.',
                variant: 'destructive',
            });
        }

        // Clear success message after 3 seconds
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };

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
                <p className="text-slate-400 mt-1">Configure site-wide settings and options for ByteBrush Links</p>
            </motion.div>

            {/* Success message */}
            {successMessage && (
                <motion.div
                    className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-md flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>{successMessage}</span>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <motion.div
                        className="card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                            <Settings size={20} className="text-green-400" />
                            General Settings
                        </h2>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Site name field */}
                            <div>
                                <label htmlFor="siteName" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                    <Link2 size={14} />
                                    Site Name
                                </label>
                                <input
                                    type="text"
                                    id="siteName"
                                    name="siteName"
                                    value={settings.siteName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                    disabled={!isSuperAdmin}
                                />
                                <p className="mt-1 text-xs text-slate-400">The name of your shortlink service displayed throughout the site</p>
                            </div>

                            {/* Domain field */}
                            <div>
                                <label htmlFor="domain" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                    <Globe size={14} />
                                    Base URL
                                </label>
                                <input
                                    type="url"
                                    id="domain"
                                    name="domain"
                                    value={settings.domain}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                    disabled={!isSuperAdmin}
                                />
                                <p className="mt-1 text-xs text-slate-400">The domain used for your short links (must include https://)</p>
                            </div>

                            {/* Support email field */}
                            <div>
                                <label htmlFor="supportEmail" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                    <Mail size={14} />
                                    Support Email
                                </label>
                                <input
                                    type="email"
                                    id="supportEmail"
                                    name="supportEmail"
                                    value={settings.supportEmail}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                    disabled={!isSuperAdmin}
                                />
                                <p className="mt-1 text-xs text-slate-400">Email address displayed for support inquiries</p>
                            </div>

                            {/* Redirect delay field */}
                            <div>
                                <label htmlFor="redirectDelay" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                                    <Clock size={14} />
                                    Redirect Delay (seconds)
                                </label>
                                <input
                                    type="number"
                                    id="redirectDelay"
                                    name="redirectDelay"
                                    value={settings.redirectDelay}
                                    min="0"
                                    max="10"
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                />
                                <p className="mt-1 text-xs text-slate-400">Delay in seconds before redirecting (0 for immediate redirect)</p>
                            </div>

                            {/* Form submit */}
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
                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
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
                    </motion.div>
                </div>

                <div>
                    {/* System information card */}
                    <motion.div
                        className="card p-6 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                            <Server size={20} className="text-blue-400" />
                            System Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-400">Version</p>
                                <p className="font-medium text-white">1.0.0</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Environment</p>
                                <p className="font-medium text-white">Production</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Database</p>
                                <div className="flex items-center">
                                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    <span className="font-medium text-white">Connected</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Storage</p>
                                <div className="flex items-center">
                                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    <span className="font-medium text-white">84% Available</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Cache management card */}
                    <motion.div
                        className="card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                            <Cloud size={20} className="text-purple-400" />
                            Cache Management
                        </h2>

                        <p className="text-sm text-slate-400 mb-4">
                            Clear the application cache to force fresh data to be loaded. This may temporarily slow down the site.
                        </p>

                        <motion.button
                            onClick={handleCacheRefresh}
                            disabled={!isSuperAdmin}
                            className="w-full px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-md hover:bg-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:hover:bg-purple-500/20 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            whileHover={isSuperAdmin ? { scale: 1.02 } : {}}
                            whileTap={isSuperAdmin ? { scale: 0.98 } : {}}
                        >
                            <RefreshCw size={16} />
                            Refresh Cache
                        </motion.button>

                        {!isSuperAdmin && (
                            <p className="mt-3 text-xs text-amber-400">
                                <Shield size={12} className="inline mr-1" />
                                Super admin privileges required
                            </p>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function Clock({ size, className }) {
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
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}
