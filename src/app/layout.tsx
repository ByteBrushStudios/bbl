import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/lib/config";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.siteName,
  description: `${siteConfig.siteName} - Short link redirection service by ByteBrush Studios`,
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();
  
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0c1120]`}
      >
        <div className="flex flex-col min-h-screen">
          {children}
          
          <footer className="mt-auto py-8 bg-slate-900 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-slate-400">
                    © {currentYear} ByteBrush Studios. All rights reserved.
                  </p>
                </div>
                <div className="flex space-x-6">
                  <Link href={siteConfig.discordServer} className="text-slate-400 hover:text-green-400" target="_blank">
                    Discord
                  </Link>
                  <Link href={`mailto:${siteConfig.supportEmail}`} className="text-slate-400 hover:text-green-400">
                    Support
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
