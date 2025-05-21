'use client';

import React from 'react';
import Link from 'next/link';
import { useSettings } from '@/components/providers/SettingsProvider';
import { motion } from 'framer-motion';

interface ErrorLayoutProps {
    title: string;
    message: string;
    code?: string | number;
    showHomeLink?: boolean;
    children?: React.ReactNode;
}

export default function ErrorLayout({
    title,
    message,
    code,
    showHomeLink = true,
    children
}: ErrorLayoutProps) {
    const settings = useSettings();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0c1120] p-4">
            <motion.div
                className="text-center max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {code && (
                    <h1 className="text-7xl font-bold text-gray-200 mb-4">
                        {code}
                    </h1>
                )}
                <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                <p className="text-gray-400 mb-6">{message}</p>

                {children}

                {showHomeLink && (
                    <Link
                        href="/"
                        className="text-green-400 hover:text-green-300 transition-colors"
                    >
                        Return to {settings.siteName} Home
                    </Link>
                )}
            </motion.div>
        </div>
    );
}
