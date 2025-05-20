import Link from 'next/link';
import { FileX, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { siteConfig } from '@/lib/config';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-[#0c1120]">
      <motion.div 
        className="w-full max-w-md card p-6 sm:p-8 border border-slate-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <FileX size={32} className="text-yellow-500" />
            </div>
          </motion.div>
          <motion.h1 
            className="text-2xl font-bold mb-2 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Page Not Found
          </motion.h1>
          <motion.p 
            className="text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>
        </div>
        
        <div className="flex flex-col gap-4 mt-6">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link 
              href="/" 
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors"
            >
              <ArrowLeft size={18} />
              Go to Homepage
            </Link>
          </motion.div>
        </div>
        
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
