import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { Server, Layout, Database, Bot, ArrowRight, ShieldCheck, Zap, LineChart, Globe, BarChart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { fetchApi } from '../lib/api';
import { Link } from 'react-router-dom';

const iconMap: Record<string, any> = {
  Database,
  Server,
  Layout,
  Bot,
  Zap,
  LineChart,
  Globe,
  BarChart
};

export default function Services() {
  const { t, dir, language } = useLanguage();
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/services').then(setServices).catch(console.error);
  }, []);

  return (
    <>
      <SEO title={t.nav.services} />
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{language === 'ar' ? 'الخدمات الاحترافية' : 'Professional Services'}</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {language === 'ar' ? 'تقديم حلول تقنية عالية الجودة مصممة لتلبية احتياجات الأعمال. من الهيكلة الأولية إلى النشر في بيئة الإنتاج.' : 'Delivering high-quality technical solutions tailored to business needs. From initial architecture to production deployment.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 rounded-3xl group hover:border-blue-500/50 transition-colors flex flex-col"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-6">
                {(() => {
                  const IconComp = service.icon && iconMap[service.icon] ? iconMap[service.icon] : iconMap.Server;
                  return <IconComp className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
                })()}
              </div>
              <h3 className="text-2xl font-bold mb-2">{language === 'ar' && service.titleAr ? service.titleAr : service.title}</h3>
              {service.pricePlaceholder && (
                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-4">{service.pricePlaceholder}</p>
              )}
              <p className="text-zinc-600 dark:text-zinc-400 mb-6 flex-grow leading-relaxed whitespace-pre-line">
                {language === 'ar' && service.descriptionAr ? service.descriptionAr : service.description}
              </p>
              <ul className="space-y-3 mb-8">
                {(language === 'ar' && service.featuresAr && service.featuresAr.length > 0 ? service.featuresAr : service.features)?.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 mt-1 mr-2 rtl:ml-2 rtl:mr-0 flex-shrink-0" />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-200 dark:group-hover:border-blue-800 mt-auto" asChild>
                <Link to="/contact">
                  {dir === 'rtl' ? 'مناقشة مشروعك' : 'Discuss Project'} <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Workflow / Process */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-12">How We Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery', desc: 'Understanding requirements and business goals.' },
              { step: '02', title: 'Architecture', desc: 'Designing scalable and robust systems.' },
              { step: '03', title: 'Development', desc: 'Writing clean, testable, and efficient code.' },
              { step: '04', title: 'Deployment', desc: 'Secure launch and continuous maintenance.' }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-5xl font-black text-zinc-100 dark:text-zinc-800 mb-4">{item.step}</div>
                <h4 className="text-xl font-bold mb-2 relative z-10 -mt-8">{item.title}</h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">{item.desc}</p>
                {idx < 3 && <div className="hidden md:block absolute top-6 right-0 w-full h-[2px] bg-zinc-200 dark:bg-zinc-800 transform translate-x-1/2"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
