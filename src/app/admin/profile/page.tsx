'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    User, Mail, Shield, Key, Save, AlertCircle,
    Loader, CheckCircle, RefreshCw, ClipboardCheck
} from "lucide-react";

export default function ProfilePage() {
    const { data: session, update } = useSession();

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        if (session?.user) {
            setProfileData({
                name: session.user.name || "",
                email: session.user.email || "",
            });
        }
    }, [session]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Success state
        setSuccess(true);
        setLoading(false);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords don't match");
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            return;
        }

        setPasswordLoading(true);
        setPasswordError("");
        setPasswordSuccess(false);

        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Success state
        setPasswordSuccess(true);
        setPasswordLoading(false);
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        // Clear success message after 3 seconds
        setTimeout(() => setPasswordSuccess(false), 3000);
    };

    const copyApiKey = () => {
        navigator.clipboard.writeText("sk_live_example_api_key_123456789");
        // Show copied notification
    };

    const regenerateApiKey = async () => {
        // Logic to regenerate API key
    };

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-6xl p-4 mx-auto sm:p-8">
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl font-bold sm:text-3xl">
                    <span className="gradient-text">Profile Settings</span>
                </h1>
                <p className="mt-1 text-slate-400">
                    Manage your account settings and preferences
                </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    {/* Account Information */}
                    <motion.div
                        className="p-6 mb-8 card"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        <h2 className="flex items-center gap-2 mb-6 text-xl font-semibold text-white">
                            <User size={20} className="text-green-400" />
                            Account Information
                        </h2>

                        {error && (
                            <div className="flex items-center p-4 mb-6 text-red-400 border rounded-md bg-red-500/10 border-red-500/30">
                                <AlertCircle size={16} className="flex-shrink-0 mr-2" />
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="flex items-center p-4 mb-6 text-green-400 border rounded-md bg-green-500/10 border-green-500/30">
                                <CheckCircle size={16} className="flex-shrink-0 mr-2" />
                                <span>Profile updated successfully!</span>
                            </div>
                        )}

                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            <motion.div variants={item}>
                                <label htmlFor="name" className="flex items-center gap-2 mb-1 text-sm font-medium text-green-400">
                                    <User size={14} />
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleProfileChange}
                                    className="w-full px-4 py-2 text-white transition-all border rounded-md border-slate-700 bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Your name"
                                />
                            </motion.div>

                            <motion.div variants={item}>
                                <label htmlFor="email" className="flex items-center gap-2 mb-1 text-sm font-medium text-green-400">
                                    <Mail size={14} />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleProfileChange}
                                    className="w-full px-4 py-2 text-white transition-all border rounded-md border-slate-700 bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="your@email.com"
                                    disabled
                                />
                                <p className="mt-1 text-xs text-slate-400">
                                    Email address cannot be changed. Contact an administrator for assistance.
                                </p>
                            </motion.div>

                            <motion.div variants={item}>
                                <label className="flex items-center gap-2 mb-1 text-sm font-medium text-green-400">
                                    <Shield size={14} />
                                    Role
                                </label>
                                <div className="w-full px-4 py-2 text-white border rounded-md border-slate-700 bg-slate-800/50">
                                    <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-sm">
                                        {session?.user?.role === 'SUPERADMIN' ? 'Super Admin' :
                                            session?.user?.role === 'ADMIN' ? 'Admin' : 'User'}
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div variants={item} className="pt-4 border-t border-slate-800">
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-2 font-medium text-white transition-all duration-300 bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-500 disabled:cursor-not-allowed"
                                    whileHover={!loading ? { scale: 1.05 } : {}}
                                    whileTap={!loading ? { scale: 0.95 } : {}}
                                >
                                    {loading ? (
                                        <>
                                            <Loader size={16} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            Save Changes
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        </form>
                    </motion.div>

                    {/* Change Password */}
                    <motion.div
                        className="p-6 mb-8 card lg:mb-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h2 className="flex items-center gap-2 mb-6 text-xl font-semibold text-white">
                            <Key size={20} className="text-blue-400" />
                            Change Password
                        </h2>

                        {passwordError && (
                            <div className="flex items-center p-4 mb-6 text-red-400 border rounded-md bg-red-500/10 border-red-500/30">
                                <AlertCircle size={16} className="flex-shrink-0 mr-2" />
                                <span>{passwordError}</span>
                            </div>
                        )}

                        {passwordSuccess && (
                            <div className="flex items-center p-4 mb-6 text-green-400 border rounded-md bg-green-500/10 border-green-500/30">
                                <CheckCircle size={16} className="flex-shrink-0 mr-2" />
                                <span>Password updated successfully!</span>
                            </div>
                        )}

                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="currentPassword" className="flex items-center gap-2 mb-1 text-sm font-medium text-blue-400">
                                    <Key size={14} />
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 text-white transition-all border rounded-md border-slate-700 bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="newPassword" className="flex items-center gap-2 mb-1 text-sm font-medium text-blue-400">
                                    <Key size={14} />
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 text-white transition-all border rounded-md border-slate-700 bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="flex items-center gap-2 mb-1 text-sm font-medium text-blue-400">
                                    <Key size={14} />
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-2 text-white transition-all border rounded-md border-slate-700 bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-800">
                                <motion.button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="flex items-center gap-2 px-6 py-2 font-medium text-white transition-all duration-300 bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 disabled:cursor-not-allowed"
                                    whileHover={!passwordLoading ? { scale: 1.05 } : {}}
                                    whileTap={!passwordLoading ? { scale: 0.95 } : {}}
                                >
                                    {passwordLoading ? (
                                        <>
                                            <Loader size={16} className="animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Key size={16} />
                                            Update Password
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>

                {/* API Keys */}
                <motion.div
                    className="relative p-6 card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Coming Soon Badge */}
                    <motion.div
                        className="absolute z-10 -top-3 -right-3"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                            delay: 0.3
                        }}
                    >
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-wider">
                            <span className="relative flex w-2 h-2">
                                <span className="absolute inline-flex w-full h-full bg-white rounded-full opacity-75 animate-ping"></span>
                                <span className="relative inline-flex w-2 h-2 bg-white rounded-full"></span>
                            </span>
                            Coming Soon
                        </div>
                    </motion.div>

                    {/* Blurred Content */}
                    <div className="filter blur-[3px] pointer-events-none select-none opacity-70">
                        <h2 className="flex items-center gap-2 mb-6 text-xl font-semibold text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400" width="20" height="20">
                                <polyline points="16 18 22 12 16 6"></polyline>
                                <polyline points="8 6 2 12 8 18"></polyline>
                            </svg>
                            API Access
                        </h2>

                        <div className="space-y-6">
                            <p className="text-sm text-slate-400">
                                Use your API key to interact with the ByteBrush Links API for programmatic access.
                            </p>

                            <div className="p-4 border rounded-lg bg-slate-800/50 border-slate-700/50">
                                <label className="block mb-1 text-xs text-slate-400">API Key</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="password"
                                        value="sk_live_example_api_key_123456789"
                                        readOnly
                                        className="w-full px-3 py-2 text-sm border rounded bg-slate-900 border-slate-800 text-slate-300"
                                    />
                                    <motion.button
                                        className="p-2 transition-colors text-slate-400 hover:text-purple-400"
                                        title="Copy API key"
                                    >
                                        <ClipboardCheck size={18} />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    className="flex items-center gap-2 px-4 py-2 text-purple-400 transition-all duration-300 border rounded-md bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30"
                                >
                                    <RefreshCw size={16} />
                                    Regenerate API Key
                                </button>
                            </div>

                            <div className="p-4 mt-4 border rounded-lg border-amber-500/20 bg-amber-500/5">
                                <p className="flex items-start gap-2 text-sm text-amber-300">
                                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                    <span>
                                        Keep your API key secret. Regenerating will invalidate your previous key.
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Message overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg pointer-events-none bg-slate-900/50 backdrop-blur-sm">
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                scale: [1, 1.02, 1]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                            className="mb-3"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                                <path d="M10 2v7.31"></path>
                                <path d="M14 9.3V1.99"></path>
                                <path d="M8.5 14.5A3.5 3.5 0 0 0 5 18c0 1.4.8 2.4 2 3 1.4.7 2.2 2.1 2 3.5"></path>
                                <path d="M14 22c.3-1.5 1.2-2.8 3-3 1.2-.6 2-1.6 2-3a3.5 3.5 0 0 0-3.5-3.5c-1.5 0-2.7.9-3.2 2.2"></path>
                                <path d="M12 10c1.9 0 3.5 1.6 3.5 3.5 0 2.7-4 6.5-7 9.5 0-3 .5-6-3.5-7 0-2.2 1.5-3.5 3.5-3.5 1 0 2 .5 2.5 1"></path>
                            </svg>
                        </motion.div>
                        <p className="text-base font-medium text-white">API Access is coming soon!</p>
                        <p className="px-8 mt-2 text-sm text-center text-slate-300">
                            We're working on a robust API for programmatic access to your short links.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
