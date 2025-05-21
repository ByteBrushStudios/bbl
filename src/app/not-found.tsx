import Link from 'next/link';
import { FileX, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import ErrorLayout from '@/components/layouts/error/ErrorLayout';

export default function NotFound() {
  return (
    <ErrorLayout
      icon={<FileX size={32} className="text-yellow-500" />}
      title="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      iconColor="text-yellow-500"
    >
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
    </ErrorLayout>
  );
}
