'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';

type LinkData = {
  id: string;
  slug: string;
  targetUrl: string;
  metadata?: {
    title?: string;
    description?: string;
    image?: string;
  };
  active: boolean;
  createdAt: string;
  visits: number;
};

const linkSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-zA-Z0-9-_]+$/, 'Slug can only contain letters, numbers, hyphens, and underscores'),
  targetUrl: z.string().url('Please enter a valid URL'),
  metadata: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
  }).optional(),
  active: z.boolean(),
});

type FormData = z.infer<typeof linkSchema>;

export default function EditLinkPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [link, setLink] = useState<LinkData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    slug: '',
    targetUrl: '',
    metadata: {
      title: '',
      description: '',
      image: '',
    },
    active: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchLink() {
      try {
        const response = await fetch(`/api/links/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch link data');
        }
        
        const data = await response.json();
        setLink(data);
        setFormData({
          slug: data.slug,
          targetUrl: data.targetUrl,
          metadata: {
            title: data.metadata?.title || '',
            description: data.metadata?.description || '',
            image: data.metadata?.image || '',
          },
          active: data.active,
        });
      } catch (err) {
        console.error('Error fetching link:', err);
        setError('Failed to load link data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchLink();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name.startsWith('metadata.')) {
      const metadataField = name.split('.')[1];
      setFormData({
        ...formData,
        metadata: {
          ...formData.metadata,
          [metadataField]: value,
        },
      });
    } else if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      // Validate the form data
      linkSchema.parse(formData);

      // Clean up empty metadata fields
      const cleanMetadata = Object.fromEntries(
        Object.entries(formData.metadata || {}).filter(([_, value]) => value !== '')
      );

      // Send the data to the server
      const response = await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          metadata: Object.keys(cleanMetadata).length > 0 ? cleanMetadata : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update link');
      }

      // Redirect to the links page
      router.push('/admin/links');
      router.refresh();
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setSaving(false);
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
        <h1 className="text-3xl font-bold">Edit Link</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Update the link details and Open Graph metadata.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                placeholder="e.g., my-link"
                required
              />
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                This will be used in the URL: https://aka.bytebrush.dev/
                <span className="font-medium">{formData.slug || 'my-link'}</span>
              </p>
            </div>

            <div>
              <label htmlFor="targetUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target URL *
              </label>
              <input
                type="url"
                id="targetUrl"
                name="targetUrl"
                value={formData.targetUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                placeholder="https://example.com"
                required
              />
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                The destination URL where users will be redirected.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Active
                </label>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                When inactive, the link will return a 404 error instead of redirecting.
              </p>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
              <h2 className="text-lg font-medium mb-4">OpenGraph Metadata (Optional)</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                This information will be displayed when the link is shared on social media.
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="metadata.title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="metadata.title"
                    name="metadata.title"
                    value={formData.metadata?.title || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                    placeholder="My Awesome Link"
                  />
                </div>

                <div>
                  <label htmlFor="metadata.description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="metadata.description"
                    name="metadata.description"
                    value={formData.metadata?.description || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                    placeholder="A brief description of where this link leads"
                  />
                </div>

                <div>
                  <label htmlFor="metadata.image" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="metadata.image"
                    name="metadata.image"
                    value={formData.metadata?.image || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between space-x-4 pt-4">
              <Link
                href={`/admin/links/${id}/delete`}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Delete Link
              </Link>
              
              <div className="flex space-x-4">
                <Link
                  href="/admin/links"
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
