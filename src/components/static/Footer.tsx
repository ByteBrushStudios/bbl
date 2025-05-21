'use client';

import { FileText } from "lucide-react";
import { siteConfig } from "@/lib/config";
import Link from "next/link";

export default function Footer() {

    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto py-8 bg-slate-900 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm text-slate-400">
                            © {currentYear} ByteBrush Studios. All rights reserved.
                        </p>
                    </div>
                    <div className="flex space-x-6">
                        <Link href={siteConfig.discordServer} className="text-slate-400 hover:text-green-400" target="_blank">
                            Discord
                        </Link>
                        <Link href={`mailto:${siteConfig.supportEmail}`} className="text-slate-400 hover:text-green-400">
                            Support
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
