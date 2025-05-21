'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutGrid,
    Link2,
    PlusCircle,
    LogOut,
    ArrowLeft,
    Menu,
    X,
    User,
    ChevronDown,
    BarChart2,
    Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    // Set isClient to true once component mounts
    useEffect(() => {
        setIsClient(true);
        // Initial check for desktop
        if (typeof window !== 'undefined') {
            setIsDesktop(window.innerWidth >= 1024);
        }
    }, []);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    // Handle resize events
    useEffect(() => {
        if (!isClient) return; // Skip if not client-side yet

        const handleResize = () => {
            const desktop = window.innerWidth >= 1024;
            setIsDesktop(desktop);
            if (desktop) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isClient]);

    // Navigation items
    const navItems = [
        {
            title: "Dashboard",
            href: "/admin",
            icon: <LayoutGrid size={18} />,
            exact: true
        },
        {
            title: "Manage Links",
            href: "/admin/links",
            icon: <Link2 size={18} />,
            exact: true
        },
        {
            title: "Create Link",
            href: "/admin/links/create",
            icon: <PlusCircle size={18} />,
            exact: true
        },
        {
            title: "Manage Users",
            href: "/admin/users",
            icon: <User size={18} />,
            exact: false,
            adminOnly: true
        },
        {
            title: "Settings",
            href: "/admin/settings",
            icon: <Settings size={18} />,
            exact: true,
            adminOnly: true
        }
    ];

    // Filter navItems based on user role
    const filteredNavItems = navItems.filter(item =>
        !item.adminOnly || (session?.user?.isAdmin)
    );

    return (
        <div className="flex min-h-screen relative bg-[#0c1120]">
            {/* Mobile Menu Button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900/90 backdrop-blur-sm rounded-md text-white shadow-lg border border-slate-800"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar - Desktop always visible, Mobile as overlay */}
            {isClient && (
                <AnimatePresence>
                    {(isSidebarOpen || isDesktop) && (
                        <motion.aside
                            className={`${isSidebarOpen ? 'fixed inset-0 z-40 w-72' : 'hidden lg:block w-72'} 
                                bg-slate-900/90 backdrop-blur-sm border-r border-slate-800 text-white p-6`}
                            initial={{ x: isSidebarOpen ? -300 : 0 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <div className="mb-8">
                                <Link href="/" className="flex items-center gap-3">
                                    <div className="w-10 h-10 relative flex items-center justify-center bg-green-500/10 rounded-md overflow-hidden">
                                        <Image
                                            src="/bytebrush/logo.png"
                                            alt="ByteBrush"
                                            width={40}
                                            height={40}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold">Admin Panel</h1>
                                        <p className="text-xs text-slate-400">ByteBrush Links</p>
                                    </div>
                                </Link>
                            </div>

                            <nav className="space-y-1.5">
                                {filteredNavItems.map((item) => {
                                    const isActive = item.exact
                                        ? pathname === item.href
                                        : pathname.startsWith(item.href);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200
                                                ${isActive
                                                    ? 'bg-green-500/20 text-green-400 border-l-2 border-green-500'
                                                    : 'hover:bg-slate-800 hover:text-green-400 border-l-2 border-transparent'}`}
                                        >
                                            {item.icon}
                                            <span>{item.title}</span>
                                            {item.href === '/admin/links/create' && (
                                                <span className="ml-auto px-1.5 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-md">
                                                    New
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="mt-auto pt-6 border-t border-slate-800/50 space-y-1.5">
                                <Link
                                    href="/"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-md text-slate-400 hover:bg-slate-800 hover:text-green-400 transition-colors"
                                >
                                    <ArrowLeft size={16} />
                                    Back to Site
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-md text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors text-left"
                                >
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </div>

                            {/* Stats footer */}
                            <div className="mt-6 pt-6 border-t border-slate-800/50">
                                <div className="flex items-center gap-4 px-4 py-2 bg-slate-800/50 rounded-md border border-slate-700/50">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <BarChart2 size={12} className="text-green-400" />
                                            <span className="text-xs font-medium text-slate-300">System Status</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5">All services operational</p>
                                    </div>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>
            )}

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <main className="flex-1 bg-[#0c1120] overflow-x-hidden min-h-screen">
                <div className="p-4 sm:p-8 max-w-7xl mx-auto">
                    {/* Header bar with user dropdown */}
                    <div className="flex justify-end mb-6 mt-10 lg:mt-0 relative">
                        <div className="relative">
                            <motion.button
                                className="flex items-center gap-2 bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-full px-3 py-1 transition-all hover:bg-slate-800"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-xs text-white font-bold">
                                    {session?.user?.name?.[0]?.toUpperCase() || 'A'}
                                </div>
                                <div className="text-left mr-1">
                                    <p className="text-sm font-medium text-slate-300 truncate max-w-[100px]">
                                        {session?.user?.name || 'Admin'}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {session?.user?.role === 'SUPERADMIN' ? 'Super Admin' :
                                            session?.user?.role === 'ADMIN' ? 'Admin' : 'User'}
                                    </p>
                                </div>
                                <ChevronDown size={16} className="text-slate-400" />
                            </motion.button>

                            {/* User dropdown menu */}
                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        className="absolute right-0 mt-2 w-48 rounded-md bg-slate-900 border border-slate-800 shadow-lg z-50"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="p-2 border-b border-slate-800">
                                            <p className="text-sm font-medium text-white">{session?.user?.name}</p>
                                            <p className="text-xs text-slate-400">{session?.user?.email}</p>
                                        </div>
                                        <div className="p-1">
                                            <Link
                                                href="/admin/profile"
                                                className="block px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-md"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                Profile Settings
                                            </Link>
                                            <button
                                                onClick={() => signOut({ callbackUrl: '/' })}
                                                className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-md"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Page content */}
                    {children}
                </div>
            </main>
        </div>
    );
}
