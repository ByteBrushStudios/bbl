'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle, Edit, Copy, Trash2, Search,
  Link2 as LinkIcon, ExternalLink, Eye,
  ArrowUp, ArrowDown, Filter, Check, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Link = {
  id: string;
  slug: string;
  targetUrl: string;
  metadata?: {
    title?: string;
    description?: string;
    image?: string;
  };
  visits: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type SortKey = 'createdAt' | 'visits' | 'slug';
type SortDirection = 'asc' | 'desc';
type FilterKey = 'active' | 'all' | 'inactive';

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterKey>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/links');
      if (!response.ok) throw new Error('Failed to fetch links');

      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const handleCopyLink = (slug: string) => {
    const domain = window.location.origin;
    navigator.clipboard.writeText(`${domain}/${slug}`);
    setCopiedSlug(slug);

    // Clear the copied status after 2 seconds
    setTimeout(() => {
      setCopiedSlug(null);
    }, 2000);
  };

  const handleDeleteLink = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this link? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete link');

      // Refresh links after deletion
      fetchLinks();
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const filteredLinks = links
    .filter(link => {
      // First filter by active status
      if (filterStatus === 'active' && !link.active) return false;
      if (filterStatus === 'inactive' && link.active) return false;

      // Then filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          link.slug.toLowerCase().includes(searchLower) ||
          link.targetUrl.toLowerCase().includes(searchLower) ||
          (link.metadata?.title?.toLowerCase().includes(searchLower) || false)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortKey === 'createdAt') {
        return sortDirection === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortKey === 'visits') {
        return sortDirection === 'asc'
          ? a.visits - b.visits
          : b.visits - a.visits;
      } else {
        return sortDirection === 'asc'
          ? a.slug.localeCompare(b.slug)
          : b.slug.localeCompare(a.slug);
      }
    });

  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-4 mx-auto sm:p-8 max-w-7xl">
      {/* Header */}
      <motion.div
        className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            <span className="gradient-text">Manage Links</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            View, edit, and analyze all your shortened links
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/admin/links/create"
            className="flex items-center gap-2 btn-primary"
          >
            <PlusCircle size={18} />
            Create Link
          </Link>
        </motion.div>
      </motion.div>

      {/* Search and filters */}
      <div className="p-4 mb-6 border rounded-lg bg-slate-900/60 backdrop-blur-sm border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search links by slug or target URL..."
              className="w-full py-2 pl-10 pr-4 text-white border rounded-md bg-slate-800 border-slate-700 focus:outline-none focus:ring-1 focus:ring-green-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2 transition-colors border rounded-md bg-slate-800 border-slate-700 hover:bg-slate-700"
            >
              <Filter size={16} />
              <span>Filter</span>
              {filterStatus !== 'all' && (
                <span className="w-2 h-2 ml-1 bg-green-500 rounded-full"></span>
              )}
            </button>

            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  className="absolute right-0 z-10 w-48 mt-2 overflow-hidden border rounded-md shadow-lg bg-slate-900 border-slate-800"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="p-2">
                    <button
                      className={`flex items-center w-full px-3 py-2 text-left rounded-md ${filterStatus === 'all' ? 'bg-green-500/20 text-green-400' : 'hover:bg-slate-800'}`}
                      onClick={() => {
                        setFilterStatus('all');
                        setFilterOpen(false);
                      }}
                    >
                      {filterStatus === 'all' && <Check size={16} className="mr-2" />}
                      All Links
                    </button>
                    <button
                      className={`flex items-center w-full px-3 py-2 text-left rounded-md ${filterStatus === 'active' ? 'bg-green-500/20 text-green-400' : 'hover:bg-slate-800'}`}
                      onClick={() => {
                        setFilterStatus('active');
                        setFilterOpen(false);
                      }}
                    >
                      {filterStatus === 'active' && <Check size={16} className="mr-2" />}
                      Active Only
                    </button>
                    <button
                      className={`flex items-center w-full px-3 py-2 text-left rounded-md ${filterStatus === 'inactive' ? 'bg-green-500/20 text-green-400' : 'hover:bg-slate-800'}`}
                      onClick={() => {
                        setFilterStatus('inactive');
                        setFilterOpen(false);
                      }}
                    >
                      {filterStatus === 'inactive' && <Check size={16} className="mr-2" />}
                      Inactive Only
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          {links.length === 0 ? (
            <motion.div
              className="p-8 text-center border rounded-lg bg-slate-900/60 backdrop-blur-sm border-slate-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="inline-block p-4 mb-4 rounded-full bg-slate-800">
                <LinkIcon size={32} className="text-slate-500" />
              </div>
              <h3 className="mb-2 text-xl font-bold">No Links Yet</h3>
              <p className="mb-6 text-slate-400">
                You haven't created any links yet. Create your first link to get started!
              </p>
              <Link
                href="/admin/links/create"
                className="inline-flex items-center gap-2 btn-primary"
              >
                <PlusCircle size={18} />
                Create Your First Link
              </Link>
            </motion.div>
          ) : (
            <div className="overflow-hidden border rounded-lg bg-slate-900/60 backdrop-blur-sm border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800/80">
                      <th className="px-6 py-3 text-xs font-medium text-left text-slate-400">
                        <button
                          className="flex items-center gap-1 transition-colors hover:text-white"
                          onClick={() => handleSort('slug')}
                        >
                          LINK
                          {sortKey === 'slug' && (
                            sortDirection === 'asc' ?
                              <ArrowUp size={14} /> :
                              <ArrowDown size={14} />
                          )}
                        </button>
                      </th>
                      <th className="hidden px-6 py-3 text-xs font-medium text-left text-slate-400 md:table-cell">TARGET URL</th>
                      <th className="px-6 py-3 text-xs font-medium text-left text-slate-400">
                        <button
                          className="flex items-center gap-1 transition-colors hover:text-white"
                          onClick={() => handleSort('visits')}
                        >
                          VISITS
                          {sortKey === 'visits' && (
                            sortDirection === 'asc' ?
                              <ArrowUp size={14} /> :
                              <ArrowDown size={14} />
                          )}
                        </button>
                      </th>
                      <th className="hidden px-6 py-3 text-xs font-medium text-left text-slate-400 md:table-cell">
                        <button
                          className="flex items-center gap-1 transition-colors hover:text-white"
                          onClick={() => handleSort('createdAt')}
                        >
                          CREATED
                          {sortKey === 'createdAt' && (
                            sortDirection === 'asc' ?
                              <ArrowUp size={14} /> :
                              <ArrowDown size={14} />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-left text-slate-400">STATUS</th>
                      <th className="px-6 py-3 text-xs font-medium text-right text-slate-400">ACTIONS</th>
                    </tr>
                  </thead>
                  <motion.tbody
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="divide-y divide-slate-800"
                  >
                    {filteredLinks.map((link) => (
                      <motion.tr
                        key={link.id}
                        variants={item}
                        className="transition-colors hover:bg-slate-800/40 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="font-medium text-white">/{link.slug}</div>
                            <Link
                              href={`/${link.slug}`}
                              target="_blank"
                              className="ml-2 text-green-400 transition-opacity opacity-0 group-hover:opacity-100"
                            >
                              <ExternalLink size={14} />
                            </Link>
                          </div>
                          {link.metadata?.title && (
                            <div className="max-w-xs mt-1 text-xs truncate text-slate-500">
                              {link.metadata.title}
                            </div>
                          )}
                        </td>
                        <td className="hidden px-6 py-4 text-slate-300 md:table-cell">
                          <div className="max-w-xs truncate">
                            {link.targetUrl}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Eye size={14} className="mr-1 text-slate-500" />
                            <span className="text-slate-300">{link.visits}</span>
                          </div>
                        </td>
                        <td className="hidden px-6 py-4 text-sm text-slate-400 md:table-cell">
                          {new Date(link.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${link.active
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-slate-700/50 text-slate-400'
                              }`}
                          >
                            {link.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleCopyLink(link.slug)}
                              className="p-1.5 text-slate-400 hover:text-green-400 transition-colors"
                              title="Copy link"
                            >
                              {copiedSlug === link.slug ? (
                                <Check size={16} className="text-green-500" />
                              ) : (
                                <Copy size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => router.push(`/admin/links/${link.id}/edit`)}
                              className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors"
                              title="Edit link"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteLink(link.id)}
                              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                              title="Delete link"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </div>

              {filteredLinks.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-slate-400">No links match your search criteria.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
