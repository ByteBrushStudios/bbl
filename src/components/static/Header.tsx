'use client';

import Link from "next/link";
import { LayoutDashboard, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Image from "next/image";
import { useSettings } from "@/hooks/useSettings";

interface HeaderProps {
  isAdmin: boolean;
  session: any;
}

export default function Header({ isAdmin, session }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSettings();

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
    <header className="sticky top-0 z-50 border-b bg-slate-900/95 backdrop-blur supports-backdrop-blur:bg-slate-900/75 border-slate-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                {settings.logoUrl && (
                  <Image
                    src={settings.logoUrl}
                    alt={settings.siteName}
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                )}
              </div>
              <span className="hidden text-lg font-semibold text-white sm:block">
                {settings.siteName}
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="items-center hidden space-x-1 md:flex">
            {settings.enableBasePages && (
              <NavigationMenu.Root className="relative">
                <NavigationMenu.List className="flex space-x-1">
                  <NavigationMenu.Item>
                    <NavigationMenu.Trigger className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                      Features
                      <ChevronDown size={14} />
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content className="absolute w-48 mt-2 overflow-hidden rounded-md shadow-lg top-full bg-slate-800 ring-1 ring-slate-700">
                      <div className="py-1">
                        {/* Feature menu items */}
                      </div>
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                </NavigationMenu.List>
              </NavigationMenu.Root>
            )}

            {session ? (
              <div className="flex items-center space-x-1">
                <Link
                  href="/admin"
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                {/* User dropdown */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="flex items-center p-1 rounded-full hover:bg-slate-800">
                      {/* User avatar or icon */}
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content
                    className="min-w-[220px] bg-slate-800 rounded-md p-1 shadow-md border border-slate-700"
                    sideOffset={5}
                    align="end"
                  >
                    {/* Dropdown content */}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="show"
            exit="exit"
            variants={menuContainer}
            className="border-b md:hidden bg-slate-900 border-slate-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile menu items */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
