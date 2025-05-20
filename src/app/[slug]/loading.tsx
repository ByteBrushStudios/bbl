import { FileText, Loader } from "lucide-react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-[#0c1120]">
      <motion.div 
        className="w-full max-w-md text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
            <FileText size={32} className="text-green-500 animate-pulse" />
          </div>
        </motion.div>

        <motion.h1 
          className="text-xl sm:text-2xl font-bold mb-8 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <span className="gradient-text">Redirecting</span> you to your destination
        </motion.h1>
        
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Loader size={48} className="animate-spin text-green-500" />
        </motion.div>
      </motion.div>
    </div>
  );
}
