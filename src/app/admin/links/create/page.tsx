'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { AlertCircle, Link2, ExternalLink, FileImage, Type, FileText, Loader, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isFormValid, setIsFormValid] = useState(false);
  
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
    
    // Clear any previous error when user types
    setError(null);
  };
  
  // Validate form whenever formData changes
  useEffect(() => {
    try {
      linkSchema.parse(formData);
      setIsFormValid(true);
    } catch (err) {
      setIsFormValid(false);
    }
  }, [formData]);

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
  };  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">
            <span className="gradient-text">Create New Link</span>
          </h1>
          
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
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
          Create a new short link with optional metadata for Open Graph previews.
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
              className="flex flex-col sm:flex-row justify-end gap-4 pt-6 mt-2 border-t border-slate-700"
            >
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
                disabled={loading || !isFormValid}
                className="w-full sm:w-auto px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-300 disabled:opacity-50 disabled:hover:bg-green-500 disabled:cursor-not-allowed font-medium flex items-center justify-center"
                whileHover={!loading && isFormValid ? { scale: 1.05 } : {}}
                whileTap={!loading && isFormValid ? { scale: 0.95 } : {}}
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin -ml-1 mr-2 h-4 w-4 text-white">
                      <Loader size={16} />
                    </div>
                    Creating...
                  </span>
                ) : 'Create Link'}
              </motion.button>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
