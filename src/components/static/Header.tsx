'use client';

import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { FileText, LayoutDashboard, Menu, X, Github, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Image from "next/image";

interface HeaderProps {
  isAdmin: boolean;
  session: any;
}

export default function Header({ isAdmin, session }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const menuItem = {
    hidden: { opacity: 0, y: -10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <header className="relative top-0 z-10 px-4 py-4 border-b border-slate-800 bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center group">
            <motion.div
              className="flex items-center justify-center w-10 h-10 mr-3 transition-colors rounded-full bg-green-500/20 group-hover:bg-green-500/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Image alt="Logo" src="/bytebrush/logo.png" width={40} height={40} className="w-8 h-8" />
            </motion.div>
            <motion.h1
              className="text-2xl font-bold transition-colors group-hover:text-green-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {siteConfig.siteName}
            </motion.h1>
          </Link>
        </motion.div>

        {/* Desktop Navigation with Radix UI */}
        <NavigationMenu.Root className="hidden md:block">
          <NavigationMenu.List className="flex items-center gap-4">
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link href="/" className="nav-link">Home</Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link href="#features" className="nav-link">Features</Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link href="#how-it-works" className="nav-link">How It Works</Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <a
                  href="https://github.com/ByteBrushStudios/bbl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 nav-link"
                >
                  <Github size={16} />
                  GitHub
                </a>
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            {session ? (
              <>
                {isAdmin && (
                  <NavigationMenu.Item>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 btn-secondary"
                      >
                        <LayoutDashboard size={16} />
                        Admin Dashboard
                      </Link>
                    </motion.div>
                  </NavigationMenu.Item>
                )}

                <NavigationMenu.Item>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <motion.button
                        className="flex items-center gap-2 px-3 py-2 transition-colors rounded-md hover:bg-slate-800 focus:outline-none"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-green-400">{session.user?.name}</span>
                        <ChevronDown size={14} />
                      </motion.button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="bg-slate-800 rounded-md p-2 shadow-md border border-slate-700 min-w-[180px]"
                        sideOffset={5}
                        align="end"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <DropdownMenu.Item className="focus:outline-none">
                            <Link
                              href="/profile"
                              className="flex items-center w-full gap-2 p-2 text-sm transition-colors rounded hover:bg-slate-700"
                            >
                              Profile Settings
                            </Link>
                          </DropdownMenu.Item>

                          <DropdownMenu.Separator className="h-px my-1 bg-slate-700" />

                          <DropdownMenu.Item className="focus:outline-none">
                            <Link
                              href="/auth/signout"
                              className="flex items-center w-full gap-2 p-2 text-sm text-red-400 transition-colors rounded hover:bg-slate-700"
                            >
                              Sign Out
                            </Link>
                          </DropdownMenu.Item>
                        </motion.div>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </NavigationMenu.Item>
              </>
            ) : (
              <NavigationMenu.Item>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/auth/signin"
                    className="btn-primary"
                  >
                    Sign In
                  </Link>
                </motion.div>
              </NavigationMenu.Item>
            )}
          </NavigationMenu.List>
        </NavigationMenu.Root>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white transition-colors rounded-md focus:outline-none hover:bg-slate-800"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={mobileMenuOpen ? { rotate: 180 } : { rotate: 0 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="absolute left-0 right-0 p-4 border-b top-full bg-slate-900 border-slate-800 md:hidden glass-panel"
            variants={menuContainer}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <nav className="flex flex-col gap-3">
              <motion.div variants={menuItem}>
                <Link
                  href="/"
                  className="block py-2 nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </motion.div>

              <motion.div variants={menuItem}>
                <Link
                  href="#features"
                  className="block py-2 nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
              </motion.div>

              <motion.div variants={menuItem}>
                <Link
                  href="#how-it-works"
                  className="block py-2 nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
              </motion.div>

              <motion.div variants={menuItem}>
                <a
                  href="https://github.com/ByteBrushStudios/bbl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 py-2 nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Github size={16} />
                  GitHub
                </a>
              </motion.div>

              {session ? (
                <>
                  {isAdmin && (
                    <motion.div variants={menuItem}>
                      <Link
                        href="/admin"
                        className="flex items-center justify-center gap-2 mt-2 btn-secondary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        Admin Dashboard
                      </Link>
                    </motion.div>
                  )}

                  <motion.div variants={menuItem}>
                    <Link
                      href="/profile"
                      className="flex items-center justify-center gap-1 mt-2 text-center btn-secondary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                  </motion.div>

                  <motion.div variants={menuItem}>
                    <Link
                      href="/auth/signout"
                      className="flex items-center justify-center gap-1 mt-2 text-center text-red-400 btn-secondary border-red-900/30"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Out
                    </Link>
                  </motion.div>
                </>
              ) : (
                <motion.div variants={menuItem}>
                  <Link
                    href="/auth/signin"
                    className="block mt-2 text-center btn-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
