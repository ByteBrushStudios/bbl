import { FileText, Loader } from "lucide-react";
import { motion } from "framer-motion";
import RedirectLayout from "@/components/layouts/redirect/RedirectLayout";

export default function Loading() {
  return (
    <RedirectLayout
      icon={<FileText size={32} className="text-green-500 animate-pulse" />}
      title={<span className="gradient-text">Redirecting</span>}
    >
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Loader size={48} className="animate-spin text-green-500" />
      </motion.div>
    </RedirectLayout>
  );
}
