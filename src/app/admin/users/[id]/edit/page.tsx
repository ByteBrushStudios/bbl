'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Mail, Key, ShieldCheck, Save, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

type UserData = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  discordId: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [params.id]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const user = await response.json();
      setUserData(user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "USER",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (passwordErrors[name]) {
      setPasswordErrors(prev => {
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!passwordData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (passwordData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (passwordData.password !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setUpdateSuccess(false);
    
    try {
      const response = await fetch(`/api/users/${params.id}`, {
        method: 'PATCH',
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
          throw new Error(data.error || 'Failed to update user');
        }
        return;
      }
      
      // Update user data with response
      setUserData(data);
      setUpdateSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating user:', error);
      setErrors({ form: error instanceof Error ? error.message : 'Failed to update user' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsResettingPassword(true);
    setPasswordResetSuccess(false);
    
    try {
      const response = await fetch(`/api/users/${params.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: passwordData.password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.details) {
          // Format Zod validation errors
          const fieldErrors: Record<string, string> = {};
          for (const error of data.details) {
            fieldErrors[error.path[0]] = error.message;
          }
          setPasswordErrors(fieldErrors);
        } else {
          throw new Error(data.error || 'Failed to reset password');
        }
        return;
      }
      
      // Clear password fields
      setPasswordData({ password: "", confirmPassword: "" });
      setPasswordResetSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setPasswordResetSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error resetting password:', error);
      setPasswordErrors({ form: error instanceof Error ? error.message : 'Failed to reset password' });
    } finally {
      setIsResettingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/admin/users" className="text-green-400 hover:text-green-300 flex items-center gap-2 mb-4">
            <ArrowLeft size={16} />
            Back to Users
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">
            <span className="gradient-text">Edit User</span>
          </h1>
        </div>
        <div className="card p-8 flex items-center justify-center h-64">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-4 sm:p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/admin/users" className="text-green-400 hover:text-green-300 flex items-center gap-2 mb-4">
            <ArrowLeft size={16} />
            Back to Users
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">
            <span className="gradient-text">User Not Found</span>
          </h1>
        </div>
        <div className="card p-8">
          <p className="text-center text-slate-400">The requested user could not be found.</p>
          <div className="mt-8 flex justify-center">
            <Link href="/admin/users" className="btn-primary">
              Return to Users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/users" className="text-green-400 hover:text-green-300 flex items-center gap-2 mb-4">
          <ArrowLeft size={16} />
          Back to Users
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold">
          <span className="gradient-text">Edit User</span>
        </h1>
      </div>
      
      {/* User details form */}
      <motion.div 
        className="card p-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-6">User Information</h2>
        
        {updateSuccess && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-300 rounded-md">
            User information updated successfully!
          </div>
        )}
        
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
                className={`w-full bg-slate-800 text-white rounded-md px-4 py-2 pl-10 border ${
                  errors.name ? 'border-red-500' : 'border-slate-700 focus:border-green-500'
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
                className={`w-full bg-slate-800 text-white rounded-md px-4 py-2 pl-10 border ${
                  errors.email ? 'border-red-500' : 'border-slate-700 focus:border-green-500'
                } focus:outline-none`}
                value={formData.email}
                onChange={handleChange}
              />
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
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
          
          {userData.discordId && (
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <img
                    src={userData.image || `https://cdn.discordapp.com/avatars/${userData.discordId}/avatar.png`}
                    alt={userData.name || 'User'}
                    className="w-10 h-10 rounded-full bg-slate-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/bytebrush/logo.png";
                    }}
                  />
                </div>
                <div>
                  <p className="text-blue-300 font-medium">Discord Account Linked</p>
                  <p className="text-sm text-slate-400">Discord ID: {userData.discordId}</p>
                </div>
              </div>
            </div>
          )}
          
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
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
      
      {/* Reset Password Form */}
      <motion.div 
        className="card p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold mb-6">Reset Password</h2>
        
        {passwordResetSuccess && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-300 rounded-md">
            Password has been reset successfully!
          </div>
        )}
        
        {passwordErrors.form && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-md">
            {passwordErrors.form}
          </div>
        )}
        
        <form onSubmit={handlePasswordReset} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 8 characters"
                className={`w-full bg-slate-800 text-white rounded-md px-4 py-2 pl-10 border ${
                  passwordErrors.password ? 'border-red-500' : 'border-slate-700 focus:border-green-500'
                } focus:outline-none`}
                value={passwordData.password}
                onChange={handlePasswordChange}
              />
              <Key size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            </div>
            {passwordErrors.password && <p className="mt-1 text-sm text-red-400">{passwordErrors.password}</p>}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                className={`w-full bg-slate-800 text-white rounded-md px-4 py-2 pl-10 border ${
                  passwordErrors.confirmPassword ? 'border-red-500' : 'border-slate-700 focus:border-green-500'
                } focus:outline-none`}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
              <Key size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            </div>
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{passwordErrors.confirmPassword}</p>
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isResettingPassword}
              className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
            >
              {isResettingPassword ? (
                <>
                  <span className="loader-sm mr-2"></span>
                  Resetting...
                </>
              ) : (
                <>
                  <RefreshCw size={16} className="mr-2" />
                  Reset Password
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
