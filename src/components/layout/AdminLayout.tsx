import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, Settings, LogOut, ArrowLeft, Layers, Code2, Award, MessageSquare, ChevronLeft, ChevronRight, Menu, X, Mail } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { language } = useLanguage();
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // Check if admin email
  if (!user || user.email !== 'eabdullrahman10@gmail.com') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { to: '/admin', label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/projects', label: language === 'ar' ? 'المشاريع' : 'Projects', icon: Briefcase },
    { to: '/admin/posts', label: language === 'ar' ? 'المقالات' : 'Blog Posts', icon: FileText },
    { to: '/admin/services', label: language === 'ar' ? 'الخدمات' : 'Services', icon: Layers },
    { to: '/admin/skills', label: language === 'ar' ? 'المهارات' : 'Skills', icon: Code2 },
    { to: '/admin/certificates', label: language === 'ar' ? 'الشهادات' : 'Certificates', icon: Award },
    { to: '/admin/testimonials', label: language === 'ar' ? 'التوصيات' : 'Testimonials', icon: MessageSquare },
    { to: '/admin/social-links', label: language === 'ar' ? 'مواقع التواصل' : 'Social Links', icon: Layers },
    { to: '/admin/resume', label: language === 'ar' ? 'السيرة الذاتية' : 'Resume', icon: FileText },
    { to: '/admin/messages', label: language === 'ar' ? 'الرسائل' : 'Messages', icon: Mail },
    { to: '/admin/settings', label: language === 'ar' ? 'الإعدادات' : 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white relative">
      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 border-b border-zinc-200 dark:border-white/10 glass flex items-center justify-between px-4 z-40">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 rtl:-mr-2 rtl:ml-0 rounded-lg text-zinc-600 dark:text-zinc-400"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold ml-4 rtl:mr-4 rtl:ml-0 text-lg">{language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}</span>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 ${language === 'ar' ? 'right-0' : 'left-0'} z-50 md:z-10 w-64 glass border-${language === 'ar' ? 'l' : 'r'} border-zinc-200 dark:border-white/10 flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0')} md:relative`}>
        
        {/* Mobile Close Button inside sidebar */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className={`md:hidden absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} p-2 text-zinc-500`}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">{language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}</h2>
            <p className="text-xs text-zinc-500 mt-1 truncate">{language === 'ar' ? 'إدارة محتوى الموقع' : 'Manage Website Content'}</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-[#09090b]'
                    : 'text-zinc-600 dark:text-[#a1a1aa] hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-white/10 space-y-2">
          <NavLink
            to="/"
            className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 dark:text-[#a1a1aa] hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" />
            <span>{language === 'ar' ? 'العودة للموقع' : 'Back to Website'}</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative w-full pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}