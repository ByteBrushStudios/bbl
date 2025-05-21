import Link from "next/link";
import { FileX, Home } from "lucide-react";
import { motion } from "framer-motion";
import ErrorLayout from "@/components/layouts/error/ErrorLayout";

export default function NotFound() {
  return (
    <ErrorLayout
      icon={<FileX size={32} className="text-red-500" />}
      title="404 - Link Not Found"
      description="The link you're looking for doesn't exist or has been deactivated."
      iconColor="text-red-500"
    >
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
    </ErrorLayout>
  );
}
