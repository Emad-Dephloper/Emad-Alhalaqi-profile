import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Mail, Trash2, CheckCircle, X, Clock, Reply } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export default function MessagesAdmin() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const data = await fetchApi('/admin/messages');
      // Sort by latest first
      setMessages(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      const msg = messages.find(m => m.id === id);
      if (!msg) return;
      await fetchApi(`/admin/messages/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...msg, read: true })
      });
      fetchMessages();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الرسالة؟' : 'Are you sure you want to delete this message?')) {
      try {
        await fetchApi(`/admin/messages/${id}`, { method: 'DELETE' });
        if (selectedMessage?.id === id) setSelectedMessage(null);
        fetchMessages();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleRowClick = (msg: any) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      markAsRead(msg.id);
    }
  };

  if (loading) return <div>{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{language === 'ar' ? 'الرسائل الواردة' : 'Inbox Messages'}</h1>
          <p className="text-zinc-500 dark:text-[#a1a1aa] mt-2">{language === 'ar' ? 'إدارة رسائل التواصل.' : 'Manage your contact messages.'}</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center text-zinc-500">
          <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{language === 'ar' ? 'لا توجد رسائل حالياً.' : 'No messages yet.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
          {/* Messages List */}
          <div className="lg:col-span-1 glass rounded-3xl overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-zinc-200 dark:border-white/10 font-bold">
              {language === 'ar' ? 'الرسائل' : 'Messages'}
            </div>
            <div className="overflow-y-auto flex-grow">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  onClick={() => handleRowClick(msg)}
                  className={`p-4 border-b border-zinc-200 dark:border-white/10 cursor-pointer transition-colors hover:bg-zinc-100 dark:hover:bg-white/5 ${selectedMessage?.id === msg.id ? 'bg-zinc-100 dark:bg-white/5' : ''} ${!msg.read ? 'border-l-4 border-l-blue-500' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-medium truncate pr-2 ${!msg.read ? 'text-zinc-900 dark:text-white font-bold' : 'text-zinc-600 dark:text-zinc-300'}`}>{msg.name}</h3>
                    <span className="text-xs text-zinc-500 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString(language === 'ar' ? 'ar' : 'en')}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 truncate">{msg.subject || (language === 'ar' ? 'بدون عنوان' : 'No Subject')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Message Details */}
          <div className="lg:col-span-2 glass rounded-3xl p-6 h-[600px] overflow-y-auto flex flex-col">
            {selectedMessage ? (
              <>
                <div className="flex justify-between items-start mb-6 pb-6 border-b border-zinc-200 dark:border-white/10">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedMessage.subject || (language === 'ar' ? 'بدون عنوان' : 'No Subject')}</h2>
                    <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="font-semibold text-zinc-900 dark:text-white mr-2 rtl:ml-2 rtl:mr-0">{selectedMessage.name}</span>
                      <span>&lt;<a href={`mailto:${selectedMessage.email}`} className="hover:text-blue-500 hover:underline">{selectedMessage.email}</a>&gt;</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0 ml-4">
                    <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || ''}`} className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 transition-colors">
                      <Reply className="w-5 h-5" />
                    </a>
                    <button onClick={() => handleDelete(selectedMessage.id)} className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center text-xs text-zinc-500 mb-6">
                  <Clock className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {new Date(selectedMessage.createdAt).toLocaleString(language === 'ar' ? 'ar' : 'en')}
                </div>

                <div className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed flex-grow">
                  {selectedMessage.message}
                </div>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-zinc-500 h-full">
                <Mail className="w-12 h-12 mb-4 opacity-50" />
                <p>{language === 'ar' ? 'اختر رسالة لعرضها.' : 'Select a message to read.'}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
