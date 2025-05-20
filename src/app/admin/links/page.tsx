import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export default async function ManageLinksPage() {
  const links = await prisma.link.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Links</h1>
        <Link
          href="/admin/links/create"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Create New Link
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Target URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Visits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {links.length > 0 ? (
                links.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`${siteConfig.domain}/${link.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {link.slug}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate">
                        <a
                          href={link.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 dark:text-slate-400 hover:underline"
                        >
                          {link.targetUrl}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                      {link.visits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          link.active
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {link.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/links/${link.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-4"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/links/${link.id}/delete`}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                      >
                        Delete
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">
                    No links found. Create your first link using the button above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
