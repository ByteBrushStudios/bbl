import { prisma } from "@/lib/prisma";
import Link from "next/link";

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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">Total Links</h2>
          <p className="text-4xl font-bold">{totalLinks}</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">Total Visits</h2>
          <p className="text-4xl font-bold">{totalVisits._sum.visits || 0}</p>
        </div>
      </div>
      
      {/* Recent and top links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent links */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Links</h2>
            <Link href="/admin/links" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          
          {recentLinks.length > 0 ? (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {recentLinks.map((link) => (
                <li key={link.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium truncate max-w-xs">{link.slug}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-xs">{link.targetUrl}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600 dark:text-slate-400 py-4 text-center">No links created yet.</p>
          )}
        </div>
        
        {/* Top links */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Top Links</h2>
            <Link href="/admin/links" className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          
          {topLinks.length > 0 ? (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {topLinks.map((link) => (
                <li key={link.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium truncate max-w-xs">{link.slug}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-xs">{link.targetUrl}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                        {link.visits} visits
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600 dark:text-slate-400 py-4 text-center">No links created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
