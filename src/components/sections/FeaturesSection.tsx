'use client';

import { Globe, Server, Shield, Users, BarChart3, Code } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturesSection() {
  // More advanced animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const featureHover = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.03,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  const iconAnimation = {
    rest: { scale: 1 },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
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

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Feature 1 */}
          <motion.div
            className="card p-6"
            variants={item}
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <motion.div
              className="w-12 h-12 mb-4 bg-green-500/20 rounded-lg flex items-center justify-center"
              variants={iconAnimation}
            >
              <Server size={24} className="text-green-500" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Self-Hosted</h3>
            <p className="text-slate-400">Host on your own infrastructure with your own domain for complete control over your data and branding.</p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="card p-6"
            variants={item}
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <motion.div
              className="w-12 h-12 mb-4 bg-green-500/20 rounded-lg flex items-center justify-center"
              variants={iconAnimation}
            >
              <Globe size={24} className="text-green-500" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Rich OG Metadata</h3>
            <p className="text-slate-400">Customize how your links appear when shared on social media with title, description, and image support.</p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="card p-6"
            variants={item}
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <motion.div
              className="w-12 h-12 mb-4 bg-green-500/20 rounded-lg flex items-center justify-center"
              variants={iconAnimation}
            >
              <Users size={24} className="text-green-500" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Team Management</h3>
            <p className="text-slate-400">Collaborate with your team to create and manage branded links under one platform.</p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            className="card p-6"
            variants={item}
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <motion.div
              className="w-12 h-12 mb-4 bg-green-500/20 rounded-lg flex items-center justify-center"
              variants={iconAnimation}
            >
              <BarChart3 size={24} className="text-green-500" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Analytics</h3>
            <p className="text-slate-400">Track link performance with built-in analytics to measure engagement and traffic.</p>
          </motion.div>

          {/* Feature 5 */}
          <motion.div
            className="card p-6"
            variants={item}
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <motion.div
              className="w-12 h-12 mb-4 bg-green-500/20 rounded-lg flex items-center justify-center"
              variants={iconAnimation}
            >
              <Shield size={24} className="text-green-500" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Security & Privacy</h3>
            <p className="text-slate-400">Maintain control over your data with secure authentication and privacy-focused design.</p>
          </motion.div>

          {/* Feature 6 */}
          <motion.div
            className="card p-6"
            variants={item}
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <motion.div
              className="w-12 h-12 mb-4 bg-green-500/20 rounded-lg flex items-center justify-center"
              variants={iconAnimation}
            >
              <Code size={24} className="text-green-500" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Open Source</h3>
            <p className="text-slate-400">Fully open-source codebase means complete transparency, customizability, and community support.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
