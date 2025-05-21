'use client';

import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { FileText, LayoutDashboard, Menu, X, Github } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface HeaderProps {
  isAdmin: boolean;
  session: any;
}

export default function Header({ isAdmin, session }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="py-6 px-4 border-b border-slate-800 relative z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-10 h-10 mr-3 bg-green-500/20 rounded-full flex items-center justify-center">
            <FileText size={20} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold">{siteConfig.siteName}</h1>
        </motion.div>
        
        {/* Desktop Navigation */}
        <motion.nav 
          className="hidden md:flex gap-4 items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link href="/" className="nav-link">Home</Link>
          <Link href="#features" className="nav-link">Features</Link>
          <Link href="#how-it-works" className="nav-link">How It Works</Link>
          <a 
            href={siteConfig.githubRepo} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="nav-link flex items-center gap-1"
          >
            <Github size={16} />
            GitHub
          </a>
          
          {session ? (
            <>
              {isAdmin && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    href="/admin" 
                    className="btn-secondary flex items-center gap-2"
                  >
                    <LayoutDashboard size={16} />
                    Admin Dashboard
                  </Link>
                </motion.div>
              )}              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/api/auth/signout" 
                  className="btn-secondary"
                >
                  Sign Out
                </Link>
              </motion.div>
            </>
          ) : (            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/api/auth/signin" 
                className="btn-primary"
              >
                Sign In
              </Link>
            </motion.div>
          )}
        </motion.nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          className="absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 p-4 md:hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <nav className="flex flex-col gap-3">
            <Link 
              href="/" 
              className="nav-link py-2" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="#features" 
              className="nav-link py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="nav-link py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <a 
              href={siteConfig.githubRepo} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link py-2 flex items-center gap-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Github size={16} />
              GitHub
            </a>
            
            {session ? (
              <>
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="btn-secondary flex items-center justify-center gap-2 mt-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard size={16} />
                    Admin Dashboard
                  </Link>
                )}                <Link 
                  href="/api/auth/signout" 
                  className="btn-secondary mt-2 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Out
                </Link>
              </>
            ) : (              <Link 
                href="/api/auth/signin" 
                className="btn-primary mt-2 text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
