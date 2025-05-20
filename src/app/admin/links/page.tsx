import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Link2, PlusCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default async function ManageLinksPage() {
  const links = await prisma.link.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  
  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold">
          <span className="gradient-text">Manage Links</span>
        </h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/admin/links/create"
            className="btn-primary flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Create New Link
          </Link>
        </motion.div>
      </motion.div>

      <motion.div 
        className="card overflow-hidden shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Mobile view for links (visible on small screens) */}
        <div className="block sm:hidden">
          <motion.div 
            className="divide-y divide-slate-800"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {links.length > 0 ? (
              links.map((link) => (
                <motion.div 
                  key={link.id} 
                  className="p-4 hover:bg-slate-800/30 transition-colors"
                  variants={item}
                  whileHover={{ backgroundColor: "rgba(15, 23, 42, 0.3)" }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <a
                      href={`${siteConfig.domain}/${link.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1"
                    >
                      /{link.slug}
                      <ExternalLink size={12} />
                    </a>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        link.active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {link.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-xs text-slate-400 mb-1">Target URL:</div>
                    <a
                      href={link.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-300 hover:text-white block truncate"
                    >
                      {link.targetUrl}
                    </a>
                  </div>
                  
                  <div className="flex justify-between text-xs text-slate-400 mb-3">
                    <div>Created: {new Date(link.createdAt).toLocaleDateString()}</div>
                    <div className="font-medium text-slate-300">{link.visits} visits</div>
                  </div>
                  
                  <div className="flex space-x-2 justify-end">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href={`/admin/links/${link.id}/edit`}
                        className="px-3 py-1 bg-slate-800 text-green-400 rounded-md hover:bg-slate-700 transition-colors text-sm"
                      >
                        Edit
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href={`/admin/links/${link.id}/delete`}
                        className="px-3 py-1 bg-slate-800 text-red-400 rounded-md hover:bg-red-900/30 transition-colors text-sm"
                      >
                        Delete
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="p-8 text-center"
                variants={item}
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 mb-4 bg-slate-800 rounded-full flex items-center justify-center">
                    <Link2 size={24} className="text-green-400" />
                  </div>
                  <p className="text-slate-400 mb-4">No links found. Create your first link using the button above.</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/admin/links/create" className="btn-primary flex items-center gap-2">
                      <PlusCircle size={18} />
                      Create First Link
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* Desktop view (table format - visible on medium screens and up) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Target URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Visits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-green-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {links.length > 0 ? (
                links.map((link, index) => (
                  <motion.tr 
                    key={link.id} 
                    className="hover:bg-slate-800/30 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`${siteConfig.domain}/${link.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1"
                      >
                        /{link.slug}
                        <ExternalLink size={12} />
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate">
                        <a
                          href={link.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-300 hover:text-white"
                        >
                          {link.targetUrl}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-medium">
                      {link.visits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          link.active
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {link.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link
                            href={`/admin/links/${link.id}/edit`}
                            className="px-3 py-1 bg-slate-800 text-green-400 rounded-md hover:bg-slate-700 transition-colors"
                          >
                            Edit
                          </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link
                            href={`/admin/links/${link.id}/delete`}
                            className="px-3 py-1 bg-slate-800 text-red-400 rounded-md hover:bg-red-900/30 transition-colors"
                          >
                            Delete
                          </Link>
                        </motion.div>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 mb-4 bg-slate-800 rounded-full flex items-center justify-center">
                        <Link2 size={24} className="text-green-400" />
                      </div>
                      <p className="text-slate-400 mb-4">No links found. Create your first link using the button above.</p>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/admin/links/create" className="btn-primary flex items-center gap-2">
                          <PlusCircle size={18} />
                          Create First Link
                        </Link>
                      </motion.div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
