'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusCircle, Edit, Trash2, Search, UserCircle } from "lucide-react";
import { motion } from "framer-motion";

type User = {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    discordId: string | null;
    createdAt: string;
    updatedAt: string;
};

type PaginationInfo = {
    total: number;
    page: number;
    limit: number;
    pages: number;
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        page: 1,
        limit: 10,
        pages: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const router = useRouter();

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, searchQuery, selectedRole]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("page", pagination.page.toString());
            params.append("limit", pagination.limit.toString());

            if (searchQuery) {
                params.append("search", searchQuery);
            }

            if (selectedRole) {
                params.append("role", selectedRole);
            }

            const response = await fetch(`/api/users?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch users');

            const data = await response.json();
            setUsers(data.users);
            setPagination(data.pagination);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when searching
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRole(e.target.value);
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filtering
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete user');
            }

            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error("Error deleting user:", error);
            alert(error instanceof Error ? error.message : 'Failed to delete user');
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'SUPERADMIN':
                return 'bg-purple-500';
            case 'ADMIN':
                return 'bg-green-500';
            default:
                return 'bg-blue-500';
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= pagination.pages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    if (isLoading && users.length === 0) {
        return (
            <div className="p-4 sm:p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        <span className="gradient-text">User Management</span>
                    </h1>
                </div>
                <div className="h-96 flex items-center justify-center">
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold">
                    <span className="gradient-text">User Management</span>
                </h1>

                <Link href="/admin/users/create" className="btn-primary flex items-center gap-2">
                    <PlusCircle size={18} />
                    Add New User
                </Link>
            </div>

            {/* Search and filters */}
            <div className="card p-6 mb-8">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label htmlFor="search" className="block text-sm font-medium text-slate-400 mb-2">
                            Search Users
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="search"
                                placeholder="Search by name or email"
                                className="w-full bg-slate-800 text-white rounded-md px-4 py-2 pl-10 border border-slate-700 focus:outline-none focus:border-green-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    <div className="min-w-[150px]">
                        <label htmlFor="role" className="block text-sm font-medium text-slate-400 mb-2">
                            Filter by Role
                        </label>
                        <select
                            id="role"
                            className="w-full bg-slate-800 text-white rounded-md px-4 py-2 border border-slate-700 focus:outline-none focus:border-green-500"
                            value={selectedRole}
                            onChange={handleRoleChange}
                        >
                            <option value="">All Roles</option>
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                            <option value="SUPERADMIN">Super Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all duration-300"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Users list */}
            <motion.div
                className="card p-0 overflow-hidden"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-800 border-b border-slate-700">
                                <th className="text-left py-4 px-6 text-slate-400 font-medium">User</th>
                                <th className="text-left py-4 px-6 text-slate-400 font-medium hidden md:table-cell">Email</th>
                                <th className="text-left py-4 px-6 text-slate-400 font-medium">Role</th>
                                <th className="text-left py-4 px-6 text-slate-400 font-medium hidden md:table-cell">Created</th>
                                <th className="text-right py-4 px-6 text-slate-400 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        className="hover:bg-slate-800/70 transition-colors"
                                        variants={item}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                {user.discordId ? (
                                                    <img
                                                        src={user.image || `https://cdn.discordapp.com/avatars/${user.discordId}/avatar.png`}
                                                        alt={user.name || 'User'}
                                                        className="w-8 h-8 rounded-full bg-slate-700"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = "/bytebrush/logo.png";
                                                        }}
                                                    />
                                                ) : (
                                                    <UserCircle size={24} className="text-slate-400" />
                                                )}
                                                <span className="font-medium text-white">{user.name || 'Unnamed User'}</span>
                                                {user.discordId && (
                                                    <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">Discord</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-slate-300 hidden md:table-cell">{user.email}</td>
                                        <td className="py-4 px-6">
                                            <span className={`${getRoleBadgeColor(user.role)}/20 text-xs px-2 py-1 rounded-full capitalize`}>
                                                {user.role === 'SUPERADMIN' ? 'Super Admin' : user.role === 'ADMIN' ? 'Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-slate-400 text-sm hidden md:table-cell">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-right space-x-2">
                                            <button
                                                onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                                                className="p-2 text-slate-300 hover:text-green-400 transition-colors"
                                                title="Edit User"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-2 text-slate-300 hover:text-red-400 transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-400">
                                        No users found. Try adjusting your search criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex justify-between items-center p-4 border-t border-slate-700">
                        <div className="text-sm text-slate-400">
                            Showing {Math.min(pagination.total, (pagination.page - 1) * pagination.limit + 1)} - {Math.min(pagination.total, pagination.page * pagination.limit)} of {pagination.total} users
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="px-3 py-1 bg-slate-800 rounded border border-slate-700 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                                .filter(page =>
                                    page === 1 ||
                                    page === pagination.pages ||
                                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                                )
                                .map((page, i, array) => (
                                    <React.Fragment key={page}>
                                        {i > 0 && array[i - 1] !== page - 1 && (
                                            <span className="px-3 py-1">...</span>
                                        )}
                                        <button
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 rounded border ${pagination.page === page
                                                    ? 'bg-green-500 border-green-600 text-white'
                                                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    </React.Fragment>
                                ))}
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.pages}
                                className="px-3 py-1 bg-slate-800 rounded border border-slate-700 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
