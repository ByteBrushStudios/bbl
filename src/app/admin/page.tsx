import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Link2, PlusCircle, BarChart3, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default async function AdminDashboard() {
  // Get some basic stats for the dashboard
  const totalLinks = await prisma.link.count();
  const totalVisits = await prisma.link.aggregate({
    _sum: {
      visits: true,
    },
  });
  
  // Get recent links
  const recentLinks = await prisma.link.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  // Get top links by visits
  const topLinks = await prisma.link.findMany({
    orderBy: {
      visits: "desc",
    },
    take: 5,
  });
  
  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold">
          <span className="gradient-text">Admin Dashboard</span>
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
      
      {/* Stats cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div 
          className="card p-6 border-l-4 border-l-green-500"
          variants={item}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-slate-400">Total Links</h2>
            <Link2 size={20} className="text-green-400" />
          </div>
          <p className="text-4xl font-bold gradient-text">{totalLinks}</p>
        </motion.div>
        
        <motion.div 
          className="card p-6 border-l-4 border-l-green-500"
          variants={item}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-slate-400">Total Visits</h2>
            <Activity size={20} className="text-green-400" />
          </div>
          <p className="text-4xl font-bold">{totalVisits._sum.visits || 0}</p>
        </motion.div>
      </motion.div>
      
      {/* Recent and top links */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Recent links */}
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Links</h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/admin/links" className="text-green-400 hover:text-green-500 text-sm font-medium">
                View All
              </Link>
            </motion.div>
          </div>
          
          {recentLinks.length > 0 ? (
            <motion.ul 
              className="space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {recentLinks.map((link) => (
                <motion.li 
                  key={link.id} 
                  className="bg-slate-800/50 rounded-md p-4 border border-slate-700 hover:border-green-500/50 transition-colors"
                  variants={item}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="overflow-hidden">
                      <p className="font-medium text-white truncate max-w-[250px]">/{link.slug}</p>
                      <p className="text-sm text-slate-400 truncate max-w-[250px]">{link.targetUrl}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-green-400 font-medium">
                        {link.visits} visits
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.p 
              className="text-slate-400 py-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              No links created yet.
            </motion.p>
          )}
        </motion.div>
        
        {/* Top links */}
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Top Performing Links</h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/admin/links" className="text-green-400 hover:text-green-500 text-sm font-medium">
                View All
              </Link>
            </motion.div>
          </div>
          
          {topLinks.length > 0 ? (
            <motion.ul 
              className="space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {topLinks.map((link) => (
                <motion.li 
                  key={link.id} 
                  className="bg-slate-800/50 rounded-md p-4 border border-slate-700 hover:border-green-500/50 transition-colors"
                  variants={item}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="overflow-hidden">
                      <p className="font-medium text-white truncate max-w-[250px]">/{link.slug}</p>
                      <p className="text-sm text-slate-400 truncate max-w-[250px]">{link.targetUrl}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-green-400 font-medium">
                        {link.visits} visits
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.p 
              className="text-slate-400 py-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              No links created yet.
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
