'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Github, ExternalLink, Code } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import * as Tooltip from '@radix-ui/react-tooltip';

export default function HeroSection({ isAdmin = false }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const y = useTransform(scrollY, [0, 300], [0, -100]);
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative px-4 py-12 overflow-hidden md:py-24">
      {/* Background decoration with animation */}
      <motion.div
        className="absolute inset-0 overflow-hidden -z-10"
        style={{ opacity }}
      >
        <motion.div
          className="absolute -top-[30%] -left-[10%] w-[50%] h-[70%] bg-green-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, 10, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute -bottom-[30%] -right-[10%] w-[50%] h-[70%] bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -15, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>

      <div className="max-w-5xl mx-auto text-center">
        <Tooltip.Provider>
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <a
                  href={githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-400 transition-colors rounded-full bg-slate-800 hover:bg-slate-700"
                >
                  <Github size={14} />
                  Open Source Link Management
                  <ExternalLink size={12} className="ml-1 opacity-70" />
                </a>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="p-2 text-sm text-white border rounded shadow-md bg-slate-800 border-slate-700"
                  sideOffset={5}
                >
                  View this project on GitHub
                  <Tooltip.Arrow className="fill-slate-800" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </motion.div>
        </Tooltip.Provider>

        <motion.h2
          className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="gradient-text">Self-Hosted Link Management</span><br className="hidden sm:block" />
          Platform
        </motion.h2>

        <motion.p
          className="max-w-3xl mx-auto mb-8 text-lg leading-relaxed md:text-xl md:mb-12 text-slate-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Take control of your brand with ByteBrush Links create and manage branded short links
          with your own domain, complete with custom metadata for rich social media previews.
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
                className="flex items-center gap-2 px-6 py-3 text-lg btn-primary"
              >
                Create a New Link
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="https://github.com/new?template_name=bbl&template_owner=ByteBrushStudios"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 text-lg btn-primary"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          )}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a
              href={githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 text-lg btn-secondary"
            >
              <Github size={18} />
              Star on GitHub
            </a>
          </motion.div>
        </motion.div>

        <motion.p
          className="flex items-center justify-center gap-2 mt-8 text-lg text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className="w-16 h-px bg-gradient-to-r from-transparent to-slate-500"></span>
          Self-hosted. Open Source. Your Brand.
          <span className="w-16 h-px bg-gradient-to-l from-transparent to-slate-500"></span>
        </motion.p>
      </div>
    </section>
  );
}
