'use client';

import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Github } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  isAdmin: boolean;
}

export default function HeroSection({ isAdmin }: HeroSectionProps) {
  return (
    <div className="py-12 md:py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div 
          className="flex justify-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex px-3 py-1 rounded-full bg-slate-800 text-green-400 text-sm font-medium items-center gap-1">
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
              href={siteConfig.githubRepo}
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
  );
}
