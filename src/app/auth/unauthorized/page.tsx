'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import ErrorLayout from '@/components/layouts/error/ErrorLayout';

export default function UnauthorizedPage() {
    return (
        <ErrorLayout
            icon={<AlertTriangle size={32} className="text-amber-500" />}
            title="Access Restricted"
            description="You don't have permission to access the admin dashboard. Only authorized administrators can access this area."
            iconColor="text-amber-500"
        >
            <div className="flex flex-col gap-4 mt-6">
                <Link
                    href="/"
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 text-slate-200 py-3 px-4 rounded-md hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>

                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center justify-center gap-2 bg-red-900/30 text-red-300 py-3 px-4 rounded-md hover:bg-red-900/50 transition-colors"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </ErrorLayout>
    );
}
