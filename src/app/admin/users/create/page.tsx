'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Mail, Key, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function CreateUserPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/users/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.details) {
                    // Format Zod validation errors
                    const fieldErrors: Record<string, string> = {};
                    for (const error of data.details) {
                        fieldErrors[error.path[0]] = error.message;
                    }
                    setErrors(fieldErrors);
                } else {
                    throw new Error(data.error || 'Failed to create user');
                }
                return;
            }

            // Success - redirect to users list
            router.push('/admin/users');
            router.refresh();
        } catch (error) {
            console.error('Error creating user:', error);
            setErrors({ form: error instanceof Error ? error.message : 'Failed to create user' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-3xl mx-auto">
            <div className="mb-8">
                <Link href="/admin/users" className="text-green-400 hover:text-green-300 flex items-center gap-2 mb-4">
                    <ArrowLeft size={16} />
                    Back to Users
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold">
                    <span className="gradient-text">Create New User</span>
                </h1>
            </div>

            <motion.div
                className="card p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {errors.form && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-md">
                        {errors.form}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                className={`w-full bg-slate-800 text-white rounded-md px-4 py-2 pl-10 border ${errors.name ? 'border-red-500' : 'border-slate-700 focus:border-green-500'
                                    } focus:outline-none`}
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        </div>
                        {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john.doe@example.com"
                                className={`w-full bg-slate-800 text-white rounded-md px-4 py-2 pl-10 border ${errors.email ? 'border-red-500' : 'border-slate-700 focus:border-green-500'
                                    } focus:outline-none`}
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        </div>
                        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Minimum 8 characters"
                                className={`w-full bg-slate-800 text-white rounded-md px-4 py-2 pl-10 border ${errors.password ? 'border-red-500' : 'border-slate-700 focus:border-green-500'
                                    } focus:outline-none`}
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <Key size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">
                            User Role
                        </label>
                        <div className="relative">
                            <select
                                id="role"
                                name="role"
                                className="w-full bg-slate-800 text-white rounded-md px-4 py-2 pl-10 border border-slate-700 focus:outline-none focus:border-green-500"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="USER">Regular User</option>
                                <option value="ADMIN">Admin</option>
                                <option value="SUPERADMIN">Super Admin</option>
                            </select>
                            <ShieldCheck size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Regular users can access the site. Admins can manage links. Super Admins have full control including user management.
                        </p>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link
                            href="/admin/users"
                            className="px-4 py-2 rounded-md bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loader-sm mr-2"></span>
                                    Creating...
                                </>
                            ) : (
                                'Create User'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
