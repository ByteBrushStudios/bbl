'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';

const linkSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-zA-Z0-9-_]+$/, 'Slug can only contain letters, numbers, hyphens, and underscores'),
  targetUrl: z.string().url('Please enter a valid URL'),
  metadata: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
  }).optional(),
});

type FormData = z.infer<typeof linkSchema>;

export default function CreateLinkPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    slug: '',
    targetUrl: '',
    metadata: {
      title: '',
      description: '',
      image: '',
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('metadata.')) {
      const metadataField = name.split('.')[1];
      setFormData({
        ...formData,
        metadata: {
          ...formData.metadata,
          [metadataField]: value,
        },
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
    setLoading(true);

    try {
      // Validate the form data
      linkSchema.parse(formData);

      // Clean up empty metadata fields
      const cleanMetadata = Object.fromEntries(
        Object.entries(formData.metadata || {}).filter(([_, value]) => value !== '')
      );

      // Send the data to the server
      const response = await fetch('/api/links', {
        method: 'POST',
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
        throw new Error(data.message || 'Failed to create link');
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
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Link</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Create a new short link with optional metadata for Open Graph previews.
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

            <div className="flex justify-end space-x-4 pt-4">
              <Link
                href="/admin/links"
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Link'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
