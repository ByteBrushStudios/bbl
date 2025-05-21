'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import ErrorLayout from '@/components/layouts/error/ErrorLayout';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <ErrorLayout
            icon={<AlertCircle size={32} className="text-red-500" />}
            title="Something went wrong"
            description="We've encountered an unexpected error. Please try again or contact support."
            iconColor="text-red-500"
        >
            <div className="flex flex-col gap-4 mt-6">
                <motion.button
                    className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors"
                    onClick={() => reset()}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <RefreshCw size={18} />
                    Try Again
                </motion.button>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                        href="/"
                        className="w-full flex items-center justify-center gap-2 bg-slate-800 text-slate-200 py-3 px-4 rounded-md hover:bg-slate-700 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        </ErrorLayout>
    );
}
