'use client';

import { ReactNode, useState, useEffect } from "react";
import { FileText } from "lucide-react";
import Image from "next/image";

type AuthLayoutProps = {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    icon?: ReactNode;
};

export default function AuthLayout({
    children,
    title,
    subtitle = "Sign in to continue",
    icon,
}: AuthLayoutProps) {
    const [siteName, setSiteName] = useState("ByteBrush Links");

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch('/api/settings');
                if (response.ok) {
                    const data = await response.json();
                    setSiteName(data.siteName || "ByteBrush Links");
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        }

        fetchSettings();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <div className="w-full max-w-md p-8 border card border-slate-800">
                <div className="mb-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20">
                            {icon || <FileText size={32} className="text-green-500" />}
                        </div>
                    </div>
                    <h1 className="mb-2 text-3xl font-bold">
                        <span className="gradient-text">{title || siteName}</span>
                    </h1>
                    <p className="mt-2 text-slate-400">{subtitle}</p>
                </div>

                {children}
            </div>
        </div>
    );
}
