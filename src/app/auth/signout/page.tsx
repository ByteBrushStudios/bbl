'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { FileText } from 'lucide-react';
import AuthLayout from '@/components/layouts/auth/AuthLayout';

export default function SignOutPage() {
    const [siteName, setSiteName] = useState('ByteBrush Links');

    useEffect(() => {
        // Fetch site name from settings API
        async function fetchSettings() {
            try {
                const response = await fetch('/api/settings');
                if (response.ok) {
                    const data = await response.json();
                    setSiteName(data.siteName || 'ByteBrush Links');
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        }

        fetchSettings();

        // Trigger sign out immediately when the page loads
        signOut({ callbackUrl: '/' });
    }, []);

    return (
        <AuthLayout
            title={siteName}
            subtitle="Signing out..."
            icon={<FileText size={32} className="text-green-500" />}
        >
            <div className="mt-6 flex justify-center">
                <div className="spinner"></div>
            </div>
        </AuthLayout>
    );
}
