import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { uploadFile } from '../../lib/upload';

export default function TestimonialsAdmin() {
  const { language } = useLanguage();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const data = await fetchApi('/admin/testimonials');
      setTestimonials(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTestimonial.clientName || !currentTestimonial.review) return;
    
    try {
      if (currentTestimonial.id) {
        await fetchApi(`/admin/testimonials/${currentTestimonial.id}`, {
          method: 'PUT',
          body: JSON.stringify(currentTestimonial)
        });
      } else {
        await fetchApi('/admin/testimonials', {
          method: 'POST',
          body: JSON.stringify(currentTestimonial)
        });
      }
      setIsEditing(false);
      setCurrentTestimonial({});
      fetchTestimonials();
    } catch (e: any) {
      console.error(e);
      alert(language === 'ar' ? `فشل في حفظ التوصية: ${e?.message || 'يرجى التحقق من المدخلات'}` : `Failed to save testimonial: ${e?.message || 'Please check inputs'}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await fetchApi(`/admin/testimonials/${id}`, { method: 'DELETE' });
        fetchTestimonials();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const openEditor = (testimonial?: any) => {
    if (testimonial) {
      setCurrentTestimonial({ ...testimonial });
    } else {
      setCurrentTestimonial({ rating: 5, published: true });
    }
    setIsEditing(true);
  };

  if (loading) return <div>{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>;

  if (isEditing) {
    return (
      <div className="glass p-8 rounded-3xl max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{currentTestimonial.id ? 'Edit Testimonial' : 'New Testimonial'}</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Client Name</label>
              <input required type="text" value={currentTestimonial.clientName || ''} onChange={e => setCurrentTestimonial({...currentTestimonial, clientName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company</label>
              <input type="text" value={currentTestimonial.company || ''} onChange={e => setCurrentTestimonial({...currentTestimonial, company: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <input type="text" value={currentTestimonial.position || ''} onChange={e => setCurrentTestimonial({...currentTestimonial, position: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating (1-5)</label>
              <input type="number" min="1" max="5" value={currentTestimonial.rating || 5} onChange={e => setCurrentTestimonial({...currentTestimonial, rating: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Client Photo</label>
            {currentTestimonial.photo && (
              <div className="mb-2">
                <img src={currentTestimonial.photo} alt="Client" className="w-16 h-16 object-cover rounded-full" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={async (e) => {
              if (e.target.files?.[0]) {
                setUploading(true);
                try {
                  const url = await uploadFile(e.target.files[0], `testimonials/${Date.now()}_${e.target.files[0].name}`);
                  setCurrentTestimonial({...currentTestimonial, photo: url});
                } catch (err) {
                  console.error(err);
                  alert('Upload failed');
                } finally {
                  setUploading(false);
                }
              }
            }} className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Review</label>
            <textarea required rows={4} value={currentTestimonial.review || ''} onChange={e => setCurrentTestimonial({...currentTestimonial, review: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 resize-none" />
          </div>
          <div className="flex items-center space-x-2">
             <input type="checkbox" id="published" checked={currentTestimonial.published !== false} onChange={e => setCurrentTestimonial({...currentTestimonial, published: e.target.checked})} className="w-4 h-4" />
             <label htmlFor="published" className="text-sm font-medium">Published (Visible on site)</label>
          </div>
          <Button type="submit" disabled={uploading} className="w-full rounded-full">
            <Save className="w-4 h-4 mr-2" /> {uploading ? 'Uploading...' : 'Save Testimonial'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-zinc-500 dark:text-[#a1a1aa] mt-2">Manage client reviews and feedback.</p>
        </div>
        <Button onClick={() => openEditor()} className="rounded-full">
          <Plus className="w-4 h-4 mr-2" /> Add Testimonial
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="glass p-6 rounded-3xl flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {testimonial.photo ? (
                  <img src={testimonial.photo} alt={testimonial.clientName} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold">{testimonial.clientName.charAt(0)}</div>
                )}
                <div>
                  <h3 className="font-bold text-sm">{testimonial.clientName}</h3>
                  <span className="text-xs text-zinc-500">{testimonial.position} @ {testimonial.company}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditor(testimonial)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(testimonial.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 flex-grow italic">"{testimonial.review}"</p>
            <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-xs">
               <span className="text-yellow-500">{'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}</span>
               <span className={testimonial.published ? 'text-emerald-500' : 'text-zinc-500'}>{testimonial.published ? 'Published' : 'Hidden'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
