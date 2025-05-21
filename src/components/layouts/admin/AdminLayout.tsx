'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSettings } from '@/hooks/useSettings';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { motion } from 'framer-motion';
import { BarChart2, Link2, PlusCircle, Settings, Users } from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { data: session, status } = useSession();
    const { settings } = useSettings();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Check if screen is mobile on initial render and when window is resized
    useEffect(() => {
        const checkScreenSize = () => {
            setIsSidebarOpen(window.innerWidth >= 1024);
        };

        // Check on initial render
        checkScreenSize();

        // Add event listener for window resize
        window.addEventListener('resize', checkScreenSize);

        // Clean up event listener
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    // Toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Loading state
    if (status === "loading") {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#0c1120]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
            </div>
        );
    }

    // Main navigation items
    const mainNavItems = [
        {
            name: 'Dashboard',
            href: '/admin',
            icon: BarChart2,
            current: false,
        },
        {
            name: 'Manage Links',
            href: '/admin/links',
            icon: Link2,
            current: false,
        },
        {
            name: 'Create Link',
            href: '/admin/links/create',
            icon: PlusCircle,
            current: false,
        },
        {
            name: 'Users',
            href: '/admin/users',
            icon: Users,
            current: false,
        },
        {
            name: 'Settings',
            href: '/admin/settings',
            icon: Settings,
            current: false,
        }
    ];

    return (
        <div className="flex h-screen bg-[#0c1120] text-white">
            <AdminSidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                mainNavItems={mainNavItems}
                siteName={settings.siteName}
                session={session}
            />

            <div className="flex flex-1 flex-col overflow-hidden">
                <AdminHeader
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    session={session}
                />

                <main className="flex-1 overflow-auto bg-slate-950/50">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
