import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export default function ServicesAdmin() {
  const { language } = useLanguage();
  const [services, setServices] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const data = await fetchApi('/admin/services');
      setServices(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService.title || !currentService.description) return;
    
    try {
      if (currentService.id) {
        await fetchApi(`/admin/services/${currentService.id}`, {
          method: 'PUT',
          body: JSON.stringify(currentService)
        });
      } else {
        await fetchApi('/admin/services', {
          method: 'POST',
          body: JSON.stringify(currentService)
        });
      }
      setIsEditing(false);
      setCurrentService({});
      fetchServices();
    } catch (e: any) {
      console.error(e);
      alert(language === 'ar' ? `فشل في حفظ الخدمة: ${e?.message || 'يرجى التحقق من المدخلات'}` : `Failed to save service: ${e?.message || 'Please check inputs'}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await fetchApi(`/admin/services/${id}`, { method: 'DELETE' });
        fetchServices();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const openEditor = (service?: any) => {
    if (service) {
      setCurrentService({ ...service });
    } else {
      setCurrentService({ features: [], visible: true, orderIndex: 0 });
    }
    setIsEditing(true);
  };

  if (loading) return <div>{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>;

  if (isEditing) {
    return (
      <div className="glass p-8 rounded-3xl max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{currentService.id ? 'Edit Service' : 'New Service'}</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title (English)</label>
              <input required type="text" value={currentService.title || ''} onChange={e => setCurrentService({...currentService, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className="text-sm font-medium">العنوان (عربي)</label>
              <input type="text" value={currentService.titleAr || ''} onChange={e => setCurrentService({...currentService, titleAr: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (English)</label>
              <textarea required rows={3} value={currentService.description || ''} onChange={e => setCurrentService({...currentService, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className="text-sm font-medium">الوصف (عربي)</label>
              <textarea rows={3} value={currentService.descriptionAr || ''} onChange={e => setCurrentService({...currentService, descriptionAr: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Features (English, comma separated)</label>
              <textarea rows={3} value={currentService.features?.join(', ') || ''} onChange={e => setCurrentService({...currentService, features: e.target.value.split(',').map((f: string) => f.trim()).filter(Boolean)})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className="text-sm font-medium">المميزات (عربي، مفصولة بفاصلة)</label>
              <textarea rows={3} value={currentService.featuresAr?.join('، ') || ''} onChange={e => setCurrentService({...currentService, featuresAr: e.target.value.split(/[،,]/).map((f: string) => f.trim()).filter(Boolean)})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
             <input type="checkbox" id="visible" checked={currentService.visible} onChange={e => setCurrentService({...currentService, visible: e.target.checked})} className="w-4 h-4" />
             <label htmlFor="visible" className="text-sm font-medium rtl:mr-2">Visible</label>
          </div>
          <Button type="submit" className="w-full rounded-full">
            <Save className="w-4 h-4 mr-2" /> Save Service
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-zinc-500 dark:text-[#a1a1aa] mt-2">Manage the services you offer.</p>
        </div>
        <Button onClick={() => openEditor()} className="rounded-full">
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map(service => (
          <div key={service.id} className="glass p-8 rounded-3xl flex flex-col relative group">
            <div className="absolute top-6 right-6 flex gap-2 opacity-100 transition-opacity">
              <Button variant="outline" size="sm" onClick={() => openEditor(service)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 pr-16">{service.title}</h3>
            <p className="text-zinc-600 dark:text-[#a1a1aa] mb-6 flex-grow">{service.description}</p>
            
            <ul className="space-y-2 border-t border-zinc-200 dark:border-white/10 pt-6">
              {service.features?.map((feature: string, i: number) => (
                <li key={i} className="flex items-center text-sm font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
