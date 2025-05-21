import { ReactNode } from "react";
import { siteConfig } from "@/lib/config";
import { motion } from "framer-motion";

type ErrorLayoutProps = {
    children: ReactNode;
    icon: ReactNode;
    title: string;
    description: string;
    iconColor?: string;
};

export default function ErrorLayout({
    children,
    icon,
    title,
    description,
    iconColor = "text-red-500"
}: ErrorLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-[#0c1120]">
            <motion.div
                className="w-full max-w-md card p-6 sm:p-8 border border-slate-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-8">
                    <motion.div
                        className="flex justify-center mb-6"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className={`w-16 h-16 bg-${iconColor.replace('text-', '')}/20 rounded-full flex items-center justify-center`}>
                            {icon}
                        </div>
                    </motion.div>
                    <motion.h1
                        className="text-2xl font-bold mb-2 text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        className="text-slate-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        {description}
                    </motion.p>
                </div>

                {children}

                <motion.p
                    className="mt-8 text-center text-sm text-slate-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    For assistance, contact us at{' '}
                    <a href={`mailto:${siteConfig.supportEmail}`} className="text-green-400 hover:text-green-300">
                        {siteConfig.supportEmail}
                    </a>
                </motion.p>
            </motion.div>
        </div>
    );
}
