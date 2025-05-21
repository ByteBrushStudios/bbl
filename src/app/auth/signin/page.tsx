'use client';

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, LogIn, Eye, EyeOff, Mail, Lock, Info as InfoIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "@/components/layouts/auth/AuthLayout";
import Image from "next/image";
import { useSettings } from "@/hooks/useSettings";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { settings, loading } = useSettings();

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false
            });

            if (result?.error) {
                setError("Invalid email or password");
                setIsLoading(false);
                return;
            }

            if (result?.ok) {
                router.push('/admin');
                router.refresh();
            }
        } catch (error) {
            setError("Something went wrong, please try again");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <AuthLayout
            title={settings.siteName}
            subtitle="Sign in to continue"
            icon={<Image src={settings.logoUrl} alt="Logo" width={64} height={64} className="w-16 h-16" />}
        >
            <AnimatePresence>
                {error && (
                    <motion.div
                        className="flex items-center p-3 mb-5 text-red-400 border rounded-md bg-red-500/10 border-red-500/30"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    >
                        <Lock size={16} className="mr-2" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleEmailSignIn} className="space-y-5">
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Mail size={16} className="text-slate-500" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 pl-10 text-white transition-all border rounded-md bg-slate-900 border-slate-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Lock size={16} className="text-slate-500" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 pl-10 text-white transition-all border rounded-md bg-slate-900 border-slate-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-400"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeOff size={16} className="text-slate-500" />
                            ) : (
                                <Eye size={16} className="text-slate-500" />
                            )}
                        </button>
                    </div>
                </div>

                <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="relative flex items-center justify-center w-full gap-3 px-6 py-3 overflow-hidden text-white transition-all rounded-md bg-gradient-to-r from-green-600 to-green-500 disabled:opacity-70 disabled:pointer-events-none group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="absolute inset-0 w-full h-full transition-opacity duration-300 opacity-0 bg-gradient-to-r from-green-500 to-green-400 group-hover:opacity-100"></span>
                    <LogIn size={18} className="relative z-10" />
                    <span className="relative z-10">{isLoading ? "Signing in..." : "Sign in"}</span>
                </motion.button>
            </form>

            <div className="pt-6 mt-8 text-sm border-t border-slate-800">
                <div className="p-3 text-blue-300 border rounded-md bg-blue-500/10 border-blue-500/20">
                    <p className="flex items-start gap-2">
                        <InfoIcon size={16} className="mt-0.5 flex-shrink-0" />
                        <span>
                            <strong>Authentication Notice:</strong> Access to {settings.siteName} is restricted to {settings.company} team members with authorized email domains ({settings.allowedDomains.join(", ")}).
                        </span>
                    </p>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link href="/" className="inline-flex items-center justify-center gap-2 text-green-400 transition-colors hover:text-green-300 group">
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    <span>Back to Home</span>
                </Link>
            </div>
        </AuthLayout>
    );
}
