'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Link2, PlusCircle, BarChart3, Activity, Eye, Calendar, ArrowUpRight, Clock, Shield, Users, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

// Dashboard data type
type DashboardData = {
    totalLinks: number;
    totalVisits: number;
    recentLinks: any[];
    topLinks: any[];
};

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        totalLinks: 0,
        totalVisits: 0,
        recentLinks: [],
        topLinks: []
    });
    const { data: session } = useSession();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('/api/dashboard');

                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }

                const data = await response.json();
                setDashboardData(data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);
    // Animation variants for staggered children
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

    if (isLoading) {
        return (
            <div className="p-4 sm:p-8 max-w-7xl mx-auto">
                <div className="h-96 flex items-center justify-center">
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <motion.div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        <span className="gradient-text">Welcome back{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}</span>
                    </h1>
                    <p className="text-slate-400 mt-1">Here's what's happening with your links</p>
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        href="/admin/links/create"
                        className="btn-primary flex items-center gap-2 relative overflow-hidden group"
                    >
                        <span className="absolute inset-0 w-full h-full bg-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <PlusCircle size={18} className="relative z-10" />
                        <span className="relative z-10">Create New Link</span>
                    </Link>
                </motion.div>
            </motion.div>

            {/* New Admin Stats section */}
            {(session?.user?.isAdmin || session?.user?.isSuperAdmin) && (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                >
                    <div className="p-4 bg-gradient-to-br from-indigo-900/30 to-indigo-800/10 rounded-lg border border-indigo-800/30 flex items-center">
                        <div className="p-3 rounded-lg bg-indigo-500/20 mr-4">
                            <Users size={20} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm text-indigo-300">Total Users</p>
                            <p className="text-xl font-bold text-white">5</p>
                        </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-purple-900/30 to-purple-800/10 rounded-lg border border-purple-800/30 flex items-center">
                        <div className="p-3 rounded-lg bg-purple-500/20 mr-4">
                            <Shield size={20} className="text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-purple-300">Access Level</p>
                            <p className="text-xl font-bold text-white">
                                {session?.user?.isSuperAdmin ? 'Super Admin' : 'Admin'}
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-amber-900/30 to-amber-800/10 rounded-lg border border-amber-800/30 flex items-center">
                        <div className="p-3 rounded-lg bg-amber-500/20 mr-4">
                            <AlertTriangle size={20} className="text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm text-amber-300">System Status</p>
                            <p className="text-xl font-bold text-white flex items-center">
                                Healthy
                                <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Stats cards */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <motion.div
                    className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 shadow-lg border border-slate-700 hover:border-green-500/30 transition-colors"
                    variants={item}
                    whileHover={{
                        scale: 1.02,
                        boxShadow: "0 10px 30px -10px rgba(34, 197, 94, 0.2)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-medium text-slate-300">Total Links</h2>
                        <div className="p-2 bg-green-500/10 rounded-full">
                            <Link2 size={20} className="text-green-400" />
                        </div>
                    </div>
                    <p className="text-4xl font-bold gradient-text">{dashboardData.totalLinks}</p>
                    <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                        <p className="text-xs text-slate-400">
                            <Calendar size={12} className="inline mr-1" /> Last 30 days
                        </p>
                        <Link
                            href="/admin/links"
                            className="text-xs text-green-400 hover:text-green-300 flex items-center"
                        >
                            View all <ArrowUpRight size={12} className="ml-1" />
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 shadow-lg border border-slate-700 hover:border-green-500/30 transition-colors"
                    variants={item}
                    whileHover={{
                        scale: 1.02,
                        boxShadow: "0 10px 30px -10px rgba(34, 197, 94, 0.2)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-medium text-slate-300">Total Visits</h2>
                        <div className="p-2 bg-blue-500/10 rounded-full">
                            <Eye size={20} className="text-blue-400" />
                        </div>
                    </div>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        {dashboardData.totalVisits}
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                        <p className="text-xs text-slate-400">
                            <Activity size={12} className="inline mr-1" /> Overall performance
                        </p>
                        <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full">
                            Live tracking
                        </span>
                    </div>
                </motion.div>
            </motion.div>

            {/* Recent and top links */}
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                {/* Recent links */}
                <motion.div
                    className="bg-slate-900/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-slate-800"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="p-2 mr-3 bg-green-500/10 rounded-md">
                                <Clock size={18} className="text-green-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Recent Links</h2>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/admin/links"
                                className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center"
                            >
                                View All
                                <ArrowUpRight size={14} className="ml-1" />
                            </Link>
                        </motion.div>
                    </div>
                    <div className="p-6">
                        {dashboardData.recentLinks.length > 0 ? (
                            <motion.ul
                                className="space-y-4"
                                variants={container}
                                initial="hidden"
                                animate="show"
                            >
                                {dashboardData.recentLinks.map((link) => (
                                    <motion.li
                                        key={link.id}
                                        className="bg-slate-800/50 rounded-md p-4 border border-slate-700 hover:border-green-500/50 transition-all hover:bg-slate-800 group"
                                        variants={item}
                                        whileHover={{
                                            scale: 1.01,
                                            boxShadow: "0 8px 20px -6px rgba(0, 0, 0, 0.3)"
                                        }}
                                    >
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <div className="overflow-hidden">
                                                <p className="font-medium text-white truncate max-w-[250px] flex items-center">
                                                    /{link.slug}
                                                    <Link
                                                        href={`/${link.slug}`}
                                                        target="_blank"
                                                        className="ml-2 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <ArrowUpRight size={14} />
                                                    </Link>
                                                </p>
                                                <p className="text-sm text-slate-400 truncate max-w-[250px]">{link.targetUrl}</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm bg-green-500/10 text-green-400 font-medium px-2 py-1 rounded-full">
                                                    {link.visits} visits
                                                </span>
                                                <span className="text-xs text-slate-500 mt-1">
                                                    {new Date(link.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        ) : (
                            <motion.div
                                className="text-slate-400 py-8 text-center bg-slate-800/30 rounded-lg border border-dashed border-slate-700"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Link2 size={32} className="mx-auto mb-3 text-slate-500" />
                                <p>No links created yet.</p>
                                <Link
                                    href="/admin/links/create"
                                    className="mt-4 inline-block text-green-400 hover:text-green-300 text-sm"
                                >
                                    Create your first link
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Top links */}
                <motion.div
                    className="bg-slate-900/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-slate-800"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="p-2 mr-3 bg-blue-500/10 rounded-md">
                                <BarChart3 size={18} className="text-blue-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Top Performing Links</h2>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/admin/links"
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
                            >
                                View All
                                <ArrowUpRight size={14} className="ml-1" />
                            </Link>
                        </motion.div>
                    </div>
                    <div className="p-6">
                        {dashboardData.topLinks.length > 0 ? (
                            <motion.ul
                                className="space-y-4"
                                variants={container}
                                initial="hidden"
                                animate="show"
                            >
                                {dashboardData.topLinks.map((link, index) => (
                                    <motion.li
                                        key={link.id}
                                        className="bg-slate-800/50 rounded-md p-4 border border-slate-700 hover:border-blue-500/50 transition-all hover:bg-slate-800 group"
                                        variants={item}
                                        whileHover={{
                                            scale: 1.01,
                                            boxShadow: "0 8px 20px -6px rgba(0, 0, 0, 0.3)"
                                        }}
                                    >
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <div className="overflow-hidden flex items-center">
                                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400 mr-2">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white truncate max-w-[220px] flex items-center">
                                                        /{link.slug}
                                                        <Link
                                                            href={`/${link.slug}`}
                                                            target="_blank"
                                                            className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <ArrowUpRight size={14} />
                                                        </Link>
                                                    </p>
                                                    <p className="text-sm text-slate-400 truncate max-w-[220px]">{link.targetUrl}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm bg-blue-500/10 text-blue-400 font-medium px-2 py-1 rounded-full">
                                                    {link.visits} visits
                                                </span>
                                                <span className="text-xs text-slate-500 mt-1">
                                                    {new Date(link.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        ) : (
                            <motion.div
                                className="text-slate-400 py-8 text-center bg-slate-800/30 rounded-lg border border-dashed border-slate-700"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <BarChart3 size={32} className="mx-auto mb-3 text-slate-500" />
                                <p>No visit data available yet.</p>
                                <p className="text-sm text-slate-500 mt-2">
                                    Data will appear after your links receive visits
                                </p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
