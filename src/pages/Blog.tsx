import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Search, ChevronRight } from 'lucide-react';
import { fetchApi } from '../lib/api';
import { Link } from 'react-router-dom';
import { Skeleton } from '../components/ui/Skeleton';

export default function Blog() {
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApi('/posts')
      .then((data) => {
        setPosts(data.filter((p: any) => p.published));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredPosts = posts.filter(post => {
    const title = language === 'ar' && post.titleAr ? post.titleAr : post.title;
    const content = language === 'ar' && post.contentAr ? post.contentAr : post.content;
    const category = language === 'ar' && post.categoryAr ? post.categoryAr : post.category;
    return title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           content.toLowerCase().includes(searchQuery.toLowerCase()) ||
           category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <SEO title={t.nav.blog} />
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{language === 'ar' ? 'المدونة التقنية' : 'Technical Journal'}</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
            {language === 'ar' ? 'أفكار، دروس، وتأملات في هندسة البرمجيات، بايثون، أودو، والذكاء الاصطناعي.' : 'Insights, tutorials, and reflections on Software Engineering, Python, Odoo, and AI.'}
          </p>

          {/* Live Search */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              type="text"
              placeholder={language === 'ar' ? 'ابحث في المقالات...' : 'Search articles...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 rtl:pr-10 rtl:pl-3 py-3 border border-zinc-200 dark:border-zinc-800 rounded-full leading-5 bg-white dark:bg-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-shadow"
            />
          </div>
        </motion.div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <motion.div 
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass rounded-3xl overflow-hidden flex flex-col h-[400px]"
                >
                  <Skeleton className="w-full h-48 rounded-none" />
                  <div className="p-6 flex flex-col flex-grow">
                    <Skeleton className="w-24 h-4 mb-4" />
                    <Skeleton className="w-full h-6 mb-2" />
                    <Skeleton className="w-3/4 h-6 mb-4" />
                    <Skeleton className="w-full h-4 mb-2" />
                    <Skeleton className="w-5/6 h-4 mb-2" />
                  </div>
                </motion.div>
              ))
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post, idx) => (
                <motion.article 
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-3xl overflow-hidden flex flex-col group"
                >
                  <Link to={`/blog/${post.slug || post.id}`} className="flex flex-col h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={post.featuredImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80'} 
                        alt={language === 'ar' && post.titleAr ? post.titleAr : post.title} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-zinc-900/80 backdrop-blur text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {language === 'ar' && post.categoryAr ? post.categoryAr : post.category}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow relative z-10 bg-white/50 dark:bg-zinc-900/50">
                      <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 mb-3 space-x-4 rtl:space-x-reverse">
                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-blue-500 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 flex-grow line-clamp-3">
                        {language === 'ar' && post.contentAr ? post.contentAr : post.content}
                      </p>
                      <div className="mt-auto flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        {language === 'ar' ? 'قراءة المقال' : 'Read Article'} <ChevronRight className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12 text-zinc-500"
              >
                {language === 'ar' ? `لم يتم العثور على مقالات تطابق "${searchQuery}".` : `No articles found matching "${searchQuery}".`}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
