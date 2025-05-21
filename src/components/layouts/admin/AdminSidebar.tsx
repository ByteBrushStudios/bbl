'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, X, Menu, ChevronRight } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    current: boolean;
}

interface AdminSidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    mainNavItems: NavItem[];
    siteName: string;
    session: any;
}

export default function AdminSidebar({
    isOpen,
    toggleSidebar,
    mainNavItems,
    siteName,
    session
}: AdminSidebarProps) {
    const pathname = usePathname();

    // Function to check if a nav item is active
    const isActive = (href: string) => {
        if (href === '/admin' && pathname === '/admin') {
            return true;
        }
        return pathname.startsWith(href) && href !== '/admin';
    };

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
                        onClick={toggleSidebar}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: isOpen ? 0 : -300 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={`fixed top-0 left-0 z-30 h-screen w-64 bg-slate-900 border-r border-slate-800 shadow-xl lg:static lg:shadow-none lg:translate-x-0`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="relative flex items-center justify-center w-8 h-8 overflow-hidden rounded-md bg-green-500/10">
                            <Image
                                src="/bytebrush/logo.png"
                                alt={siteName}
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-white">{siteName}</span>
                            <span className="text-xs text-slate-400">Admin Panel</span>
                        </div>
                    </Link>
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Sidebar Content */}
                <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto py-4">
                    <div className="px-4 mb-2">
                        <p className="px-2 text-xs font-medium tracking-wider uppercase text-slate-400">Main Menu</p>
                    </div>

                    <nav className="px-2 mb-auto space-y-1">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all ${isActive(item.href)
                                        ? 'bg-green-500/20 text-green-400 border-l-2 border-green-500'
                                        : 'border-l-2 border-transparent text-slate-300 hover:bg-slate-800 hover:text-green-400'
                                    }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive(item.href) ? 'text-green-400' : 'text-slate-400 group-hover:text-green-400'
                                        }`}
                                    aria-hidden="true"
                                />
                                <span>{item.name}</span>
                                {isActive(item.href) && (
                                    <ChevronRight size={16} className="ml-auto text-green-400" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className="px-4 pt-4 mt-auto border-t border-slate-800">
                        <div className="p-3 mb-4 rounded-md bg-slate-800/50">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-8 h-8 font-medium text-green-400 rounded-full bg-green-500/20">
                                        {session?.user?.name?.[0]?.toUpperCase() || 'A'}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-white">
                                        {session?.user?.name || 'Admin User'}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {session?.user?.email || ''}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-400 transition-colors rounded-md hover:bg-red-500/10 hover:text-red-300"
                        >
                            <LogOut className="flex-shrink-0 w-5 h-5 mr-3" aria-hidden="true" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}
