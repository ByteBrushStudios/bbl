'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle, Link2, ExternalLink, FileImage, Type,
  FileText, Loader, ArrowLeft, Save, Trash2, ToggleLeft, ToggleRight
} from 'lucide-react';

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
  const [showAlert, setShowAlert] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    async function fetchLink() {
      try {
        setLoading(true);
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

      // Show success message
      setShowAlert({
        message: 'Link updated successfully!',
        type: 'success'
      });

      // Clear the alert after 3 seconds
      setTimeout(() => {
        setShowAlert(null);
        // Redirect to the links page
        router.push('/admin/links');
        router.refresh();
      }, 2000);
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

  // Animation variants
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

  if (loading) {
    return (
      <div className="p-4 sm:p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            <span className="gradient-text">Edit Link</span>
          </h1>
        </div>
        <div className="card flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (error && !link) {
    return (
      <div className="p-4 sm:p-8 max-w-6xl mx-auto">
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md flex items-center">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/admin/links"
            className="btn-primary flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Links
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Custom Alert/Toast Component */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg flex items-center gap-2 ${showAlert.type === 'success'
                ? 'bg-green-500/90 text-white border border-green-600'
                : 'bg-red-500/90 text-white border border-red-600'
              }`}
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
          >
            {showAlert.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{showAlert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">
            <span className="gradient-text">Edit Link</span>
          </h1>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/admin/links"
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft size={16} />
              Back to links
            </Link>
          </motion.div>
        </div>
        <p className="text-slate-300 text-sm sm:text-base">
          Update link details and optional metadata for Open Graph previews.
        </p>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="card p-4 sm:p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {link && (
          <div className="flex justify-between items-center mb-6 bg-slate-800/50 p-3 rounded-md border border-slate-700">
            <div>
              <p className="text-sm text-slate-400">Link Stats</p>
              <p className="text-lg font-medium text-white flex items-center gap-2">
                <span className="text-green-400">{link.visits}</span> visits since {new Date(link.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Link
              href={`/${link.slug}`}
              target="_blank"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              <ExternalLink size={20} />
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div
            className="grid grid-cols-1 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item}>
              <label htmlFor="slug" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                <Link2 size={14} />
                Slug *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  /
                </span>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full pl-6 pr-4 py-2 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-slate-800/50 text-white transition-all duration-300"
                  placeholder="e.g., my-link"
                  required
                />
              </div>
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                This will be used in the URL: https://aka.bytebrush.dev/
                <span className="text-green-400 font-medium">{formData.slug || 'my-link'}</span>
              </p>
            </motion.div>

            <motion.div variants={item}>
              <label htmlFor="targetUrl" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                <ExternalLink size={14} />
                Target URL *
              </label>
              <input
                type="url"
                id="targetUrl"
                name="targetUrl"
                value={formData.targetUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-slate-800/50 text-white transition-all duration-300"
                placeholder="https://example.com"
                required
              />
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                The destination URL where users will be redirected.
              </p>
            </motion.div>

            <motion.div variants={item}>
              <label className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                Link Status
              </label>
              <div
                className="flex items-center cursor-pointer mt-2 gap-2"
                onClick={() => setFormData({ ...formData, active: !formData.active })}
              >
                <div className={`relative inline-block w-12 h-6 rounded-full transition-colors duration-300 ${formData.active ? 'bg-green-500' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${formData.active ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <span className={`text-sm ${formData.active ? 'text-green-400' : 'text-slate-400'}`}>
                  {formData.active ? (
                    <span className="flex items-center gap-1">
                      <ToggleRight size={16} className="text-green-400" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <ToggleLeft size={16} className="text-slate-400" />
                      Inactive
                    </span>
                  )}
                </span>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                When inactive, the link will return a 404 error instead of redirecting.
              </p>
            </motion.div>

            <motion.div
              variants={item}
              className="border-t border-slate-700 pt-6 mt-2"
            >
              <h2 className="text-lg font-medium mb-4 text-white flex items-center gap-2">
                <span className="gradient-text">OpenGraph Metadata</span>
                <span className="text-slate-400 text-sm">(Optional)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                This information will be displayed when the link is shared on social media platforms.
              </p>

              <div className="space-y-6">
                <div>
                  <label htmlFor="metadata.title" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                    <Type size={14} />
                    Title
                  </label>
                  <input
                    type="text"
                    id="metadata.title"
                    name="metadata.title"
                    value={formData.metadata?.title || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-slate-800/50 text-white transition-all duration-300"
                    placeholder="My Awesome Link"
                  />
                </div>

                <div>
                  <label htmlFor="metadata.description" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                    <FileText size={14} />
                    Description
                  </label>
                  <textarea
                    id="metadata.description"
                    name="metadata.description"
                    value={formData.metadata?.description || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-slate-800/50 text-white transition-all duration-300"
                    placeholder="A brief description of where this link leads"
                  />
                </div>

                <div>
                  <label htmlFor="metadata.image" className="flex items-center gap-2 text-sm font-medium text-green-400 mb-1">
                    <FileImage size={14} />
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="metadata.image"
                    name="metadata.image"
                    value={formData.metadata?.image || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-slate-800/50 text-white transition-all duration-300"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row justify-between gap-4 pt-6 mt-2 border-t border-slate-700"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="order-2 sm:order-1"
              >
                <Link
                  href={`/admin/links/${id}/delete`}
                  className="w-full sm:w-auto px-6 py-2 border border-red-800/30 bg-red-900/20 rounded-md text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete Link
                </Link>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-4 order-1 sm:order-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/admin/links"
                    className="w-full sm:w-auto px-6 py-2 border border-slate-700 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all duration-300 flex items-center justify-center"
                  >
                    Cancel
                  </Link>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-300 disabled:opacity-50 disabled:hover:bg-green-500 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                  whileHover={!saving ? { scale: 1.05 } : {}}
                  whileTap={!saving ? { scale: 0.95 } : {}}
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 text-white">
                        <Loader size={16} />
                      </div>
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
