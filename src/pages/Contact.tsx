import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Facebook, MessageCircle, AtSign, Globe, Youtube, Instagram, Link2 } from 'lucide-react';
import { XIcon, TikTokIcon, MediumIcon } from '../components/icons';
import { fetchApi } from '../lib/api';
import { Button } from '../components/ui/Button';

export default function Contact() {
  const { t, dir, language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [settings, setSettings] = useState<any>({});
  const [socialLinks, setSocialLinks] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetchApi('/settings'),
      fetchApi('/social-links')
    ]).then(([settingsData, linksData]) => {
      const formatted: any = {};
      settingsData.forEach((s: any) => { formatted[s.key] = s.value; });
      setSettings(formatted);
      setSocialLinks(linksData.filter((l: any) => l.visible));
    }).catch(console.error);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetchApi('/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      alert(dir === 'rtl' ? 'تم إرسال الرسالة بنجاح!' : 'Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert(dir === 'rtl' ? 'حدث خطأ أثناء إرسال الرسالة.' : 'Error sending message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <SEO title={t.nav.contact} />
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{(language === 'ar' && settings.contact?.titleAr ? settings.contact?.titleAr : settings.contact?.title) || (language === 'ar' ? 'تواصل معي' : 'Get In Touch')}</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {(language === 'ar' && settings.contact?.subtitleAr ? settings.contact?.subtitleAr : settings.contact?.subtitle) || (language === 'ar' ? 'مستعد للبدء بمشروع جديد أو تحتاج إلى استشارة؟ أرسل لي رسالة ودعنا نناقش كيف يمكننا العمل معاً.' : 'Ready to start a project or need consultation? Send me a message and let\'s discuss how we can work together.')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="glass p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-6">{language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4 rtl:ml-4 rtl:mr-0 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">{t.nav.contact || 'Email'}</h4>
                    {settings.contact?.email ? (
                      <a href={`mailto:${settings.contact.email}`} className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 transition-colors break-all">
                        {settings.contact.email}
                      </a>
                    ) : <span className="text-zinc-500">{language === 'ar' ? 'غير متوفر' : 'Not provided'}</span>}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-4 rtl:ml-4 rtl:mr-0 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</h4>
                    {settings.contact?.phone ? <a href={`tel:${settings.contact.phone}`} className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors">{settings.contact.phone}</a> : <span className="text-zinc-500">Not provided</span>}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mr-4 rtl:ml-4 rtl:mr-0 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">{language === 'ar' ? 'الموقع' : 'Location'}</h4>
                    <p className="text-zinc-600 dark:text-zinc-400">{(language === 'ar' && settings.contact?.locationAr ? settings.contact?.locationAr : settings.contact?.location) || (language === 'ar' ? 'غير متوفر' : 'Not provided')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <h4 className="font-semibold mb-4 text-zinc-900 dark:text-zinc-50">{language === 'ar' ? 'تابعني' : 'Follow Me'}</h4>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.filter(l => l.icon !== 'post').map(link => {
                    const iconMap: Record<string, any> = { 
                      github: Github, linkedin: Linkedin, twitter: XIcon, tiktok: TikTokIcon, medium: MediumIcon,
                      facebook: Facebook, whatsapp: MessageCircle, instagram: Instagram,
                      threads: AtSign, youtube: Youtube, telegram: Send, website: Globe, link: Link2 
                    };
                    const Icon = iconMap[link.icon] || Link2;
                    return (
                      <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-50 transition-all">
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{language === 'ar' ? 'الاسم الكريم' : 'Your Name'}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder={language === 'ar' ? 'جون دو' : 'John Doe'}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder={language === 'ar' ? 'john@example.com' : 'john@example.com'}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{language === 'ar' ? 'الموضوع' : 'Subject'}</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder={language === 'ar' ? 'كيف يمكنني مساعدتك؟' : 'How can I help you?'}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{language === 'ar' ? 'الرسالة' : 'Message'}</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  placeholder={language === 'ar' ? 'حدثني عن مشروعك...' : 'Tell me about your project...'}
                />
              </div>

              <Button type="submit" size="lg" className="w-full sm:w-auto rounded-full" disabled={isSubmitting}>
                {isSubmitting ? (language === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (language === 'ar' ? 'إرسال الرسالة' : 'Send Message')}
                {!isSubmitting && <Send className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}
