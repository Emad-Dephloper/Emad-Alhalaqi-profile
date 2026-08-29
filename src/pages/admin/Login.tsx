import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export default function Login() {
  const { language } = useLanguage();
  const { user, login, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    document.title = 'Admin Login';
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>;
  }

  if (user) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-[#09090b]">
      <div className="glass p-12 rounded-3xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Portal</h1>
        <p className="text-zinc-500 dark:text-[#a1a1aa] mb-8">Secure access to the management dashboard.</p>
        
        <Button onClick={login} className="w-full rounded-full py-6 text-lg">
          Sign In with Google
        </Button>
      </div>
    </div>
  );
}
