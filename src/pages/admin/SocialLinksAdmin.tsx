import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Plus, Edit, Trash2, X, Save, Github, Linkedin, Youtube, Instagram, Facebook, Link as LinkIcon, Globe, MessageCircle, AtSign, Send } from 'lucide-react';
import { XIcon, TikTokIcon, MediumIcon } from '../../components/icons';
import { fetchApi } from '../../lib/api';

export default function SocialLinksAdmin() {
  const { language } = useLanguage();
  const [links, setLinks] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLink, setCurrentLink] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const data = await fetchApi('/social-links');
      setLinks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLink.platform || !currentLink.url) return;
    
    try {
      if (currentLink.id) {
        await fetchApi(`/admin/social-links/${currentLink.id}`, {
          method: 'PUT',
          body: JSON.stringify(currentLink)
        });
      } else {
        await fetchApi('/admin/social-links', {
          method: 'POST',
          body: JSON.stringify(currentLink)
        });
      }
      setIsEditing(false);
      setCurrentLink({});
      fetchLinks();
    } catch (e) {
      console.error(e);
      alert('Failed to save social link.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this link?')) {
      try {
        await fetchApi(`/admin/social-links/${id}`, { method: 'DELETE' });
        fetchLinks();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const openEditor = (link?: any) => {
    if (link) {
      setCurrentLink({ ...link });
    } else {
      setCurrentLink({ visible: true, orderIndex: 0 });
    }
    setIsEditing(true);
  };

  if (loading) return <div>{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>;

  if (isEditing) {
    return (
      <div className="glass p-6 md:p-8 rounded-3xl max-w-2xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{currentLink.id ? (language === 'ar' ? 'تعديل الرابط' : 'Edit Link') : (language === 'ar' ? 'رابط جديد' : 'New Link')}</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'اسم المنصة' : 'Platform Name'}</label>
            <input required type="text" value={currentLink.platform || ''} onChange={e => setCurrentLink({...currentLink, platform: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'الأيقونة' : 'Icon'}</label>
            <select value={currentLink.icon || 'link'} onChange={e => setCurrentLink({...currentLink, icon: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white" value="facebook">Facebook (فيسبوك)</option>
              <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white" value="whatsapp">WhatsApp (واتساب)</option>
              <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white" value="instagram">Instagram (انستجرام)</option>
              <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white" value="threads">Threads (ثريدس)</option>
              <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white" value="twitter">X / Twitter (اكس)</option>
              <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white" value="tiktok">TikTok (تيك توك)</option>
              <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white" value="linkedin">LinkedIn (لينكد ان)</option>
              <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white" value="youtube">YouTube (يوتيوب)</option>
              <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white" value="telegram">Telegram (تيلجرام)</option>
              <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white" value="medium">Medium (ميديام)</option>
              <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white" value="github">GitHub (جيت هب)</option>
              <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white" value="website">Website (موقع)</option>
              <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white" value="post">Post (منشور)</option>
              <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white" value="link">Other (رابط آخر)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'الرابط' : 'URL'}</label>
            <input required type="url" value={currentLink.url || ''} onChange={e => setCurrentLink({...currentLink, url: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
             <input type="checkbox" id="visible" checked={currentLink.visible !== false} onChange={e => setCurrentLink({...currentLink, visible: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
             <label htmlFor="visible" className="text-sm font-medium">{language === 'ar' ? 'مرئي' : 'Visible'}</label>
          </div>
          <Button type="submit" className="w-full rounded-full">
            <Save className="w-4 h-4 mr-2" /> {language === 'ar' ? 'حفظ الرابط' : 'Save Link'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{language === 'ar' ? 'مواقع التواصل' : 'Social Links'}</h1>
          <p className="text-zinc-500 dark:text-[#a1a1aa] mt-2">{language === 'ar' ? 'إدارة تواجدك على مواقع التواصل.' : 'Manage your social media profiles.'}</p>
        </div>
        <Button onClick={() => openEditor()} className="rounded-full shrink-0">
          <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />{language === 'ar' ? 'إضافة رابط' : 'Add Link'}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map(link => (
          <div key={link.id} className="glass p-6 rounded-3xl flex flex-col justify-between w-full overflow-hidden">
            <div className="overflow-hidden">
                            <h3 className="font-bold text-lg capitalize mb-1 flex items-center gap-2">
                {(() => {
                  switch (link.icon) {
                    case 'github': return <Github className="w-5 h-5" />;
                    case 'linkedin': return <Linkedin className="w-5 h-5" />;
                    case 'twitter': return <XIcon className="w-5 h-5" />;
                    case 'youtube': return <Youtube className="w-5 h-5" />;
                    case 'instagram': return <Instagram className="w-5 h-5" />;
                    case 'facebook': return <Facebook className="w-5 h-5" />;
                    case 'whatsapp': return <MessageCircle className="w-5 h-5" />;
                    case 'threads': return <AtSign className="w-5 h-5" />;
                    case 'tiktok': return <TikTokIcon className="w-5 h-5" />;
                    case 'medium': return <MediumIcon className="w-5 h-5" />;
                    case 'telegram': return <Send className="w-5 h-5" />;
                    case 'website': return <Globe className="w-5 h-5" />;
                    default: return <LinkIcon className="w-5 h-5" />;
                  }
                })()}
                {link.platform}
              </h3>
              <p className="text-sm text-blue-500 truncate mb-4 w-full block">
                 <a href={link.url} target="_blank" rel="noreferrer" className="truncate w-full block">{link.url}</a>
              </p>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-zinc-200 dark:border-white/10 mt-auto shrink-0">
              <span className={`text-xs px-2 py-1 rounded-full ${link.visible ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'}`}>
                {link.visible ? (language === 'ar' ? 'مرئي' : 'Visible') : (language === 'ar' ? 'مخفي' : 'Hidden')}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditor(link)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(link.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
