'use client';

import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { FileText, Globe, LayoutDashboard, Link2, Laptop, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

function Header({ isAdmin, session }) {
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
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/api/auth/signout" 
                  className="btn-secondary"
                >
                  Sign Out
                </Link>
              </motion.div>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                )}
                <Link 
                  href="/api/auth/signout" 
                  className="btn-secondary mt-2 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <Link 
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

function HomeContent({ isAdmin }) {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-3 py-1 rounded-full bg-slate-800 text-green-400 text-sm font-medium">
              ByteBrush Studios
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="gradient-text">Shortening URLs</span> with<br className="hidden sm:block" />Purpose
          </motion.h2>
          
          <motion.p 
            className="text-lg sm:text-xl mb-8 sm:mb-12 text-slate-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Create and manage custom short links with full Open Graph (OG) preview support for better social media sharing experiences.
          </motion.p>

          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {isAdmin ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/admin/links/create" 
                  className="btn-primary text-lg px-6 py-3"
                >
                  Create a New Link
                </Link>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/api/auth/signin" 
                  className="btn-primary text-lg px-6 py-3"
                >
                  Get Started
                </Link>
              </motion.div>
            )}
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="#features" 
                className="btn-secondary text-lg px-6 py-3"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-12 sm:mt-16 max-w-4xl mx-auto p-4 sm:p-6 rounded-lg bg-slate-800/30 border border-slate-700 overflow-x-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="code-block text-xs sm:text-sm">
              <div className="mb-1 text-slate-400">// Creating a link with ByteBrush Links</div>
              <div className="text-green-400">function</div> <span className="text-blue-400">createShortLink</span>() {'{'}
              <div className="pl-4 text-slate-300">
                <span className="text-orange-300">const</span> link = {'{'}
              </div>
              <div className="pl-8">
                <div><span className="text-purple-400">slug</span>: <span className="text-green-300">"product"</span>,</div>
                <div><span className="text-purple-400">url</span>: <span className="text-green-300">"https://example.com/my-amazing-product-page"</span>,</div>
                <div><span className="text-purple-400">title</span>: <span className="text-green-300">"Amazing Product"</span>,</div>
                <div><span className="text-purple-400">description</span>: <span className="text-green-300">"Check out our new product!"</span></div>
              </div>
              <div className="pl-4">{'}'}</div>
              <div className="pl-4"><span className="text-yellow-400">return</span> <span className="text-green-300">"https://aka.bytebrush.dev/product"</span>;</div>
              {'}'}
            </div>
          </motion.div>
          
          <motion.p 
            className="mt-6 text-lg text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Simple. Powerful. Beautiful.
          </motion.p>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              <span className="gradient-text">Features</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-300">Everything you need in a modern link shortener</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <motion.div 
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 mb-4 bg-green-500/20 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Custom Short Links</h3>
              <p className="text-slate-400">Create and manage short links with custom slugs for easy sharing and brand consistency.</p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 mb-4 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Globe size={24} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">OG Previews</h3>
              <p className="text-slate-400">Add custom metadata for better social media sharing experiences with rich previews.</p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 mb-4 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Laptop size={24} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Admin Dashboard</h3>
              <p className="text-slate-400">View link statistics and manage links through an intuitive admin interface.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

export { Header, HomeContent };
