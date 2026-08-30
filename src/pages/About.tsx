import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/SEO';
import { Code2, Target, Lightbulb, Users, Shield, Server, Database } from 'lucide-react';
import { fetchApi } from '../lib/api';
import { Skeleton } from '../components/ui/Skeleton';

const iconMap: Record<string, any> = {
  Code2, Target, Lightbulb, Users, Shield, Server, Database
};

export default function About() {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState<any>({});
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi('/settings').then(data => {
        const formatted: any = {};
        data.forEach((s: any) => { formatted[s.key] = s.value; });
        setSettings(formatted);
      }),
      fetchApi('/skills').then(data => setSkills(data.filter((s: any) => s.visible)))
    ])
    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  const aboutData = settings.about?.title ? settings.about : t.about;
  
  // Group skills by category
  const skillsByCategory = skills.reduce((acc: any, skill: any) => {
    const cat = language === 'ar' && skill.categoryAr ? skill.categoryAr : skill.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <>
      <SEO title={(language === 'ar' && aboutData.titleAr) ? aboutData.titleAr : (aboutData.title || t.nav.about)} />
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{language === 'ar' && aboutData.titleAr ? aboutData.titleAr : aboutData.title}</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {language === 'ar' && aboutData.subtitleAr ? aboutData.subtitleAr : aboutData.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6">{language === 'ar' ? 'رحلتي المهنية' : 'My Journey'}</h2>
            <div className="prose dark:prose-invert text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
              {(language === 'ar' && aboutData.journeyAr ? aboutData.journeyAr : aboutData.journey) || (
                <>
                  {language === 'ar' ? (
                    <>
                      <p className="mb-4">
                        كمهندس برمجيات متخصص في بايثون وأنظمة تخطيط موارد المؤسسات (Odoo ERP)، قضيت السنوات القليلة الماضية في هندسة وتطوير تطبيقات مؤسسية قوية وموثوقة.
                      </p>
                      <p className="mb-4">
                        يجمع نهجي بين قوة البنية التحتية الخلفية وواجهات المستخدم العصرية والنظيفة. أؤمن بأن البرمجيات القوية يجب أن تكون سهلة الاستخدام ومتاحة للجميع.
                      </p>
                      <p>
                        أستكشف حالياً تقاطعات الذكاء الاصطناعي مع برمجيات المؤسسات التقليدية، لبناء أدوات مدمجة بالذكاء الاصطناعي تعمل على تحسين سير العمل وتعزيز عملية اتخاذ القرارات.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mb-4">
                        As a Software Engineer with a deep specialization in Python and Odoo ERP systems, I have spent the last several years architecting and deploying robust enterprise applications.
                      </p>
                      <p className="mb-4">
                        My approach combines strong backend logic with clean, modern frontend interfaces. I believe that powerful software should also be intuitive and accessible.
                      </p>
                      <p>
                        Currently, I am exploring the intersections of Artificial Intelligence and traditional enterprise software, building AI-integrated tools that optimize workflows and enhance decision-making.
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {[
              { icon: Target, title: language === 'ar' ? 'المهمة' : 'Mission', desc: language === 'ar' ? 'تقديم حلول قابلة للتطوير وعالية الأداء.' : 'Deliver scalable, high-performance solutions.' },
              { icon: Lightbulb, title: language === 'ar' ? 'الرؤية' : 'Vision', desc: language === 'ar' ? 'الابتكار عند تقاطع الذكاء الاصطناعي وأنظمة المؤسسات.' : 'Innovate at the intersection of AI and ERP.' },
              { icon: Code2, title: language === 'ar' ? 'الهندسة' : 'Engineering', desc: language === 'ar' ? 'كود نظيف، قابل للصيانة، ومختبر.' : 'Clean, maintainable, and tested code.' },
              { icon: Users, title: language === 'ar' ? 'التعاون' : 'Collaboration', desc: language === 'ar' ? 'العمل عن كثب مع الفرق لتحقيق الأهداف.' : 'Work closely with teams to achieve goals.' }
            ].map((item, idx) => (
              <div key={idx} className="glass p-6 rounded-2xl">
                <item.icon className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold mb-12 text-center">{language === 'ar' ? 'الخبرات التقنية' : 'Technical Expertise'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass p-6 rounded-2xl">
                  <Skeleton className="w-1/2 h-6 mb-4" />
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="flex justify-between items-center">
                        <Skeleton className="w-2/3 h-4" />
                        <Skeleton className="w-6 h-4" />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : Object.keys(skillsByCategory).length > 0 ? (
              Object.keys(skillsByCategory).map((category, idx) => (
                <div key={idx} className="glass p-6 rounded-2xl">
                  <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    {category}
                  </h3>
                  <ul className="space-y-3">
                    {skillsByCategory[category].map((skill: any, i: number) => {
                      const Icon = skill.icon && iconMap[skill.icon] ? iconMap[skill.icon] : Code2;
                      return (
                        <li key={i} className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                          <div className="flex items-center">
                            <Icon className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-blue-500" />
                            {language === 'ar' && skill.nameAr ? skill.nameAr : skill.name}
                          </div>
                          {skill.level && (
                            <span className="text-xs font-semibold text-zinc-400">{skill.level}%</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-zinc-500">
                {language === 'ar' ? 'جاري تحديث المهارات. عد قريباً.' : 'Skills are currently being updated. Check back soon.'}
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </>
  );
}
