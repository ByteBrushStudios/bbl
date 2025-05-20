import Link from "next/link";
import { FileX, Home } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-[#0c1120]">
      <motion.div 
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <FileX size={32} className="text-red-500" />
          </div>
        </motion.div>

        <motion.h1 
          className="text-3xl sm:text-4xl font-bold mb-4 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="gradient-text">404</span> - Link Not Found
        </motion.h1>
        
        <motion.p 
          className="mb-8 text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          The link you're looking for doesn't exist or has been deactivated.
        </motion.p>
        
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link 
            href="/" 
            className="btn-primary flex items-center gap-2 mx-auto w-fit"
          >
            <Home size={18} />
            Return to Home
          </Link>
        </motion.div>
        
        <motion.p 
          className="mt-8 text-center text-sm text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          For assistance, contact us at{' '}
          <a href={`mailto:${siteConfig.supportEmail}`} className="text-green-400 hover:text-green-300">
            {siteConfig.supportEmail}
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
