import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll } from 'motion/react';
import { SEO } from '../components/SEO';
import { fetchApi } from '../lib/api';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    // In a real app we'd fetch by slug, for now we fetch all and find
    fetchApi('/posts').then(data => {
      const found = data.find((p: any) => p.slug === slug);
      setPost(found);
      setLoading(false);
    }).catch(console.error);
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-12 w-3/4 mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Post not found</h2>
        <Link to="/blog" className="text-blue-500 hover:underline flex items-center justify-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO title={post.metaTitle || post.title} description={post.metaDescription || post.content.substring(0, 160)} />
      
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      <article className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all posts
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-zinc-500 mb-6">
            <span className="flex items-center text-blue-500 font-semibold uppercase tracking-wider">
              {post.category}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
            {post.title}
          </h1>

          {post.featuredImage && (
            <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12">
              <img 
                src={post.featuredImage} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        <div className="prose prose-lg dark:prose-invert prose-zinc max-w-none mb-12 whitespace-pre-wrap">
          {post.content}
        </div>

        <div className="flex flex-wrap gap-2 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          {post.tags?.map((tag: string) => (
            <span key={tag} className="flex items-center px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm font-medium">
              <Tag className="w-3 h-3 mr-2" />
              {tag}
            </span>
          ))}
        </div>
      </article>
    </>
  );
}
