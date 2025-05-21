'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { FileText } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import AuthLayout from '@/components/layouts/auth/AuthLayout';

export default function SignOutPage() {
    useEffect(() => {
        // Trigger sign out immediately when the page loads
        signOut({ callbackUrl: '/' });
    }, []);

    return (
        <AuthLayout
            title={siteConfig.siteName}
            subtitle="Signing out..."
            icon={<FileText size={32} className="text-green-500" />}
        >
            <div className="mt-6 flex justify-center">
                <div className="spinner"></div>
            </div>
        </AuthLayout>
    );
}
