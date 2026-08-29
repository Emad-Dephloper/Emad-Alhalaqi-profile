import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Plus, Edit, Trash2, X, Save, Upload } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { uploadFile } from '../../lib/upload';

export default function ProjectsAdmin() {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchProjects = async () => {
    try {
      const data = await fetchApi('/admin/projects');
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject.title || !currentProject.category || !currentProject.slug) return;
    
    try {
      if (currentProject.id) {
        await fetchApi(`/admin/projects/${currentProject.id}`, {
          method: 'PUT',
          body: JSON.stringify(currentProject)
        });
      } else {
        await fetchApi('/admin/projects', {
          method: 'POST',
          body: JSON.stringify(currentProject)
        });
      }
      setIsEditing(false);
      setCurrentProject({});
      fetchProjects();
    } catch (e) {
      console.error(e);
      alert('Failed to save project. Make sure slug is unique.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await fetchApi(`/admin/projects/${id}`, { method: 'DELETE' });
        fetchProjects();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const openEditor = (project?: any) => {
    if (project) {
      setCurrentProject({ ...project });
    } else {
      setCurrentProject({ tags: [], technologies: [], images: [], slug: `project-${Date.now()}` });
    }
    setIsEditing(true);
  };

  if (loading) return <div>{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>;

  if (isEditing) {
    return (
      <div className="glass p-8 rounded-3xl max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{currentProject.id ? 'Edit Project' : 'New Project'}</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title (English)</label>
              <input required type="text" value={currentProject.title || ''} onChange={e => setCurrentProject({...currentProject, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className="text-sm font-medium">العنوان (عربي)</label>
              <input type="text" value={currentProject.titleAr || ''} onChange={e => setCurrentProject({...currentProject, titleAr: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug (Unique URL)</label>
              <input required type="text" value={currentProject.slug || ''} onChange={e => setCurrentProject({...currentProject, slug: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <input type="text" value={currentProject.tags?.join(', ') || ''} onChange={e => setCurrentProject({...currentProject, tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean)})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category (English)</label>
              <input required type="text" value={currentProject.category || ''} onChange={e => setCurrentProject({...currentProject, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className="text-sm font-medium">التصنيف (عربي)</label>
              <input type="text" value={currentProject.categoryAr || ''} onChange={e => setCurrentProject({...currentProject, categoryAr: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Image URLs (comma separated)</label>
              {currentProject.images?.[0] && (
                <div className="mb-2">
                  <img src={currentProject.images[0]} alt="Cover" className="w-full h-32 object-cover rounded-xl" />
                </div>
              )}
              <input type="text" placeholder="https://example.com/image.jpg" value={currentProject.images?.join(', ') || ''} onChange={e => setCurrentProject({...currentProject, images: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean)})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2" />
              <input type="file" accept="image/*" onChange={async (e) => {
                if (e.target.files?.[0]) {
                  setUploading(true);
                  try {
                    const url = await uploadFile(e.target.files[0], `projects/${Date.now()}_${e.target.files[0].name}`);
                    const currentImages = currentProject.images || [];
                    setCurrentProject({...currentProject, images: [url, ...currentImages]});
                  } catch (err) {
                    console.error(err);
                    alert('Upload failed. Please check Firebase Storage rules and config.');
                  } finally {
                    setUploading(false);
                  }
                }
              }} className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (English)</label>
              <textarea required rows={4} value={currentProject.description || ''} onChange={e => setCurrentProject({...currentProject, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2" dir="rtl">
              <label className="text-sm font-medium">الوصف (عربي)</label>
              <textarea rows={4} value={currentProject.descriptionAr || ''} onChange={e => setCurrentProject({...currentProject, descriptionAr: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === 'ar' ? 'عنوان السيو' : 'SEO Meta Title'}</label>
              <input type="text" value={currentProject.seoMetadata?.title || ''} onChange={e => setCurrentProject({...currentProject, seoMetadata: {...(currentProject.seoMetadata || {}), title: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === 'ar' ? 'كلمات السيو' : 'SEO Keywords'}</label>
              <input type="text" value={currentProject.seoMetadata?.keywords || ''} onChange={e => setCurrentProject({...currentProject, seoMetadata: {...(currentProject.seoMetadata || {}), keywords: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">{language === 'ar' ? 'وصف السيو' : 'SEO Meta Description'}</label>
              <textarea rows={2} value={currentProject.seoMetadata?.description || ''} onChange={e => setCurrentProject({...currentProject, seoMetadata: {...(currentProject.seoMetadata || {}), description: e.target.value}})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>
          <Button type="submit" disabled={uploading} className="w-full rounded-full">
            <Save className="w-4 h-4 mr-2" /> {uploading ? 'Uploading...' : 'Save Project'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{language === 'ar' ? 'المشاريع' : 'Projects'}</h1>
          <p className="text-zinc-500 dark:text-[#a1a1aa] mt-2">{language === 'ar' ? 'إدارة مشاريع معرض الأعمال.' : 'Manage your portfolio projects.'}</p>
        </div>
        <Button onClick={() => openEditor()} className="rounded-full">
          <Plus className="w-4 h-4 mr-2" />{language === 'ar' ? 'إضافة مشروع' : 'Add Project'}</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="glass rounded-3xl overflow-hidden flex flex-col">
            <div className="aspect-video relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              {project.images?.[0] ? (
                <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">No Image</div>
              )}
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-xs text-blue-500 font-semibold uppercase tracking-wider mb-2">{project.category}</span>
              <h3 className="font-bold text-lg mb-2">{project.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-[#a1a1aa] line-clamp-2 mb-4 flex-grow">{project.description}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-zinc-200 dark:border-white/10 mt-auto">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditor(project)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
