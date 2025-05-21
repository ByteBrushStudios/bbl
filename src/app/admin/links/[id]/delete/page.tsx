'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Link2, Trash2, ExternalLink, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

type LinkData = {
  id: string;
  slug: string;
  targetUrl: string;
  createdAt: string;
  visits: number;
};

export default function DeleteLinkPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [link, setLink] = useState<LinkData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchLink() {
      try {
        const response = await fetch(`/api/links/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch link data');
        }

        const data = await response.json();
        setLink(data);
      } catch (err) {
        console.error('Error fetching link:', err);
        setError('Failed to load link data');
      } finally {
        setLoading(false);
      }
    }

    fetchLink();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete link');
      }

      // Redirect to the links page
      router.push('/admin/links');
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 max-w-3xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/admin/links" className="text-green-400 hover:text-green-300 flex items-center gap-2 mb-4">
            <ArrowLeft size={16} />
            Back to Links
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">
            <span className="gradient-text">Delete Link</span>
          </h1>
        </motion.div>
        <div className="card p-8 flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (error && !link) {
    return (
      <div className="p-4 sm:p-8 max-w-3xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/admin/links" className="text-green-400 hover:text-green-300 flex items-center gap-2 mb-4">
            <ArrowLeft size={16} />
            Back to Links
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">
            <span className="gradient-text">Delete Link</span>
          </h1>
        </motion.div>
        <div className="card p-6">
          <div className="flex items-center p-4 mb-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md">
            <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <motion.div
            className="flex justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/admin/links"
              className="btn-primary flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Return to Links
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/admin/links" className="text-green-400 hover:text-green-300 flex items-center gap-2 mb-4">
          <ArrowLeft size={16} />
          Back to Links
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold">
          <span className="gradient-text">Delete Link</span>
        </h1>
        <p className="text-slate-400 mt-1">
          Are you sure you want to delete this link?
        </p>
      </motion.div>

      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {error && (
          <div className="flex items-center p-4 mb-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md">
            <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-slate-800">Link Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-green-500/10 rounded-md">
                  <Link2 size={18} className="text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Slug</p>
                  <p className="text-lg font-medium text-white flex items-center gap-2">
                    /{link?.slug}
                    <Link
                      href={`/${link?.slug}`}
                      target="_blank"
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <p className="text-sm text-slate-400">Target URL</p>
              <p className="text-white truncate">{link?.targetUrl}</p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <p className="text-sm text-slate-400">Created On</p>
              <p className="text-white">
                {link?.createdAt ? new Date(link.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <p className="text-sm text-slate-400">Total Visits</p>
              <p className="text-2xl font-semibold text-green-400">{link?.visits || 0}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-red-900/20 border border-red-800/30 rounded-lg mb-6 flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-400 font-medium mb-1">Warning: This action cannot be undone</p>
            <p className="text-red-300/80 text-sm">
              When you delete this link, it will be permanently removed from your account.
              Any existing links using the slug "/{link?.slug}" will no longer work and will return a 404 error.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-slate-800">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={`/admin/links/${id}/edit`}
              className="w-full sm:w-auto px-6 py-2 border border-slate-700 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all duration-300 flex items-center justify-center"
            >
              Cancel
            </Link>
          </motion.div>

          <motion.button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full sm:w-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            whileHover={!deleting ? { scale: 1.05 } : {}}
            whileTap={!deleting ? { scale: 0.95 } : {}}
          >
            {deleting ? (
              <span className="flex items-center gap-2">
                <Loader size={16} className="animate-spin" />
                Deleting...
              </span>
            ) : (
              <>
                <Trash2 size={16} />
                Delete Link
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
