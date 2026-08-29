import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { Briefcase, GraduationCap, Download, MapPin, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { fetchApi } from '../lib/api';
import { Skeleton } from '../components/ui/Skeleton';

export default function Resume() {
  const { t, language } = useLanguage();
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi('/experience'),
      fetchApi('/education')
    ]).then(([expData, eduData]) => {
      // Sort by descending ID as a proxy for newest first, or you could add a sort order
      setExperience(expData.sort((a: any, b: any) => b.id - a.id));
      setEducation(eduData.sort((a: any, b: any) => b.id - a.id));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <SEO title={t.nav.resume} />
      <div className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Interactive Resume</h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              A timeline of my professional experience and education.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-shadow">
              <Download className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              Download PDF
            </Button>
          </motion.div>
        </div>

        <div className="space-y-16">
          {/* Experience Section */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold">Experience</h2>
            </div>
            
            <div className="relative border-l-2 border-zinc-200 dark:border-zinc-800 rtl:border-l-0 rtl:border-r-2 ml-4 rtl:ml-0 rtl:mr-4 pl-8 rtl:pl-0 rtl:pr-8 space-y-12">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-[41px] rtl:-left-auto rtl:-right-[41px] top-1 w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 border-4 border-white dark:border-[#09090b]" />
                    <div className="glass p-6 rounded-2xl">
                      <Skeleton className="w-1/2 h-6 mb-2" />
                      <Skeleton className="w-1/3 h-4 mb-4" />
                      <Skeleton className="w-full h-16" />
                    </div>
                  </div>
                ))
              ) : experience.map((exp, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <span className="absolute -left-[41px] rtl:-left-auto rtl:-right-[41px] top-1 w-5 h-5 rounded-full bg-blue-500 border-4 border-white dark:border-[#09090b]" />
                  <div className="glass p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-1">{language === 'ar' && exp.roleAr ? exp.roleAr : exp.role}</h3>
                    <div className="text-blue-600 dark:text-blue-400 font-medium mb-3">{language === 'ar' && exp.companyAr ? exp.companyAr : exp.company}</div>
                    <div className="flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                      {(exp.period || exp.periodAr) && <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" /> {language === 'ar' && exp.periodAr ? exp.periodAr : exp.period}</span>}
                      {(exp.location || exp.locationAr) && <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" /> {language === 'ar' && exp.locationAr ? exp.locationAr : exp.location}</span>}
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                      {language === 'ar' && exp.descriptionAr ? exp.descriptionAr : exp.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold">Education</h2>
            </div>
            
            <div className="relative border-l-2 border-zinc-200 dark:border-zinc-800 rtl:border-l-0 rtl:border-r-2 ml-4 rtl:ml-0 rtl:mr-4 pl-8 rtl:pl-0 rtl:pr-8 space-y-12">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-[41px] rtl:-left-auto rtl:-right-[41px] top-1 w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 border-4 border-white dark:border-[#09090b]" />
                    <div className="glass p-6 rounded-2xl">
                      <Skeleton className="w-1/2 h-6 mb-2" />
                      <Skeleton className="w-1/3 h-4 mb-4" />
                      <Skeleton className="w-full h-16" />
                    </div>
                  </div>
                ))
              ) : education.map((edu, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <span className="absolute -left-[41px] rtl:-left-auto rtl:-right-[41px] top-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white dark:border-[#09090b]" />
                  <div className="glass p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-1">{language === 'ar' && edu.degreeAr ? edu.degreeAr : edu.degree}</h3>
                    <div className="text-emerald-600 dark:text-emerald-400 font-medium mb-1">{language === 'ar' && edu.universityAr ? edu.universityAr : edu.university}</div>
                    {(edu.major || edu.majorAr) && <div className="text-sm font-medium mb-3 text-zinc-700 dark:text-zinc-300">{language === 'ar' && edu.majorAr ? edu.majorAr : edu.major}</div>}
                    <div className="flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                      {(edu.period || edu.periodAr) && <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" /> {language === 'ar' && edu.periodAr ? edu.periodAr : edu.period}</span>}
                      {(edu.location || edu.locationAr) && <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" /> {language === 'ar' && edu.locationAr ? edu.locationAr : edu.location}</span>}
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                      {language === 'ar' && edu.descriptionAr ? edu.descriptionAr : edu.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
