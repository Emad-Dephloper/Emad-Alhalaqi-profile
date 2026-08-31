import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export default function SkillsAdmin() {
  const { language } = useLanguage();
  const [skills, setSkills] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    try {
      const data = await fetchApi('/admin/skills');
      setSkills(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSkill.name || !currentSkill.category) return;
    
    try {
      if (currentSkill.id) {
        await fetchApi(`/admin/skills/${currentSkill.id}`, {
          method: 'PUT',
          body: JSON.stringify(currentSkill)
        });
      } else {
        await fetchApi('/admin/skills', {
          method: 'POST',
          body: JSON.stringify(currentSkill)
        });
      }
      setIsEditing(false);
      setCurrentSkill({});
      fetchSkills();
    } catch (e: any) {
      console.error(e);
      alert(language === 'ar' ? `فشل في حفظ المهارة: ${e?.message || 'يرجى التحقق من المدخلات'}` : `Failed to save skill: ${e?.message || 'Please check inputs'}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      try {
        await fetchApi(`/admin/skills/${id}`, { method: 'DELETE' });
        fetchSkills();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const openEditor = (skill?: any) => {
    if (skill) {
      setCurrentSkill({ ...skill });
    } else {
      setCurrentSkill({ level: 50, visible: true, orderIndex: 0 });
    }
    setIsEditing(true);
  };

  if (loading) return <div>{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>;

  if (isEditing) {
    return (
      <div className="glass p-8 rounded-3xl max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{currentSkill.id ? 'Edit Skill' : 'New Skill'}</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name (English)</label>
              <input required type="text" value={currentSkill.name || ''} onChange={e => setCurrentSkill({...currentSkill, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50" />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className="text-sm font-medium">الاسم (عربي)</label>
              <input type="text" value={currentSkill.nameAr || ''} onChange={e => setCurrentSkill({...currentSkill, nameAr: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category (English)</label>
              <input required type="text" value={currentSkill.category || ''} onChange={e => setCurrentSkill({...currentSkill, category: e.target.value})} placeholder="Frontend, Backend, etc." className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50" />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className="text-sm font-medium">التصنيف (عربي)</label>
              <input type="text" value={currentSkill.categoryAr || ''} onChange={e => setCurrentSkill({...currentSkill, categoryAr: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Level (%)</label>
            <input type="number" min="1" max="100" value={currentSkill.level || 50} onChange={e => setCurrentSkill({...currentSkill, level: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Icon Name (lucide-react)</label>
            <input type="text" value={currentSkill.icon || ''} onChange={e => setCurrentSkill({...currentSkill, icon: e.target.value})} placeholder="e.g. Code2, Database" className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50" />
          </div>
          <div className="flex items-center space-x-2">
             <input type="checkbox" id="visible" checked={currentSkill.visible !== false} onChange={e => setCurrentSkill({...currentSkill, visible: e.target.checked})} className="w-4 h-4" />
             <label htmlFor="visible" className="text-sm font-medium">{language === 'ar' ? 'مرئي' : 'Visible'}</label>
          </div>
          <Button type="submit" className="w-full rounded-full">
            <Save className="w-4 h-4 mr-2" /> Save Skill
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-zinc-500 dark:text-[#a1a1aa] mt-2">Manage your technical skills.</p>
        </div>
        <Button onClick={() => openEditor()} className="rounded-full">
          <Plus className="w-4 h-4 mr-2" /> Add Skill
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map(skill => (
          <div key={skill.id} className="glass p-6 rounded-3xl flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs text-blue-500 font-semibold uppercase tracking-wider mb-1 block">{skill.category}</span>
                <h3 className="font-bold text-lg">{skill.name}</h3>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditor(skill)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(skill.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1 text-zinc-500">
                <span>Proficiency</span>
                <span>{skill.level}%</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${skill.level}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
