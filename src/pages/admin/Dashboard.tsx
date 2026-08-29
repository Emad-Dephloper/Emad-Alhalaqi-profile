import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Briefcase, FileText, Layers, Link2, Mail, Activity, Eye, MousePointer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function AdminDashboard() {
  const { language, dir } = useLanguage();
  const [stats, setStats] = useState({ projects: 0, posts: 0, services: 0, messages: 0 });
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchApi('/admin/stats').then(setStats).catch(console.error);
    fetchApi('/admin/analytics').then(setAnalytics).catch(console.error);
  }, []);

  const cards = [
    { title: language === 'ar' ? 'إجمالي الزيارات' : 'Total Views', value: analytics?.totalViews || 0, icon: Eye, link: '#', color: 'text-indigo-500' },
    { title: language === 'ar' ? 'المشاريع' : 'Total Projects', value: stats.projects, icon: Briefcase, link: '/admin/projects', color: 'text-blue-500' },
    { title: language === 'ar' ? 'المقالات' : 'Blog Posts', value: stats.posts, icon: FileText, link: '/admin/posts', color: 'text-emerald-500' },
    { title: language === 'ar' ? 'الرسائل' : 'Messages', value: stats.messages, icon: Mail, link: '/admin/messages', color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{language === 'ar' ? 'نظرة عامة على لوحة التحكم' : 'Dashboard Overview'}</h1>
        <p className="text-zinc-500 dark:text-[#a1a1aa] mt-2">{language === 'ar' ? 'مرحباً بك في نظام إدارة المحتوى.' : 'Welcome to your content management system.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <Link key={idx} to={card.link} className="glass p-6 rounded-3xl hover:border-zinc-300 dark:hover:border-white/20 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1 relative z-10">{card.value}</h3>
            <p className="text-zinc-500 dark:text-[#a1a1aa] font-medium relative z-10">{card.title}</p>
          </Link>
        ))}
      </div>
      
      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="glass p-8 rounded-3xl lg:col-span-2">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center">
                <Activity className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 text-blue-500" />
                {language === 'ar' ? 'زيارات الموقع عبر الزمن' : 'Website Views Over Time'}
              </h2>
           </div>
           
           <div className="h-[300px] w-full">
            {analytics?.viewsByDate && analytics.viewsByDate.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.viewsByDate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" opacity={0.1} />
                  <XAxis dataKey="date" stroke="#8884d8" fontSize={12} />
                  <YAxis stroke="#8884d8" fontSize={12} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="views" name={language === 'ar' ? 'الزيارات' : 'Views'} stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500">
                {language === 'ar' ? 'لا توجد بيانات كافية بعد' : 'Not enough data yet'}
              </div>
            )}
           </div>
        </div>
        
        {/* Top Pages */}
        <div className="glass p-8 rounded-3xl flex flex-col">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <MousePointer className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 text-emerald-500" />
            {language === 'ar' ? 'الصفحات الأكثر زيارة' : 'Top Pages'}
          </h2>
          
          <div className="flex-1">
            {analytics?.topPages && analytics.topPages.length > 0 ? (
              <ul className="space-y-4">
                {analytics.topPages.map((page: any, idx: number) => (
                  <li key={idx} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl">
                    <span className="font-medium text-sm truncate max-w-[200px]" title={page.path}>
                      {page.path === '/' ? (language === 'ar' ? 'الرئيسية' : 'Home') : page.path}
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-1 px-3 rounded-full text-xs font-bold">
                      {page.views}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500">
                 {language === 'ar' ? 'لا توجد بيانات' : 'No data'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
