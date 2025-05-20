'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-slate-600 dark:text-slate-400">Loading link data...</p>
        </div>
      </div>
    );
  }

  if (error && !link) {
    return (
      <div className="p-8">
        <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded mb-4">
          {error}
        </div>
        <Link
          href="/admin/links"
          className="text-blue-600 hover:underline"
        >
          Back to Links
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Delete Link</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Are you sure you want to delete this link?
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Link Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Slug</p>
              <p className="text-slate-600 dark:text-slate-400">{link?.slug}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Target URL</p>
              <p className="text-slate-600 dark:text-slate-400 truncate">{link?.targetUrl}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Created</p>
              <p className="text-slate-600 dark:text-slate-400">
                {link?.createdAt ? new Date(link.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Visits</p>
              <p className="text-slate-600 dark:text-slate-400">{link?.visits || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-900 p-4 rounded-md mb-6">
          <p className="text-red-700 dark:text-red-300 font-medium">Warning</p>
          <p className="text-red-600 dark:text-red-400 text-sm">
            This action cannot be undone. The link will be permanently deleted and any URLs using this slug
            will no longer redirect.
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href={`/admin/links/${id}/edit`}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
