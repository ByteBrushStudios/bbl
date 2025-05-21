'use client';

import { Download, Paintbrush, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";
import { Github } from "lucide-react";

export default function HowItWorksSection() {
  return (
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
            <div className="flex mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 z-10">
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
              href={siteConfig.githubRepo}
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
  );
}
