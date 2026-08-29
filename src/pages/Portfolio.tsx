import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { ExternalLink, Github, ArrowRight, X } from 'lucide-react';
import { fetchApi } from '../lib/api';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

export default function Portfolio() {
  const { t, dir } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/projects')
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => dir === 'rtl' && p.categoryAr ? p.categoryAr : p.category));
    return ['All', ...Array.from(cats)].filter(Boolean);
  }, [projects, dir]);

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => (dir === 'rtl' && p.categoryAr ? p.categoryAr : p.category) === activeCategory);

  return (
    <>
      <SEO title={t.nav.portfolio} />
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{dir === 'rtl' ? 'دراسات الحالة والمشاريع' : 'Case Studies & Projects'}</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {dir === 'rtl' ? 'مجموعة مختارة من أعمالي الأخيرة في مجال تطوير أنظمة المؤسسات وتطبيقات الويب المتكاملة.' : 'A selection of my recent work across enterprise software, full-stack development, and AI integration.'}
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 shadow-md'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}
              aria-label={`Filter by ${cat}`}
            >
              {cat === 'All' && dir === 'rtl' ? 'الكل' : cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <motion.div 
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass rounded-3xl overflow-hidden flex flex-col h-[500px] border border-zinc-200 dark:border-zinc-800"
                >
                  <Skeleton className="w-full h-64 rounded-none" />
                  <div className="p-8 flex flex-col flex-grow">
                    <Skeleton className="w-3/4 h-8 mb-4" />
                    <Skeleton className="w-full h-4 mb-2" />
                    <Skeleton className="w-5/6 h-4 mb-6" />
                    <div className="flex gap-2 mt-auto">
                      <Skeleton className="w-16 h-6 rounded-full" />
                      <Skeleton className="w-20 h-6 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.4 }}
                  className="group glass rounded-3xl overflow-hidden flex flex-col h-full border border-zinc-200 dark:border-zinc-800 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)] transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <div className="absolute inset-0 bg-zinc-900/10 group-hover:bg-transparent transition-colors z-10" />
                    <img 
                      src={project.images?.[0] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80'} 
                      alt={project.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow relative z-30 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold">{dir === 'rtl' && project.titleAr ? project.titleAr : project.title}</h3>
                      <div className="flex gap-2 relative z-40">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub Repository" className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.liveDemo && (
                          <a href={project.liveDemo} target="_blank" rel="noreferrer" aria-label="Live Demo" className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6 flex-grow whitespace-pre-wrap leading-relaxed line-clamp-3">
                      {dir === 'rtl' && project.descriptionAr ? project.descriptionAr : project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {(project.technologies?.length > 0 ? project.technologies : project.tags)?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full border border-blue-100 dark:border-blue-800/30">
                          {tag}
                        </span>
                      ))}
                      {(project.technologies?.length > 0 ? project.technologies : project.tags)?.length > 3 && (
                        <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold rounded-full border border-zinc-200 dark:border-zinc-700">
                          +{(project.technologies?.length > 0 ? project.technologies : project.tags).length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
