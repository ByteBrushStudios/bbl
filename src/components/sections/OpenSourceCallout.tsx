'use client';

import { useState, useEffect } from "react";
import { Github, ExternalLink, Discord } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function OpenSourceCallout() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0.7, 0.9], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0.7, 0.9], [0.8, 1]);
  const [discordServer, setDiscordServer] = useState('https://discord.gg/Vv2bdC44Ge');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.discordServer) {
            setDiscordServer(data.discordServer);
          }
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    }

    fetchSettings();
  }, []);

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div className="px-4 py-16 bg-slate-900/50">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          style={{ scale, opacity }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative p-8 overflow-hidden border card border-green-500/20"
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute top-0 right-0 rounded-full w-96 h-96 bg-green-500/5 blur-3xl -z-10"
            animate={{
              x: [50, 70, 50],
              y: [20, 0, 20],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />

          <motion.div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl -z-10"
            animate={{
              x: [-30, 0, -30],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />

          <motion.h2
            className="mb-4 text-2xl font-bold md:text-3xl"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="gradient-text">Open Source & Community-Driven</span>
          </motion.h2>

          <motion.p
            className="mb-6 text-lg text-slate-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            ByteBrush Links is 100% open source under the AGPL 3.0 license. Contributions, feature requests,
            and feedback from the community are always welcome.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="relative group"
            >
              <a
                href="https://github.com/ByteBrushStudios/bbl"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center gap-2 px-6 py-3 overflow-hidden text-white border rounded-md shadow-md bg-gradient-to-r from-gray-800 to-gray-900 border-slate-700"
              >
                <span className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-green-600 to-green-500 group-hover:opacity-100 -z-10"></span>
                <Github size={18} className="text-green-400 transition-colors duration-300 group-hover:text-white" />
                <span className="font-medium">View on GitHub</span>
                <ExternalLink size={14} className="transition-opacity duration-300 opacity-70 group-hover:opacity-100" />
              </a>
            </motion.div>

            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="relative group"
            >
              <a
                href={discordServer}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center gap-2 px-6 py-3 overflow-hidden text-white border rounded-md shadow-md bg-gradient-to-r from-gray-800 to-gray-900 border-slate-700"
              >
                <span className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-indigo-600 to-indigo-500 group-hover:opacity-100 -z-10"></span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-indigo-400 transition-colors duration-300 group-hover:text-white"
                >
                  <circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" />
                  <path d="M7.5 7.5c3.5-1 5.5-1 9 0" />
                  <path d="M7 16.5c3.5 1 6.5 1 10 0" />
                  <path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2.833-1.667 3.5-3 .667-1.667.5-5.833-1.5-11.5-1.457-1.015-3-1.34-4.5-1.5l-1 2.5" />
                  <path d="M8.5 17c0 1-1.356 3-1.832 3-1.429 0-2.698-1.667-3.333-3-.635-1.667-.48-5.833 1.428-11.5C6.151 4.485 7.545 4.16 9 4l1 2.5" />
                </svg>
                <span className="font-medium">Join our Discord</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Subtle animated corners */}
          <div className="absolute top-0 left-0 w-16 h-1 bg-gradient-to-r from-green-500 to-transparent"></div>
          <div className="absolute top-0 left-0 w-1 h-16 bg-gradient-to-b from-green-500 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-16 h-1 bg-gradient-to-l from-green-500 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-1 h-16 bg-gradient-to-t from-green-500 to-transparent"></div>
        </motion.div>
      </div>
    </div>
  );
}
