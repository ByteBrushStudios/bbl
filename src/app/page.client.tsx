'use client';

import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { FileText, Globe, LayoutDashboard, Link2, Laptop, Menu, X, Github, Server, Shield, Users, BarChart3, Paintbrush, Code, Download, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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
        
        {/* Desktop Navigation */}        <motion.nav 
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
        >          <nav className="flex flex-col gap-3">
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
              href="https://github.com/ByteBrushStudios/bbl" 
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

export default function HomePage({ session, isAdmin }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isAdmin={isAdmin} session={session} />

      <main className="flex-1">        {/* Hero Section */}
        <div className="py-12 md:py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div 
              className="flex justify-center mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >              <div className="flex px-3 py-1 rounded-full bg-slate-800 text-green-400 text-sm font-medium items-center gap-1">
                <Github size={14} /> 
                Open Source Link Management
              </div>
            </motion.div>
            
            <motion.h2 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="gradient-text">Self-Hosted Link Management</span><br className="hidden sm:block" /> 
              Platform
            </motion.h2>
            
            <motion.p 
              className="text-lg md:text-xl mb-8 md:mb-12 text-slate-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Take control of your brand with ByteBrush Links - create and manage branded short links with your own domain, 
              complete with custom metadata for rich social media previews.
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
                <a 
                  href="https://github.com/ByteBrushStudios/bbl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-lg px-6 py-3 flex items-center gap-2"
                >
                  <Github size={18} />
                  Star on GitHub
                </a>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-12 md:mt-16 max-w-4xl mx-auto p-4 sm:p-6 rounded-lg bg-slate-800/30 border border-slate-700 overflow-x-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="code-block text-left">
                <div className="mb-1 text-slate-400">// Creating a branded link with ByteBrush Links</div>
                <div className="text-green-400">function</div> <span className="text-blue-400">createBrandedLink</span>() {'{'}
                <div className="pl-4 text-slate-300">
                  <span className="text-orange-300">const</span> link = {'{'}
                </div>
                <div className="pl-8">
                  <div><span className="text-purple-400">slug</span>: <span className="text-green-300">"launch"</span>,</div>
                  <div><span className="text-purple-400">targetUrl</span>: <span className="text-green-300">"https://example.com/launch-landing-page"</span>,</div>
                  <div><span className="text-purple-400">metadata</span>: {'{'}</div>
                  <div className="pl-4"><span className="text-purple-400">title</span>: <span className="text-green-300">"New Product Launch"</span>,</div>
                  <div className="pl-4"><span className="text-purple-400">description</span>: <span className="text-green-300">"Join us for our exclusive product launch event"</span>,</div>
                  <div className="pl-4"><span className="text-purple-400">image</span>: <span className="text-green-300">"https://example.com/images/launch.jpg"</span></div>
                  <div>{'}'}</div>
                </div>
                <div className="pl-4">{'}'}</div>
                <div className="pl-4"><span className="text-yellow-400">return</span> <span className="text-green-300">"https://links.yourbrand.com/launch"</span>;</div>
                {'}'}
              </div>
            </motion.div>
            
            <motion.p 
              className="mt-6 text-lg text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Self-hosted. Open Source. Your Brand.
            </motion.p>
          </div>
        </div>
          {/* Features Section */}
        <div id="features" className="py-16 md:py-20 px-4 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-12 md:mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                <span className="gradient-text">Key Features</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-300">Everything your team needs for branded link management</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Feature 1 */}
              <motion.div 
                className="card p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 mb-4 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Server size={24} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Self-Hosted</h3>
                <p className="text-slate-400">Host on your own infrastructure with your own domain for complete control over your data and branding.</p>
              </motion.div>
              
              {/* Feature 2 */}
              <motion.div 
                className="card p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 mb-4 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Globe size={24} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Rich OG Metadata</h3>
                <p className="text-slate-400">Customize how your links appear when shared on social media with title, description, and image support.</p>
              </motion.div>
              
              {/* Feature 3 */}
              <motion.div 
                className="card p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 mb-4 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Team Management</h3>
                <p className="text-slate-400">Collaborate with your team to create and manage branded links under one platform.</p>
              </motion.div>
              
              {/* Feature 4 */}
              <motion.div 
                className="card p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 mb-4 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 size={24} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Analytics</h3>
                <p className="text-slate-400">Track link performance with built-in analytics to measure engagement and traffic.</p>
              </motion.div>
              
              {/* Feature 5 */}
              <motion.div 
                className="card p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 mb-4 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Shield size={24} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Security & Privacy</h3>
                <p className="text-slate-400">Maintain control over your data with secure authentication and privacy-focused design.</p>
              </motion.div>
              
              {/* Feature 6 */}
              <motion.div 
                className="card p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 mb-4 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Code size={24} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Open Source</h3>
                <p className="text-slate-400">Fully open-source codebase means complete transparency, customizability, and community support.</p>
              </motion.div>
            </div>
          </div>
        </div>        {/* How It Works Section */}
        <div id="how-it-works" className="py-16 md:py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-12 md:mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                <span className="gradient-text">How It Works</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-300">Your own branded links management platform in minutes</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Step 1 */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="absolute top-0 left-6 w-px h-full bg-green-500/30 -z-10 md:block hidden"></div>
                <div className="flex mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 z-10">
                    <Download size={20} className="text-green-500" />
                  </div>
                  <div className="ml-4 flex items-center">
                    <span className="text-2xl font-bold text-green-400">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 ml-16">Host & Deploy</h3>
                <p className="text-slate-400 ml-16">
                  Clone the open-source repository, configure with your domain, and deploy to your preferred hosting provider.
                </p>
              </motion.div>
              
              {/* Step 2 */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="absolute top-0 left-6 w-px h-full bg-green-500/30 -z-10 md:block hidden"></div>
                <div className="flex mb-4">                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 z-10">
                    <Paintbrush size={20} className="text-green-500" />
                  </div>
                  <div className="ml-4 flex items-center">
                    <span className="text-2xl font-bold text-green-400">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 ml-16">Customize</h3>
                <p className="text-slate-400 ml-16">
                  Configure your branding, invite team members, and adapt the platform to your organization's needs.
                </p>
              </motion.div>
              
              {/* Step 3 */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 z-10">
                    <Bookmark size={20} className="text-green-500" />
                  </div>
                  <div className="ml-4 flex items-center">
                    <span className="text-2xl font-bold text-green-400">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 ml-16">Create & Share</h3>
                <p className="text-slate-400 ml-16">
                  Create branded links with rich metadata, share them, and track performance with built-in analytics.
                </p>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a 
                  href="https://github.com/ByteBrushStudios/bbl"
                  target="_blank"
                  rel="noopener noreferrer"  
                  className="btn-primary px-6 py-3 text-lg inline-flex items-center gap-2"
                >
                  <Github size={18} />
                  Get Started on GitHub
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Open Source Callout */}
        <div className="py-16 px-4 bg-slate-900/50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card p-8 border border-green-500/20"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                <span className="gradient-text">Open Source & Community-Driven</span>
              </h2>
              <p className="text-lg text-slate-300 mb-6">
                ByteBrush Links is 100% open source under the MIT license. Contributions, feature requests,
                and feedback from the community are always welcome.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a 
                    href={siteConfig.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary px-5 py-2 inline-flex items-center gap-2"
                  >
                    <Github size={18} />
                    View on GitHub
                  </a>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a 
                    href={siteConfig.discordServer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary px-5 py-2"
                  >
                    Join our Discord
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}