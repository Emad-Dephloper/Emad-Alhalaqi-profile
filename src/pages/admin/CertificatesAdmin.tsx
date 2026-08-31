import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { uploadFile } from '../../lib/upload';

export default function CertificatesAdmin() {
  const { language } = useLanguage();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCert, setCurrentCert] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchCertificates = async () => {
    try {
      const data = await fetchApi('/admin/certificates');
      setCertificates(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCert.name || !currentCert.issuer) return;
    
    try {
      if (currentCert.id) {
        await fetchApi(`/admin/certificates/${currentCert.id}`, {
          method: 'PUT',
          body: JSON.stringify(currentCert)
        });
      } else {
        await fetchApi('/admin/certificates', {
          method: 'POST',
          body: JSON.stringify(currentCert)
        });
      }
      setIsEditing(false);
      setCurrentCert({});
      fetchCertificates();
    } catch (e: any) {
      console.error(e);
      alert(language === 'ar' ? `فشل في حفظ الشهادة: ${e?.message || 'يرجى التحقق من المدخلات'}` : `Failed to save certificate: ${e?.message || 'Please check inputs'}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      try {
        await fetchApi(`/admin/certificates/${id}`, { method: 'DELETE' });
        fetchCertificates();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const openEditor = (cert?: any) => {
    if (cert) {
      setCurrentCert({ ...cert, date: cert.date ? new Date(cert.date).toISOString().split('T')[0] : '' });
    } else {
      setCurrentCert({});
    }
    setIsEditing(true);
  };

  if (loading) return <div>{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>;

  if (isEditing) {
    return (
      <div className="glass p-8 rounded-3xl max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{currentCert.id ? 'Edit Certificate' : 'New Certificate'}</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'الاسم' : 'Name'}</label>
            <input required type="text" value={currentCert.name || ''} onChange={e => setCurrentCert({...currentCert, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === 'ar' ? 'جهة الإصدار' : 'Issuer'}</label>
              <input required type="text" value={currentCert.issuer || ''} onChange={e => setCurrentCert({...currentCert, issuer: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === 'ar' ? 'التاريخ' : 'Date'}</label>
              <input type="date" value={currentCert.date || ''} onChange={e => setCurrentCert({...currentCert, date: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'رابط الشهادة' : 'Credential URL'}</label>
            <input type="url" value={currentCert.credentialUrl || ''} onChange={e => setCurrentCert({...currentCert, credentialUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'رابط الـ PDF أو الرفع' : 'PDF URL or Upload'}</label>
            {currentCert.pdfUpload && (
              <div className="mb-2">
                <a href={currentCert.pdfUpload} target="_blank" rel="noreferrer" className="text-blue-500 underline text-sm">View Current PDF</a>
              </div>
            )}
            <input type="text" placeholder="https://example.com/certificate.pdf" value={currentCert.pdfUpload || ''} onChange={e => setCurrentCert({...currentCert, pdfUpload: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 mb-2" />
            <input type="file" accept=".pdf,image/*" onChange={async (e) => {
              if (e.target.files?.[0]) {
                setUploading(true);
                try {
                  const url = await uploadFile(e.target.files[0], `certificates/${Date.now()}_${e.target.files[0].name}`);
                  setCurrentCert({...currentCert, pdfUpload: url});
                } catch (err) {
                  console.error(err);
                  alert('Upload failed');
                } finally {
                  setUploading(false);
                }
              }
            }} className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
          <Button type="submit" disabled={uploading} className="w-full rounded-full">
            <Save className="w-4 h-4 mr-2" /> {uploading ? 'Uploading...' : 'Save Certificate'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{language === 'ar' ? 'الشهادات' : 'Certificates'}</h1>
          <p className="text-zinc-500 dark:text-[#a1a1aa] mt-2">{language === 'ar' ? 'إدارة شهاداتك المهنية.' : 'Manage your professional certifications.'}</p>
        </div>
        <Button onClick={() => openEditor()} className="rounded-full">
          <Plus className="w-4 h-4 mr-2" />{language === 'ar' ? 'إضافة شهادة' : 'Add Certificate'}</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map(cert => (
          <div key={cert.id} className="glass p-6 rounded-3xl flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{cert.name}</h3>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{cert.issuer}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditor(cert)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(cert.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {cert.date && (
              <p className="text-sm text-zinc-500 mb-2">
                Date: {new Date(cert.date).toLocaleDateString()}
              </p>
            )}
            <div className="mt-auto pt-4 flex gap-2">
              {cert.credentialUrl && (
                <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-500 hover:underline">Verify</a>
              )}
              {cert.pdfUpload && (
                <a href={cert.pdfUpload} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-500 hover:underline">View PDF</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
