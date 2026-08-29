import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Typewriter } from '../components/Typewriter';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/SEO';
import { Skeleton } from '../components/ui/Skeleton';
import { 
  Download, ArrowRight, Github, Linkedin, Database, Server, Code, 
  LayoutGrid, Activity, ExternalLink, Settings, BarChart, Send, Shield, Quote
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const BlurImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div 
        className={`absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} 
      />
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover object-center transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default function Home() {
  const { t, dir, language } = useLanguage();
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>({});
  
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchApi('/projects').then(data => setFeaturedProjects(data.slice(0, 3))),
      fetchApi('/posts').then(data => setFeaturedPosts(data.filter((p: any) => p.published).slice(0, 3))),
      fetchApi('/testimonials').then(data => setTestimonials(data)),
      fetchApi('/settings')
    ]).then(([_, __, ___, settingsData]) => {
      const formatted: any = {};
      settingsData.forEach((s: any) => { formatted[s.key] = s.value; });
      setSettings(formatted);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetchApi('/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, subject: 'Home Page Contact Form' })
      });
      toast.success(dir === 'rtl' ? 'تم إرسال رسالتك بنجاح، سأتواصل معك قريباً' : 'Message sent successfully, I will contact you soon!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(dir === 'rtl' ? 'حدث خطأ أثناء إرسال الرسالة.' : 'Error sending message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <>
      <SEO 
        title={settings.siteTitle || "Emad Alhalaqi"} 
        description={settings.siteDescription || "Software Developer & Systems Analyst"}
      />

      <div className="flex flex-col min-h-screen">
        {/* Section 2: Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden flex-grow flex items-center min-h-[90vh]">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Right Side (Text Content) - RTL logic applies */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left rtl:lg:text-right order-2 lg:order-1"
              >
                <motion.div variants={fadeIn} className="mb-6 inline-flex">
                  <span className="px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold border border-blue-100 dark:border-blue-800/30 shadow-sm">
                    {dir === 'rtl' ? 'مطور برمجيات ومحلل نظم معتمد' : 'Software Developer & Certified Systems Analyst'}
                  </span>
                </motion.div>
                
                <motion.h1 variants={fadeIn} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white leading-tight">
                  {dir === 'rtl' ? 'مرحباً، أنا ' : 'Hello, I am '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                    {dir === 'rtl' ? 'عماد الحلقي' : 'Emad Alhalaqi'}
                  </span>
                </motion.h1>
                
                <motion.div variants={fadeIn} className="min-h-[6rem] sm:min-h-[4.5rem] lg:min-h-[4rem] mb-8 flex items-center justify-center lg:justify-start">
                  <Typewriter 
                    text={dir === 'rtl' ? 'متخصص Odoo ERP | مهندس قواعد بيانات PostgreSQL | محلل نظم Agile/BPMN' : 'Odoo ERP Specialist | PostgreSQL Data Engineer | Agile/BPMN Systems Analyst'} 
                    speed={50} 
                    delay={500} 
                    className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-600 dark:text-zinc-400 leading-snug"
                  />
                </motion.div>
                
                <motion.p variants={fadeIn} className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10 leading-relaxed mx-auto lg:mx-0">
                  {dir === 'rtl' 
                    ? 'أقوم بتحويل التحديات المعقدة إلى أنظمة برمجية قابلة للتطوير، مع تركيز عالٍ على الأداء، تجربة المستخدم، والهندسة القوية لقواعد البيانات.' 
                    : 'Transforming complex challenges into scalable software systems, with a strong focus on performance, user experience, and robust database architecture.'}
                </motion.p>
                
                <motion.div variants={fadeIn} className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="rounded-full shadow-lg hover:shadow-blue-500/25 transition-all" asChild>
                    <Link to="/portfolio">
                      {dir === 'rtl' ? 'تصفح المشاريع' : 'View Projects'}
                    </Link>
                  </Button>
                  {settings.cvFile && (
                    <Button variant="outline" size="lg" className="rounded-full bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-50 dark:hover:bg-zinc-800" asChild>
                      <a href={settings.cvFile} target="_blank" rel="noreferrer">
                        <Download className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
                        {dir === 'rtl' ? 'تحميل السيرة الذاتية' : 'Download CV'}
                      </a>
                    </Button>
                  )}
                </motion.div>
              </motion.div>

              {/* Left Side (Visual Component) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-5 relative mt-12 lg:mt-0 order-1 lg:order-2 mb-10 lg:mb-0"
              >
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  {/* Floating abstract architecture elements */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl transform rotate-3 scale-105" />
                  
                  {/* Profile Picture */}
                  {loading ? (
                    <div className="absolute inset-4 rounded-[2.5rem] border-2 border-zinc-200 dark:border-zinc-800 shadow-2xl z-10 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                  ) : settings.profileImage ? (
                    <BlurImage 
                      src={settings.profileImage} 
                      alt="Profile" 
                      className="absolute inset-4 rounded-[2.5rem] border-2 border-zinc-200 dark:border-zinc-800 shadow-2xl z-10 bg-zinc-100 dark:bg-zinc-900"
                    />
                  ) : (
                    <div className="absolute inset-4 rounded-[2.5rem] border-2 border-zinc-200 dark:border-zinc-800 shadow-2xl z-10 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                      <Code className="w-16 h-16 text-zinc-300 dark:text-zinc-700" />
                    </div>
                  )}
                  
                  {/* Floating Elements */}
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute -top-4 -right-4 lg:-right-8 z-20 glass p-3 rounded-2xl flex items-center gap-3 border border-blue-500/20 bg-white/90 dark:bg-zinc-900/90 shadow-xl">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400">
                      <LayoutGrid className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold hidden sm:block">Frontend</div>
                  </motion.div>

                  <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} className="absolute top-1/2 -left-6 lg:-left-12 z-20 glass p-3 rounded-2xl flex items-center gap-3 border border-emerald-500/20 bg-white/90 dark:bg-zinc-900/90 shadow-xl">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                      <Server className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold hidden sm:block">Backend API</div>
                  </motion.div>

                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }} className="absolute -bottom-6 right-8 z-20 glass p-3 rounded-2xl flex items-center gap-3 border border-purple-500/20 bg-white/90 dark:bg-zinc-900/90 shadow-xl">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl text-purple-600 dark:text-purple-400">
                      <Database className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold hidden sm:block">PostgreSQL</div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 3: Impact Stats Banner */}
        <section className="border-y border-zinc-200 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-[#0f1520]/50 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x rtl:divide-x-reverse divide-zinc-200 dark:divide-zinc-800">
              <div className="text-center px-4">
                <div className="text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">+10</div>
                <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  {dir === 'rtl' ? 'مشاريع برمجية متكاملة' : 'Full-Stack Projects'}
                </div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">CAQA</div>
                <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  {dir === 'rtl' ? 'أنظمة وتخصيص Odoo' : 'Odoo Modules & Automation'}
                </div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">SQL</div>
                <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  {dir === 'rtl' ? 'إدارة قواعد البيانات' : 'Cloud DB Management'}
                </div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">Agile</div>
                <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  {dir === 'rtl' ? 'تحليل نظم وإشراف' : 'Scrum & Systems Analysis'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Featured Case Studies Grid */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  {dir === 'rtl' ? 'أبرز المشاريع والحلول الهندسية' : 'Featured Case Studies & Engineering Solutions'}
                </h2>
              </div>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link to="/portfolio">
                  {dir === 'rtl' ? 'عرض الكل' : 'View All'} 
                  <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="glass rounded-3xl overflow-hidden h-[450px]">
                    <Skeleton className="w-full h-48 rounded-none" />
                    <div className="p-8">
                      <Skeleton className="w-24 h-4 mb-4" />
                      <Skeleton className="w-3/4 h-8 mb-4" />
                      <Skeleton className="w-full h-16 mb-6" />
                      <div className="flex gap-2">
                        <Skeleton className="w-16 h-6 rounded-full" />
                        <Skeleton className="w-16 h-6 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))
              ) : featuredProjects.map((project) => (
                <div key={project.id} className="group relative rounded-3xl overflow-hidden bg-white dark:bg-[#151D2A] border border-zinc-200 dark:border-zinc-800 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col h-full">
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <img 
                      src={project.images?.[0] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80'} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm z-10">
                      {project.liveDemo && (
                        <a href={project.liveDemo} target="_blank" rel="noreferrer" className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform" title="Live Demo">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="w-12 h-12 bg-zinc-800 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform" title="Source Code">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 block">
                      {language === 'ar' && project.categoryAr ? project.categoryAr : project.category}
                    </span>
                    <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">
                      {dir === 'rtl' && project.titleAr ? project.titleAr : project.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6 line-clamp-2 text-sm leading-relaxed flex-grow">
                      {language === 'ar' && project.descriptionAr ? project.descriptionAr : project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {(project.technologies?.length > 0 ? project.technologies : project.tags)?.slice(0, 3).map((tag: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 rounded-full text-xs font-semibold border border-zinc-200 dark:border-zinc-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Recent Blog Posts */}
        <section className="py-24 bg-zinc-50 dark:bg-[#0B0F19]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  {dir === 'rtl' ? 'أحدث المقالات' : 'Recent Blog Posts'}
                </h2>
              </div>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link to="/blog">
                  {dir === 'rtl' ? 'عرض الكل' : 'View All'} 
                  <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="glass rounded-3xl overflow-hidden h-[400px] flex flex-col">
                    <Skeleton className="w-full h-48 rounded-none" />
                    <div className="p-6 flex flex-col flex-grow">
                      <Skeleton className="w-24 h-4 mb-4" />
                      <Skeleton className="w-3/4 h-6 mb-2" />
                      <Skeleton className="w-full h-4 mb-2" />
                      <Skeleton className="w-5/6 h-4 mb-2" />
                    </div>
                  </div>
                ))
              ) : featuredPosts.map((post) => (
                <article 
                  key={post.id}
                  className="glass rounded-3xl overflow-hidden flex flex-col group border border-zinc-200 dark:border-zinc-800 hover:-translate-y-2 hover:shadow-lg transition-all duration-300"
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
                    <div className="p-6 flex flex-col flex-grow relative z-10 bg-white dark:bg-[#151D2A]">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-blue-500 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 flex-grow line-clamp-3">
                        {language === 'ar' && post.contentAr ? post.contentAr : post.content}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Service Pillars */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {dir === 'rtl' ? 'ركائز الخدمات التي أقدمها' : 'Service Pillars'}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                {dir === 'rtl' 
                  ? 'حلول تقنية متكاملة تبدأ من التحليل الهيكلي وتصل إلى بناء أنظمة قوية وموثوقة.' 
                  : 'End-to-end technical solutions from structural analysis to robust system architecture.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pillar 1 */}
              <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#151D2A] p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-blue-500/30 transition-all">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                  <Settings className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 leading-snug">{dir === 'rtl' ? 'تخصيص وتطوير Odoo ERP' : 'Odoo ERP Customization'}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  {dir === 'rtl' ? 'بناء وحدات مخصصة وتعديل الأنظمة لتناسب احتياجات الأعمال المعقدة.' : 'Building custom modules and adapting systems to complex business needs.'}
                </p>
                <ul className="space-y-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-center"><Shield className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 text-emerald-500" /> {dir === 'rtl' ? 'تطوير وحدات (Modules) مخصصة' : 'Custom Module Development'}</li>
                  <li className="flex items-center"><Shield className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 text-emerald-500" /> {dir === 'rtl' ? 'تكامل مع أنظمة خارجية (APIs)' : 'External API Integrations'}</li>
                  <li className="flex items-center"><Shield className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 text-emerald-500" /> {dir === 'rtl' ? 'أتمتة سير العمل والموافقات' : 'Workflow & Approval Automation'}</li>
                </ul>
              </motion.div>

              {/* Pillar 2 */}
              <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#151D2A] p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-purple-500/30 transition-all">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                  <Code className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 leading-snug">{dir === 'rtl' ? 'تحليل وتصميم النظم (BPMN)' : 'Systems Analysis & Design'}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  {dir === 'rtl' ? 'دراسة المتطلبات ورسم مخططات تدفق البيانات قبل كتابة سطر كود واحد.' : 'Studying requirements and mapping data flows before writing a single line of code.'}
                </p>
                <ul className="space-y-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-center"><Shield className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 text-emerald-500" /> {dir === 'rtl' ? 'تصميم مخططات DFD & ERD' : 'DFD & ERD Diagrams'}</li>
                  <li className="flex items-center"><Shield className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 text-emerald-500" /> {dir === 'rtl' ? 'تحليل متطلبات الأعمال' : 'Business Requirements Analysis'}</li>
                  <li className="flex items-center"><Shield className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 text-emerald-500" /> {dir === 'rtl' ? 'منهجية Agile Scrum' : 'Agile Scrum Methodology'}</li>
                </ul>
              </motion.div>

              {/* Pillar 3 */}
              <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#151D2A] p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-emerald-500/30 transition-all">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                  <Database className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 leading-snug">{dir === 'rtl' ? 'هيكلة قواعد البيانات (PostgreSQL)' : 'Cloud Database Architecture'}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  {dir === 'rtl' ? 'تصميم قواعد بيانات علائقية متينة تضمن سرعة الاستعلام وسلامة البيانات.' : 'Designing robust relational databases ensuring query speed and data integrity.'}
                </p>
                <ul className="space-y-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-center"><Shield className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 text-emerald-500" /> {dir === 'rtl' ? 'تصميم الجداول والعلاقات' : 'Schema & Relation Design'}</li>
                  <li className="flex items-center"><Shield className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 text-emerald-500" /> {dir === 'rtl' ? 'تحسين الأداء (Query Optimization)' : 'Query Performance Optimization'}</li>
                  <li className="flex items-center"><Shield className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 text-emerald-500" /> {dir === 'rtl' ? 'حلول قواعد البيانات السحابية' : 'Cloud Database Solutions'}</li>
                </ul>
              </motion.div>

              {/* Pillar 4 */}
              <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#151D2A] p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-cyan-500/30 transition-all">
                <div className="w-14 h-14 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center mb-6">
                  <BarChart className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 leading-snug">{dir === 'rtl' ? 'تحليل البيانات ولوحات القيادة' : 'Data Analytics & Dashboards'}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  {dir === 'rtl' ? 'تحويل البيانات الخام إلى لوحات قيادة بصرية تساعد في اتخاذ القرارات.' : 'Transforming raw data into visual dashboards for actionable insights.'}
                </p>
                <ul className="space-y-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-center"><Shield className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 text-emerald-500" /> {dir === 'rtl' ? 'تقارير Power BI تفاعلية' : 'Interactive Power BI Reports'}</li>
                  <li className="flex items-center"><Shield className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 text-emerald-500" /> {dir === 'rtl' ? 'معالجة البيانات بـ Python' : 'Data Processing with Python'}</li>
                  <li className="flex items-center"><Shield className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 text-emerald-500" /> {dir === 'rtl' ? 'مؤشرات الأداء الرئيسية (KPIs)' : 'KPI Monitoring'}</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        
        {/* Section 6.5: Testimonials */}
        {testimonials && testimonials.length > 0 && (
          <section className="py-24 bg-zinc-50 dark:bg-[#09090b] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                  {dir === 'rtl' ? 'توصيات العملاء' : 'Testimonials'}
                </h2>
                <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                  {dir === 'rtl' ? 'ماذا يقولون عن العمل معي.' : 'What people say about working with me.'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, idx) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white dark:bg-[#151D2A] p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative"
                  >
                    <Quote className="w-10 h-10 text-blue-500/20 absolute top-8 rtl:left-8 ltr:right-8" />
                    <p className="text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed relative z-10 text-lg">
                      "{language === 'ar' ? testimonial.reviewAr || testimonial.review : testimonial.review || testimonial.reviewAr}"
                    </p>
                    <div className="flex items-center mt-auto">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-xl mr-4 rtl:ml-4 rtl:mr-0 overflow-hidden shrink-0">
                        {testimonial.photo ? (
                          <img src={testimonial.photo} alt={testimonial.clientName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          (testimonial.clientName || 'U').charAt(0)
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white">{language === 'ar' ? testimonial.clientNameAr || testimonial.clientName : testimonial.clientName || testimonial.clientNameAr}</h4>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{language === 'ar' ? testimonial.positionAr || testimonial.position : testimonial.position || testimonial.positionAr}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 7: Hybrid About Teaser */}
        <section className="py-24 overflow-hidden relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-[#151D2A] rounded-[3rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden relative shadow-2xl p-12 lg:p-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mb-8 transform rotate-3">
                 <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight max-w-2xl">
                {dir === 'rtl' ? 'تفكير استراتيجي.. وعين بصرية' : 'Strategic Mind... and a Visual Eye'}
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed max-w-3xl">
                {dir === 'rtl' 
                  ? 'برمجتي تشبه لعبة الشطرنج، أخطط لعدة خطوات للأمام لتفادي الثغرات وتأمين الأنظمة. وبنفس الوقت، تدير عدستي في "أبو علاء للتصوير الرقمي" الجوانب البصرية بدقة. أجمع بين المنطق الصلب للهندسة، والإحساس الجمالي للواجهات.'
                  : 'My coding is like a game of chess; I plan steps ahead to prevent loopholes and secure systems. Simultaneously, my lens at "Abu Alaa Digital Photography" captures visual aesthetics with precision. I combine the hard logic of engineering with the artistic feel of user interfaces.'}
              </p>
              <Button variant="outline" size="lg" className="rounded-full w-fit" asChild>
                <Link to="/about">
                  {dir === 'rtl' ? 'تعرف علي أكثر' : 'Know More About Me'}
                  <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Section 8: Footer CTA (Interactive Contact Form) */}
        <section className="py-24 bg-zinc-50 dark:bg-[#09090b] relative mt-auto border-t border-zinc-200 dark:border-zinc-800">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] dark:opacity-[0.05]" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                {dir === 'rtl' ? 'هل لديك مشروع أو نظام؟' : 'Have a project or system?'}
              </h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-400">
                {dir === 'rtl' ? 'أرسل لي التفاصيل وسأتواصل معك في أقرب وقت لتحليل متطلباتك.' : 'Send me the details and I will contact you soon to analyze your requirements.'}
              </p>
            </div>
            
            <form onSubmit={handleContactSubmit} className="bg-white dark:bg-[#151D2A] p-8 md:p-10 rounded-[2rem] shadow-xl border border-zinc-200 dark:border-zinc-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={dir === 'rtl' ? 'الاسم الكريم' : 'Your Name'}
                    className="w-full px-6 py-4 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder={dir === 'rtl' ? 'البريد الإلكتروني' : 'Email Address'}
                    className="w-full px-6 py-4 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="mb-8">
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder={dir === 'rtl' ? 'حدثني عن مشروعك أو النظام الذي تود بناءه...' : 'Tell me about your project or the system you want to build...'}
                  className="w-full px-6 py-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-zinc-900 dark:text-white resize-none"
                />
              </div>
              <Button type="submit" size="lg" className="w-full rounded-full py-6 text-lg font-bold shadow-lg hover:shadow-blue-500/25 transition-all" disabled={isSubmitting}>
                {isSubmitting ? (dir === 'rtl' ? 'جاري الإرسال...' : 'Sending...') : (dir === 'rtl' ? 'إرسال الرسالة' : 'Send Message')}
                {!isSubmitting && <Send className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0" />}
              </Button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
