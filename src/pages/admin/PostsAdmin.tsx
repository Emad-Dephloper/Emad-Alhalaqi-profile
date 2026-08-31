import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Plus, Edit, Trash2, X, Save, Upload } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { uploadFile } from '../../lib/upload';

export default function PostsAdmin() {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchPosts = async () => {
    try {
      const data = await fetchApi('/admin/posts');
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost.title || !currentPost.category || !currentPost.slug) return;
    
    try {
      if (currentPost.id) {
        await fetchApi(`/admin/posts/${currentPost.id}`, {
          method: 'PUT',
          body: JSON.stringify(currentPost)
        });
      } else {
        await fetchApi('/admin/posts', {
          method: 'POST',
          body: JSON.stringify(currentPost)
        });
      }
      setIsEditing(false);
      setCurrentPost({});
      fetchPosts();
    } catch (e: any) {
      console.error(e);
      alert(language === 'ar' ? `فشل في حفظ المقال: ${e?.message || 'تأكد من أن الرابط التعريفي (slug) فريد'}` : `Failed to save post: ${e?.message || 'Ensure slug is unique'}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await fetchApi(`/admin/posts/${id}`, { method: 'DELETE' });
        fetchPosts();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const openEditor = (post?: any) => {
    if (post) {
      setCurrentPost({ ...post });
    } else {
      setCurrentPost({ slug: `post-${Date.now()}` });
    }
    setIsEditing(true);
  };

  if (loading) return <div>{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>;

  if (isEditing) {
    return (
      <div className="glass p-8 rounded-3xl max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{currentPost.id ? 'Edit Post' : 'New Post'}</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title (English)</label>
              <input required type="text" value={currentPost.title || ''} onChange={e => setCurrentPost({...currentPost, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className="text-sm font-medium">العنوان (عربي)</label>
              <input type="text" value={currentPost.titleAr || ''} onChange={e => setCurrentPost({...currentPost, titleAr: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category (English)</label>
              <input required type="text" value={currentPost.category || ''} onChange={e => setCurrentPost({...currentPost, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2" dir="rtl">
              <label className="text-sm font-medium">التصنيف (عربي)</label>
              <input type="text" value={currentPost.categoryAr || ''} onChange={e => setCurrentPost({...currentPost, categoryAr: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug (Unique URL)</label>
              <input required type="text" value={currentPost.slug || ''} onChange={e => setCurrentPost({...currentPost, slug: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'رابط الصورة أو الرفع' : 'Cover Image URL or Upload File'}</label>
            {currentPost.featuredImage && (
              <div className="mb-2">
                <img src={currentPost.featuredImage} alt="Cover" className="w-48 h-32 object-cover rounded-xl" />
              </div>
            )}
            <input type="text" placeholder="https://example.com/image.jpg" value={currentPost.featuredImage || ''} onChange={e => setCurrentPost({...currentPost, featuredImage: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2" />
            <input type="file" accept="image/*" onChange={async (e) => {
              if (e.target.files?.[0]) {
                setUploading(true);
                try {
                  const url = await uploadFile(e.target.files[0], `posts/${Date.now()}_${e.target.files[0].name}`);
                  setCurrentPost({...currentPost, featuredImage: url});
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
            <label className="text-sm font-medium">Content (English)</label>
            <textarea required rows={5} value={currentPost.content || ''} onChange={e => setCurrentPost({...currentPost, content: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="space-y-2" dir="rtl">
            <label className="text-sm font-medium">المحتوى (عربي)</label>
            <textarea rows={5} value={currentPost.contentAr || ''} onChange={e => setCurrentPost({...currentPost, contentAr: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === 'ar' ? 'عنوان السيو' : 'SEO Meta Title'}</label>
              <input type="text" value={currentPost.metaTitle || ''} onChange={e => setCurrentPost({...currentPost, metaTitle: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === 'ar' ? 'كلمات السيو' : 'SEO Keywords'}</label>
              <input type="text" value={currentPost.keywords || ''} onChange={e => setCurrentPost({...currentPost, keywords: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">{language === 'ar' ? 'وصف السيو' : 'SEO Meta Description'}</label>
              <textarea rows={2} value={currentPost.metaDescription || ''} onChange={e => setCurrentPost({...currentPost, metaDescription: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
             <input type="checkbox" id="published" checked={currentPost.published} onChange={e => setCurrentPost({...currentPost, published: e.target.checked})} className="w-4 h-4" />
             <label htmlFor="published" className="text-sm font-medium">{language === 'ar' ? 'منشور' : 'Published'}</label>
          </div>
          <Button type="submit" disabled={uploading} className="w-full rounded-full">
            <Save className="w-4 h-4 mr-2" /> {uploading ? 'Uploading...' : 'Save Post'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{language === 'ar' ? 'المقالات' : 'Blog Posts'}</h1>
          <p className="text-zinc-500 dark:text-[#a1a1aa] mt-2">{language === 'ar' ? 'إدارة محتوى المدونة.' : 'Manage your blog content.'}</p>
        </div>
        <Button onClick={() => openEditor()} className="rounded-full">
          <Plus className="w-4 h-4 mr-2" />{language === 'ar' ? 'إضافة مقال' : 'Add Post'}</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(post => (
          <div key={post.id} className="glass rounded-3xl p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs text-emerald-500 font-semibold uppercase tracking-wider mb-2 block">{post.category}</span>
                <h3 className="font-bold text-lg leading-tight">{post.title}</h3>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <Button variant="outline" size="sm" onClick={() => openEditor(post)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-zinc-500 dark:text-[#a1a1aa] mb-4 flex-grow line-clamp-2">{post.content}</p>
            <div className="flex items-center text-xs text-zinc-400 font-medium mt-auto">
              <span>{post.published ? 'Published' : 'Draft'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
