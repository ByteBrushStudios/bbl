'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertCircle, CheckCircle, Info, AlertTriangle, X
} from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: ToastType, duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
    useEffect(() => {
        if (toast.duration) {
            const timer = setTimeout(() => {
                onClose(toast.id);
            }, toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast, onClose]);

    const bgColor = {
        success: 'bg-green-500/90 border-green-600',
        error: 'bg-red-500/90 border-red-600',
        info: 'bg-blue-500/90 border-blue-600',
        warning: 'bg-amber-500/90 border-amber-600',
    };

    const Icon = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info,
        warning: AlertTriangle,
    }[toast.type];

    return (
        <motion.div
            className={`p-4 rounded-md shadow-lg flex items-center gap-3 min-w-[300px] max-w-md text-white border ${bgColor[toast.type]} backdrop-blur-sm`}
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            transition={{ duration: 0.2 }}
        >
            <Icon size={18} className="flex-shrink-0" />
            <span className="flex-grow text-sm">{toast.message}</span>
            <button onClick={() => onClose(toast.id)} className="text-white/80 hover:text-white">
                <X size={16} />
            </button>
        </motion.div>
    );
}

// Convenience functions
export const toast = {
    success: (message: string, duration?: number) => {
        const context = useContext(ToastContext);
        if (context) {
            context.addToast(message, 'success', duration);
        }
    },
    error: (message: string, duration?: number) => {
        const context = useContext(ToastContext);
        if (context) {
            context.addToast(message, 'error', duration);
        }
    },
    info: (message: string, duration?: number) => {
        const context = useContext(ToastContext);
        if (context) {
            context.addToast(message, 'info', duration);
        }
    },
    warning: (message: string, duration?: number) => {
        const context = useContext(ToastContext);
        if (context) {
            context.addToast(message, 'warning', duration);
        }
    },
};
