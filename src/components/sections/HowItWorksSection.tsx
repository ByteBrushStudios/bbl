'use client';

import { useState, useEffect } from "react";
import { Download, Paintbrush, Bookmark } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github } from "lucide-react";

export default function HowItWorksSection() {
  const { scrollYProgress } = useScroll();
  const [githubRepo, setGithubRepo] = useState('https://github.com/ByteBrushStudios/bbl');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.githubRepo) {
            setGithubRepo(data.githubRepo);
          }
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    }

    fetchSettings();
  }, []);

  // Animation for the vertical line connecting steps
  const lineHeight = useTransform(scrollYProgress, [0.5, 0.8], ["0%", "100%"]);

  // Variants for staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const iconContainer = {
    rest: {
      scale: 1,
      backgroundColor: "rgba(34, 197, 94, 0.2)"
    },
    hover: {
      scale: 1.1,
      backgroundColor: "rgba(34, 197, 94, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  const iconAnimation = {
    rest: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.2,
      rotate: 10,
      transition: { type: "spring", stiffness: 400 }
    }
  };

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

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Step 1 */}
          <motion.div
            className="relative"
            variants={item}
          >
            <div className="absolute top-0 left-6 w-px h-full bg-green-500/30 -z-10 md:block hidden">
              <motion.div
                className="h-0 w-full bg-green-500"
                style={{ height: lineHeight }}
              />
            </div>

            <motion.div
              className="flex mb-4"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              <motion.div
                className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 z-10"
                variants={iconContainer}
              >
                <motion.div variants={iconAnimation}>
                  <Download size={20} className="text-green-500" />
                </motion.div>
              </motion.div>
              <div className="ml-4 flex items-center">
                <motion.span
                  className="text-2xl font-bold text-green-400"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  1
                </motion.span>
              </div>
            </motion.div>

            <h3 className="text-xl font-bold mb-2 ml-16">Host & Deploy</h3>
            <p className="text-slate-400 ml-16">
              Clone the open-source repository, configure with your domain, and deploy to your preferred hosting provider.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            className="relative"
            variants={item}
          >
            <div className="absolute top-0 left-6 w-px h-full bg-green-500/30 -z-10 md:block hidden">
              <motion.div
                className="h-0 w-full bg-green-500"
                style={{ height: lineHeight }}
              />
            </div>

            <motion.div
              className="flex mb-4"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              <motion.div
                className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 z-10"
                variants={iconContainer}
              >
                <motion.div variants={iconAnimation}>
                  <Paintbrush size={20} className="text-green-500" />
                </motion.div>
              </motion.div>
              <div className="ml-4 flex items-center">
                <motion.span
                  className="text-2xl font-bold text-green-400"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  2
                </motion.span>
              </div>
            </motion.div>

            <h3 className="text-xl font-bold mb-2 ml-16">Customize</h3>
            <p className="text-slate-400 ml-16">
              Configure your branding, invite team members, and adapt the platform to your organization's needs.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            className="relative"
            variants={item}
          >
            <motion.div
              className="flex mb-4"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              <motion.div
                className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 z-10"
                variants={iconContainer}
              >
                <motion.div variants={iconAnimation}>
                  <Bookmark size={20} className="text-green-500" />
                </motion.div>
              </motion.div>
              <div className="ml-4 flex items-center">
                <motion.span
                  className="text-2xl font-bold text-green-400"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  3
                </motion.span>
              </div>
            </motion.div>

            <h3 className="text-xl font-bold mb-2 ml-16">Create & Share</h3>
            <p className="text-slate-400 ml-16">
              Create branded links with rich metadata, share them, and track performance with built-in analytics.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <a
              href={githubRepo}
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
