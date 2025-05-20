'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid, 
  Link2, 
  PlusCircle, 
  LogOut, 
  ArrowLeft, 
  Menu, 
  X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);
  
  // Close sidebar when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="flex min-h-screen relative">
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900/90 rounded-md text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Sidebar - Desktop always visible, Mobile as overlay */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside 
            className={`${isSidebarOpen ? 'fixed inset-0 z-40 w-64' : 'hidden lg:block w-64'} bg-slate-900/90 border-r border-slate-800 text-white p-6`}
            initial={{ x: isSidebarOpen ? -300 : 0 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="mb-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 relative flex items-center justify-center bg-green-500/20 rounded-md">
                  <span className="text-green-500 font-bold">BB</span>
                </div>
                <h1 className="text-xl font-bold">Admin</h1>
              </Link>
            </div>
            
            <nav className="space-y-2">
              <Link 
                href="/admin" 
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${pathname === '/admin' ? 'bg-green-500/20 text-green-400' : 'hover:bg-slate-800 hover:text-green-400'}`}
              >
                <LayoutGrid size={18} />
                Dashboard
              </Link>
              
              <Link 
                href="/admin/links" 
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${pathname === '/admin/links' ? 'bg-green-500/20 text-green-400' : 'hover:bg-slate-800 hover:text-green-400'}`}
              >
                <Link2 size={18} />
                Manage Links
              </Link>
              
              <Link 
                href="/admin/links/create" 
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${pathname === '/admin/links/create' ? 'bg-green-500/20 text-green-400' : 'hover:bg-slate-800 hover:text-green-400'}`}
              >
                <PlusCircle size={18} />
                Create Link
              </Link>
            </nav>
        
                    <div className="mt-auto pt-8 border-t border-slate-800">
              <Link 
                href="/" 
                className="flex items-center gap-3 px-4 py-2 text-sm rounded-md text-slate-400 hover:bg-slate-800 hover:text-green-400 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Site
              </Link>
              <Link 
                href="/api/auth/signout" 
                className="flex items-center gap-3 px-4 py-2 text-sm rounded-md text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Main content */}
      <main className="flex-1 bg-[#0c1120] overflow-x-hidden">
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
          <div className="flex justify-end mb-4 mt-10 lg:mt-0">
            <motion.div 
              className="flex items-center gap-2 bg-slate-900/70 border border-slate-800 rounded-full px-3 py-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs text-white font-bold">
                A
              </div>
              <span className="text-sm text-slate-300">Admin</span>
            </motion.div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
