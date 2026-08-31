import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchApi } from '../../lib/api';
import { Briefcase, GraduationCap, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResumeAdmin() {
  const { t, language } = useLanguage();
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Experience Form
  const [expForm, setExpForm] = useState({ id: null, role: '', roleAr: '', company: '', companyAr: '', location: '', locationAr: '', period: '', periodAr: '', description: '', descriptionAr: '' });
  const [isEditingExp, setIsEditingExp] = useState(false);

  // Education Form
  const [eduForm, setEduForm] = useState({ id: null, degree: '', degreeAr: '', university: '', universityAr: '', location: '', locationAr: '', period: '', periodAr: '', description: '', descriptionAr: '', major: '', majorAr: '' });
  const [isEditingEdu, setIsEditingEdu] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expRes, eduRes] = await Promise.all([
        fetchApi('/admin/experience'),
        fetchApi('/admin/education')
      ]);
      setExperience(expRes);
      setEducation(eduRes);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (expForm.id) {
        await fetchApi(`/admin/experience/${expForm.id}`, {
          method: 'PUT',
          body: JSON.stringify(expForm)
        });
        toast.success('Experience updated');
      } else {
        await fetchApi('/admin/experience', {
          method: 'POST',
          body: JSON.stringify(expForm)
        });
        toast.success('Experience added');
      }
      setExpForm({ id: null, role: '', company: '', location: '', period: '', description: '' });
      setIsEditingExp(false);
      fetchData();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save experience');
    }
  };

  const handleDeleteExperience = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;
    try {
      await fetchApi(`/admin/experience/${id}`, { method: 'DELETE' });
      toast.success('Experience deleted');
      fetchData();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete experience');
    }
  };

  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (eduForm.id) {
        await fetchApi(`/admin/education/${eduForm.id}`, {
          method: 'PUT',
          body: JSON.stringify(eduForm)
        });
        toast.success('Education updated');
      } else {
        await fetchApi('/admin/education', {
          method: 'POST',
          body: JSON.stringify(eduForm)
        });
        toast.success('Education added');
      }
      setEduForm({ id: null, degree: '', university: '', location: '', period: '', description: '' });
      setIsEditingEdu(false);
      fetchData();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save education');
    }
  };

  const handleDeleteEducation = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this education?')) return;
    try {
      await fetchApi(`/admin/education/${id}`, { method: 'DELETE' });
      toast.success('Education deleted');
      fetchData();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete education');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Resume Management</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Manage your work experience and education.</p>
      </div>

      {/* Experience Section */}
      <section className="glass rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Experience</h2>
          </div>
          {!isEditingExp && (
            <button 
              onClick={() => setIsEditingExp(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center text-sm transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </button>
          )}
        </div>

        {isEditingExp && (
          <form onSubmit={handleSaveExperience} className="mb-8 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Role / Job Title</label>
                <input required type="text" value={expForm.role} onChange={(e) => setExpForm({...expForm, role: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div dir="rtl">
                <label className="block text-sm font-medium mb-1">المسمى الوظيفي</label>
                <input type="text" value={expForm.roleAr || ''} onChange={(e) => setExpForm({...expForm, roleAr: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input required type="text" value={expForm.company} onChange={(e) => setExpForm({...expForm, company: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div dir="rtl">
                <label className="block text-sm font-medium mb-1">الشركة</label>
                <input type="text" value={expForm.companyAr || ''} onChange={(e) => setExpForm({...expForm, companyAr: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input type="text" value={expForm.location} onChange={(e) => setExpForm({...expForm, location: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div dir="rtl">
                <label className="block text-sm font-medium mb-1">المكان</label>
                <input type="text" value={expForm.locationAr || ''} onChange={(e) => setExpForm({...expForm, locationAr: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Period (e.g. 2021 - Present)</label>
                <input type="text" value={expForm.period} onChange={(e) => setExpForm({...expForm, period: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div dir="rtl">
                <label className="block text-sm font-medium mb-1">المدة (مثال: 2021 - الحاضر)</label>
                <input type="text" value={expForm.periodAr || ''} onChange={(e) => setExpForm({...expForm, periodAr: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description (English)</label>
                <textarea rows={3} value={expForm.description} onChange={(e) => setExpForm({...expForm, description: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <div className="col-span-1 md:col-span-2" dir="rtl">
                <label className="block text-sm font-medium mb-1">الوصف (عربي)</label>
                <textarea rows={3} value={expForm.descriptionAr || ''} onChange={(e) => setExpForm({...expForm, descriptionAr: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setIsEditingExp(false); setExpForm({ id: null, role: '', roleAr: '', company: '', companyAr: '', location: '', locationAr: '', period: '', periodAr: '', description: '', descriptionAr: '' }); }} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save</button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="p-4 bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl flex justify-between items-start">
              <div>
                <h3 className="font-bold">{exp.role} <span className="text-zinc-500 font-normal">at {exp.company}</span></h3>
                <div className="text-sm text-zinc-500 mb-2">{exp.period} | {exp.location}</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{exp.description}</p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <button onClick={() => { setExpForm(exp); setIsEditingExp(true); }} className="p-2 text-zinc-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDeleteExperience(exp.id)} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {experience.length === 0 && !isEditingExp && (
            <div className="text-center py-8 text-zinc-500">No experience records found.</div>
          )}
        </div>
      </section>

      {/* Education Section */}
      <section className="glass rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Education</h2>
          </div>
          {!isEditingEdu && (
            <button 
              onClick={() => setIsEditingEdu(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center text-sm transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </button>
          )}
        </div>

        {isEditingEdu && (
          <form onSubmit={handleSaveEducation} className="mb-8 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Degree</label>
                <input required type="text" value={eduForm.degree} onChange={(e) => setEduForm({...eduForm, degree: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div dir="rtl">
                <label className="block text-sm font-medium mb-1">الدرجة العلمية</label>
                <input type="text" value={eduForm.degreeAr || ''} onChange={(e) => setEduForm({...eduForm, degreeAr: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Institution / University</label>
                <input required type="text" value={eduForm.university} onChange={(e) => setEduForm({...eduForm, university: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div dir="rtl">
                <label className="block text-sm font-medium mb-1">الجامعة / المؤسسة</label>
                <input type="text" value={eduForm.universityAr || ''} onChange={(e) => setEduForm({...eduForm, universityAr: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Major (Optional)</label>
                <input type="text" value={eduForm.major || ''} onChange={(e) => setEduForm({...eduForm, major: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div dir="rtl">
                <label className="block text-sm font-medium mb-1">التخصص (اختياري)</label>
                <input type="text" value={eduForm.majorAr || ''} onChange={(e) => setEduForm({...eduForm, majorAr: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input type="text" value={eduForm.location} onChange={(e) => setEduForm({...eduForm, location: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div dir="rtl">
                <label className="block text-sm font-medium mb-1">المكان</label>
                <input type="text" value={eduForm.locationAr || ''} onChange={(e) => setEduForm({...eduForm, locationAr: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Period (e.g. 2012 - 2016)</label>
                <input type="text" value={eduForm.period} onChange={(e) => setEduForm({...eduForm, period: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div dir="rtl">
                <label className="block text-sm font-medium mb-1">المدة (مثال: 2012 - 2016)</label>
                <input type="text" value={eduForm.periodAr || ''} onChange={(e) => setEduForm({...eduForm, periodAr: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description (English)</label>
                <textarea rows={3} value={eduForm.description} onChange={(e) => setEduForm({...eduForm, description: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <div className="col-span-1 md:col-span-2" dir="rtl">
                <label className="block text-sm font-medium mb-1">الوصف (عربي)</label>
                <textarea rows={3} value={eduForm.descriptionAr || ''} onChange={(e) => setEduForm({...eduForm, descriptionAr: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setIsEditingEdu(false); setEduForm({ id: null, degree: '', degreeAr: '', university: '', universityAr: '', location: '', locationAr: '', period: '', periodAr: '', description: '', descriptionAr: '', major: '', majorAr: '' }); }} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">Save</button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id} className="p-4 bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl flex justify-between items-start">
              <div>
                <h3 className="font-bold">{edu.degree} <span className="text-zinc-500 font-normal">at {edu.university}</span></h3>
                <div className="text-sm text-zinc-500 mb-2">{edu.period} | {edu.location}</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{edu.description}</p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <button onClick={() => { setEduForm(edu); setIsEditingEdu(true); }} className="p-2 text-zinc-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDeleteEducation(edu.id)} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {education.length === 0 && !isEditingEdu && (
            <div className="text-center py-8 text-zinc-500">No education records found.</div>
          )}
        </div>
      </section>
    </div>
  );
}
