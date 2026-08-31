import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Save } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { uploadFile } from '../../lib/upload';

export default function SettingsAdmin() {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<any>({
    hero: { greeting: '', greetingAr: '', name: '', nameAr: '', roles: [], rolesAr: [], description: '', descriptionAr: '', downloadCV: '', viewProjects: '' },
    about: { title: '', titleAr: '', subtitle: '', subtitleAr: '', journey: '', journeyAr: '' },
    contact: { email: '', phone: '', location: '', locationAr: '', title: '', titleAr: '', subtitle: '', subtitleAr: '' },
    profileImage: '',
    cvFile: ''
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchApi('/settings').then(data => {
      const formatted: any = {};
      data.forEach((s: any) => {
        formatted[s.key] = s.value;
      });
      setSettings((prev: any) => ({ ...prev, ...formatted }));
      setLoading(false);
    }).catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/admin/settings/hero', { method: 'PUT', body: JSON.stringify({ value: settings.hero || {} }) });
      await fetchApi('/admin/settings/about', { method: 'PUT', body: JSON.stringify({ value: settings.about || {} }) });
      await fetchApi('/admin/settings/contact', { method: 'PUT', body: JSON.stringify({ value: settings.contact || {} }) });
      await fetchApi('/admin/settings/profileImage', { method: 'PUT', body: JSON.stringify({ value: settings.profileImage || '' }) });
      await fetchApi('/admin/settings/cvFile', { method: 'PUT', body: JSON.stringify({ value: settings.cvFile || '' }) });
      alert(language === 'ar' ? 'تم حفظ الإعدادات بنجاح!' : 'Settings saved successfully!');
    } catch (e: any) {
      console.error(e);
      alert(language === 'ar' ? `فشل في حفظ الإعدادات: ${e?.message || 'يرجى المحاولة مجدداً'}` : `Failed to save settings: ${e?.message || 'Please try again'}`);
    }
  };

  const handleFileUpload = async (file: File, key: string) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, `settings/${Date.now()}_${file.name}`);
      setSettings((prev: any) => ({ ...prev, [key]: url }));
    } catch (e) {
      console.error(e);
      alert('Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{language === 'ar' ? 'الإعدادات العامة' : 'Global Settings'}</h1>
        <p className="text-zinc-500 dark:text-[#a1a1aa] mt-2">{language === 'ar' ? 'إدارة محتوى الموقع والملفات العامة.' : 'Manage website content and global assets.'}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
        <div className="glass p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold border-b border-zinc-200 dark:border-zinc-800 pb-2">{language === 'ar' ? 'القسم الرئيسي' : 'Hero Section'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === 'ar' ? 'التحية' : 'Greeting'}</label>
              <input type="text" value={settings.hero?.greeting || ''} onChange={e => setSettings({...settings, hero: {...settings.hero, greeting: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === 'ar' ? 'الاسم' : 'Name'}</label>
              <input type="text" value={settings.hero?.name || ''} onChange={e => setSettings({...settings, hero: {...settings.hero, name: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Roles (comma separated)</label>
              <input type="text" value={settings.hero?.roles?.join(', ') || ''} onChange={e => setSettings({...settings, hero: {...settings.hero, roles: e.target.value.split(',').map(r => r.trim())}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">{language === 'ar' ? 'الوصف' : 'Description'}</label>
              <textarea rows={3} value={settings.hero?.description || ''} onChange={e => setSettings({...settings, hero: {...settings.hero, description: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold border-b border-zinc-200 dark:border-zinc-800 pb-2">{language === 'ar' ? 'قسم حول' : 'About Section'}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title (English)</label>
                <input type="text" value={settings.about?.title || ''} onChange={e => setSettings({...settings, about: {...settings.about, title: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-2" dir="rtl">
                <label className="text-sm font-medium">العنوان (عربي)</label>
                <input type="text" value={settings.about?.titleAr || ''} onChange={e => setSettings({...settings, about: {...settings.about, titleAr: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtitle (English)</label>
                <textarea rows={2} value={settings.about?.subtitle || ''} onChange={e => setSettings({...settings, about: {...settings.about, subtitle: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-2" dir="rtl">
                <label className="text-sm font-medium">العنوان الفرعي (عربي)</label>
                <textarea rows={2} value={settings.about?.subtitleAr || ''} onChange={e => setSettings({...settings, about: {...settings.about, subtitleAr: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Journey Text (English)</label>
                <textarea rows={5} value={settings.about?.journey || ''} onChange={e => setSettings({...settings, about: {...settings.about, journey: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-2" dir="rtl">
                <label className="text-sm font-medium">نص المسيرة (عربي)</label>
                <textarea rows={5} value={settings.about?.journeyAr || ''} onChange={e => setSettings({...settings, about: {...settings.about, journeyAr: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold border-b border-zinc-200 dark:border-zinc-800 pb-2">{language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
              <input type="email" value={settings.contact?.email || ''} onChange={e => setSettings({...settings, contact: {...settings.contact, email: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
              <input type="text" value={settings.contact?.phone || ''} onChange={e => setSettings({...settings, contact: {...settings.contact, phone: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
                        <div className="space-y-2">
              <label className="text-sm font-medium">Page Title (English)</label>
              <input type="text" value={settings.contact?.title || ''} onChange={e => setSettings({...settings, contact: {...settings.contact, title: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className="text-sm font-medium">العنوان الرئيسي للصفحة (عربي)</label>
              <input type="text" value={settings.contact?.titleAr || ''} onChange={e => setSettings({...settings, contact: {...settings.contact, titleAr: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle (English)</label>
              <textarea rows={2} value={settings.contact?.subtitle || ''} onChange={e => setSettings({...settings, contact: {...settings.contact, subtitle: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className="text-sm font-medium">العنوان الفرعي (عربي)</label>
              <textarea rows={2} value={settings.contact?.subtitleAr || ''} onChange={e => setSettings({...settings, contact: {...settings.contact, subtitleAr: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Location (English)</label>
              <input type="text" value={settings.contact?.location || ''} onChange={e => setSettings({...settings, contact: {...settings.contact, location: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className="text-sm font-medium">الموقع / العنوان (عربي)</label>
              <input type="text" value={settings.contact?.locationAr || ''} onChange={e => setSettings({...settings, contact: {...settings.contact, locationAr: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold border-b border-zinc-200 dark:border-zinc-800 pb-2">{language === 'ar' ? 'الوسائط والملفات' : 'Media & Files'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium block">{language === 'ar' ? 'رابط الصورة الشخصية أو رفعها' : 'Profile Image URL or Upload'}</label>
              {settings.profileImage && (
                <div className="mb-4">
                  <img src={settings.profileImage} alt="Profile" className="w-32 h-32 object-cover rounded-full border-2 border-zinc-200" />
                </div>
              )}
              <input type="text" placeholder="https://example.com/profile.jpg" value={settings.profileImage || ''} onChange={e => setSettings({...settings, profileImage: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 mb-2" />
              <input type="file" accept="image/*" onChange={e => e.target.files && handleFileUpload(e.target.files[0], 'profileImage')} className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium block">CV / Resume (PDF) URL or Upload</label>
              {settings.cvFile && (
                <div className="mb-4">
                  <a href={settings.cvFile} target="_blank" rel="noreferrer" className="text-blue-500 underline text-sm">View Current CV</a>
                </div>
              )}
              <input type="text" placeholder="https://example.com/resume.pdf" value={settings.cvFile || ''} onChange={e => setSettings({...settings, cvFile: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 mb-2" />
              <input type="file" accept=".pdf" onChange={e => e.target.files && handleFileUpload(e.target.files[0], 'cvFile')} className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={uploading} className="w-full rounded-full" size="lg">
          <Save className="w-4 h-4 mr-2" /> {uploading ? 'Uploading...' : 'Save All Settings'}
        </Button>
      </form>
    </div>
  );
}
