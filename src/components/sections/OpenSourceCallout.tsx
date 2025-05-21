'use client';

import { Github } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";

export default function OpenSourceCallout() {
  return (
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
  );
}
