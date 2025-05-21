'use client';

import { Menu, Bell, PlusCircle, User, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';

interface AdminHeaderProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
    session: any;
}

export default function AdminHeader({
    toggleSidebar,
    isSidebarOpen,
    session
}: AdminHeaderProps) {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const toggleUserMenu = () => {
        setUserMenuOpen(!userMenuOpen);
        if (notificationsOpen) setNotificationsOpen(false);
    };

    const toggleNotifications = () => {
        setNotificationsOpen(!notificationsOpen);
        if (userMenuOpen) setUserMenuOpen(false);
    };

    return (
        <header className="flex h-16 items-center border-b border-slate-800 bg-slate-900 px-4 lg:px-6">
            {/* Mobile menu button */}
            <button
                onClick={toggleSidebar}
                className={`mr-4 rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white ${isSidebarOpen ? 'lg:hidden' : ''}`}
            >
                <Menu size={20} />
            </button>

            <div className="flex flex-1 items-center justify-between">
                <h1 className="text-xl font-semibold text-white hidden sm:block">Dashboard</h1>

                <div className="flex items-center space-x-2">
                    {/* Quick Actions Button */}
                    <div className="relative">
                        <Link
                            href="/admin/links/create"
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md flex items-center gap-2 text-sm"
                        >
                            <PlusCircle size={16} />
                            <span className="hidden sm:inline">Create Link</span>
                        </Link>
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={toggleNotifications}
                            className="relative rounded-md p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500"></span>
                        </button>

                        <AnimatePresence>
                            {notificationsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-80 rounded-md bg-slate-800 border border-slate-700 shadow-lg z-10"
                                >
                                    <div className="border-b border-slate-700 px-4 py-3">
                                        <h3 className="text-sm font-medium text-white">Notifications</h3>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto p-2">
                                        <div className="text-center py-6 text-slate-400 text-sm">
                                            No new notifications
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* User menu */}
                    <div className="relative">
                        <button
                            onClick={toggleUserMenu}
                            className="flex items-center space-x-2 rounded-md p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-medium">
                                {session?.user?.name?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <span className="hidden text-sm md:block">
                                {session?.user?.name?.split(' ')[0] || 'Admin'}
                            </span>
                        </button>

                        <AnimatePresence>
                            {userMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-64 rounded-md bg-slate-800 border border-slate-700 shadow-lg z-10"
                                >
                                    <div className="border-b border-slate-700 p-3">
                                        <p className="text-sm font-medium text-white">{session?.user?.name}</p>
                                        <p className="text-xs text-slate-400">{session?.user?.email}</p>
                                    </div>
                                    <div className="p-2">
                                        <Link
                                            href="/admin/profile"
                                            className="flex items-center rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <User size={16} className="mr-2" />
                                            Profile
                                        </Link>
                                        <Link
                                            href="/admin/settings"
                                            className="flex items-center rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <Settings size={16} className="mr-2" />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                                            className="flex w-full items-center rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                        >
                                            <LogOut size={16} className="mr-2" />
                                            Sign Out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
