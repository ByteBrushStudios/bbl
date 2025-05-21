'use client';

import { FileText, Heart, Github, Mail, MessageCircle } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { siteConfig } from "@/lib/config";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-8 mt-auto border-t bg-slate-900/60 border-slate-800 backdrop-blur-sm">
            <div className="px-4 mx-auto max-w-7xl sm:px-6">
                <div className="flex flex-col items-center justify-between md:flex-row">
                    <motion.div
                        className="flex items-center gap-2 mb-4 md:mb-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center justify-center w-8 h-8 text-green-500 rounded-md bg-green-500/10">
                            <Image src="/bytebrush/logo.png" alt="Logo" width={32} height={32} className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="flex items-center text-sm text-slate-400">
                                © {currentYear} ByteBrush Studios. All rights reserved.
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Made with <Heart size={12} className="inline mx-1 text-green-500" /> by <Link href="https://codemeapixel.dev" className="text-green-400 transition-colors hover:text-green-500" target="_blank">Pixelated</Link>.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex gap-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Link
                            href={siteConfig.discordServer}
                            className="text-slate-400 hover:text-green-400 transition-colors relative group flex items-center gap-1.5"
                            target="_blank"
                        >
                            <FaDiscord size={16} />
                            <span>Discord</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
                        </Link>

                        <Link
                            href="https://github.com/ByteBrushStudios/bbl"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-green-400 transition-colors relative group flex items-center gap-1.5"
                            target="_blank"
                        >
                            <Github size={16} />
                            <span>GitHub</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
                        </Link>

                        <Link
                            href={`mailto:${siteConfig.supportEmail}`}
                            className="text-slate-400 hover:text-green-400 transition-colors relative group flex items-center gap-1.5"
                        >
                            <Mail size={16} />
                            <span>Support</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
}
