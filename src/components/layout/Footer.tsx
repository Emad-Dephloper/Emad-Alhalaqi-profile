import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Github, Linkedin, Youtube, Instagram, Facebook, Link as LinkIcon, Globe, MessageCircle, AtSign, Send, FileText } from 'lucide-react';
import { XIcon, TikTokIcon, MediumIcon } from '../icons';
import { fetchApi } from '../../lib/api';

export function Footer() {
  const { language } = useLanguage();
  const name = language === 'en' ? 'Emad Alhalaqi' : 'عماد الحلقي';
  
  const [socialLinks, setSocialLinks] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/social-links')
      .then(data => setSocialLinks(data.filter((l: any) => l.visible && l.icon !== 'post')))
      .catch(console.error);
  }, []);

  return (
    <footer className="bg-white dark:bg-[#09090b] border-t border-zinc-200 dark:border-white/10 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold tracking-tighter mb-4">{name}</h3>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-sm mb-6">
              {language === 'en' 
                ? 'Building premium digital experiences and scalable enterprise solutions.'
                : 'أبني تجارب رقمية احترافية وحلول مؤسسية قابلة للتطوير.'}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse flex-wrap gap-y-2">
              {socialLinks.map((social, idx) => {
                const Icon = (() => {
                  switch (social.icon) {
                    case 'github': return Github;
                    case 'linkedin': return Linkedin;
                    case 'twitter': return XIcon;
                    case 'youtube': return Youtube;
                    case 'instagram': return Instagram;
                    case 'facebook': return Facebook;
                    case 'whatsapp': return MessageCircle;
                    case 'threads': return AtSign;
                    case 'tiktok': return TikTokIcon;
                    case 'medium': return MediumIcon;
                    case 'telegram': return Send;
                    case 'website': return Globe;
                    default: return LinkIcon;
                  }
                })();
                return (
                  <a key={social.id || idx} href={social.url} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" title={social.platform}>
                    <span className="sr-only">{social.platform}</span>
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{language === 'en' ? 'Explore' : 'استكشف'}</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><a href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">{language === 'en' ? 'About' : 'عني'}</a></li>
              <li><a href="/portfolio" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">{language === 'en' ? 'Portfolio' : 'أعمالي'}</a></li>
              <li><a href="/services" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">{language === 'en' ? 'Services' : 'خدماتي'}</a></li>
              <li><a href="/blog" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">{language === 'en' ? 'Blog' : 'المدونة'}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{language === 'en' ? 'Legal' : 'قانوني'}</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">{language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}</a></li>
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">{language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} {name}. {language === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}</p>
        </div>
      </div>
    </footer>
  );
}
