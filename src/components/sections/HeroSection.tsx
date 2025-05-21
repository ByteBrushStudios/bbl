'use client';

import Link from "next/link";
import { ArrowRight, Github, ExternalLink, Code } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/lib/config";
import * as Tooltip from '@radix-ui/react-tooltip';

export default function HeroSection({ isAdmin = false }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const y = useTransform(scrollY, [0, 300], [0, -100]);

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
                  href={siteConfig.githubRepo}
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
              href="https://github.com/ByteBrushStudios/bbl"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 text-lg btn-secondary"
            >
              <Github size={18} />
              Star on GitHub
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="max-w-4xl p-4 mx-auto mt-12 overflow-x-auto border rounded-lg md:mt-16 sm:p-6 bg-slate-800/30 border-slate-700 glass-panel"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-xs text-slate-400">bytebrush-links.js</div>
          </div>
          <div className="text-left code-block">
            <div className="mb-2 text-slate-400 flex items-center gap-1.5">
              <Code size={14} />
              <span>// Creating a branded link with ByteBrush Links</span>
            </div>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={item} className="text-green-400">function</motion.div> <motion.span variants={item} className="text-blue-400">createBrandedLink</motion.span>() {'{'
              }
              <motion.div variants={item} className="pl-4 text-slate-300">
                <span className="text-orange-300">const</span> link = {'{'}
              </motion.div>
              <motion.div variants={item} className="pl-8">
                <div><span className="text-purple-400">slug</span>: <span className="text-green-300">"launch"</span>,</div>
                <div><span className="text-purple-400">targetUrl</span>: <span className="text-green-300">"https://example.com/launch-landing-page"</span>,</div>
                <div><span className="text-purple-400">metadata</span>: {'{'}</div>
                <div className="pl-4"><span className="text-purple-400">title</span>: <span className="text-green-300">"New Product Launch"</span>,</div>
                <div className="pl-4"><span className="text-purple-400">description</span>: <span className="text-green-300">"Join us for our exclusive product launch event"</span>,</div>
                <div className="pl-4"><span className="text-purple-400">image</span>: <span className="text-green-300">"https://example.com/images/launch.jpg"</span></div>
                <div>{'}'}</div>
              </motion.div>
              <motion.div variants={item} className="pl-4">{'}'}</motion.div>
              <motion.div variants={item} className="pl-4"><span className="text-yellow-400">return</span> <span className="text-green-300">"https://links.yourbrand.com/launch"</span>;</motion.div>
              <motion.div variants={item}>{'}'}
              </motion.div>
            </motion.div>
          </div>
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
