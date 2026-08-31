import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, Copy, Check, ShieldAlert, ExternalLink, ArrowRightLeft } from 'lucide-react';

export default function Login() {
  const { language } = useLanguage();
  const { user, login, loginWithRedirect, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [isPopupBlocked, setIsPopupBlocked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'Admin Login';
  }, []);

  const handleLogin = async (useRedirect = false) => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    setUnauthorizedDomain(null);
    setIsPopupBlocked(false);
    try {
      if (useRedirect) {
        await loginWithRedirect();
      } else {
        await login();
      }
    } catch (error: any) {
      console.error('Login error details:', error);
      const code = error?.code || '';
      const msg = error?.message || '';

      if (code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
        const currentHost = window.location.hostname;
        setUnauthorizedDomain(currentHost);
        setErrorMessage(
          language === 'ar'
            ? `هذا النطاق (${currentHost}) غير مصرح به في Firebase Authentication.`
            : `This domain (${currentHost}) is not authorized in Firebase Authentication.`
        );
      } else if (code === 'auth/popup-closed-by-user') {
        setErrorMessage(
          language === 'ar' ? 'تم إغلاق نافذة تسجيل الدخول.' : 'Sign-in popup was closed.'
        );
      } else if (code === 'auth/popup-blocked') {
        setIsPopupBlocked(true);
        setErrorMessage(
          language === 'ar'
            ? 'المتصفح حظر النافذة المنبثقة، يمكنك المحاولة عبر التحويل المباشر (Redirect) أو فتح الموقع في نافذة جديدة.'
            : 'Popup was blocked by the browser. You can use direct redirect or open in a new tab.'
        );
      } else {
        setErrorMessage(
          error?.message || (language === 'ar' ? 'فشل تسجيل الدخول. يرجى المحاولة لاحقاً.' : 'Login failed. Please try again.')
        );
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const copyDomain = () => {
    if (unauthorizedDomain) {
      navigator.clipboard.writeText(unauthorizedDomain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>;
  }

  if (user) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-[#09090b] p-4">
      <div className="glass p-8 md:p-12 rounded-3xl max-w-lg w-full text-center border border-zinc-200/80 dark:border-white/10 shadow-2xl">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {language === 'ar' ? 'بوابة الإدارة' : 'Admin Portal'}
        </h1>
        <p className="text-zinc-500 dark:text-[#a1a1aa] mb-8 text-sm">
          {language === 'ar'
            ? 'تسجيل الدخول المخصص لإدارة المحتوى والإعدادات.'
            : 'Secure access to the management dashboard.'}
        </p>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-left rtl:text-right text-red-600 dark:text-red-400 text-sm space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="font-medium">{errorMessage}</div>
            </div>

            {isPopupBlocked && (
              <div className="bg-white/80 dark:bg-black/40 p-3 rounded-xl border border-red-500/20 text-xs space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-semibold text-zinc-900 dark:text-white">
                  {language === 'ar' ? 'خيارات بديلة لتسجيل الدخول:' : 'Alternative login options:'}
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2 text-xs"
                    onClick={() => handleLogin(true)}
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'تسجيل الدخول عبر التحويل (Redirect)' : 'Sign In with Redirect'}</span>
                  </Button>
                </div>
              </div>
            )}

            {unauthorizedDomain && (
              <div className="bg-white/80 dark:bg-black/40 p-3 rounded-xl border border-red-500/20 text-xs space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-semibold text-zinc-900 dark:text-white">
                  {language === 'ar' ? 'خطوات الحل السريع في Firebase:' : 'Quick fix steps in Firebase:'}
                </p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>
                    {language === 'ar'
                      ? 'افتح Firebase Console > Authentication > Settings'
                      : 'Open Firebase Console > Authentication > Settings'}
                  </li>
                  <li>
                    {language === 'ar'
                      ? 'انقر على "Authorized domains" ثم "Add domain"'
                      : 'Click "Authorized domains" then "Add domain"'}
                  </li>
                  <li>
                    {language === 'ar' ? 'أضف هذا النطاق:' : 'Add this domain:'}
                  </li>
                </ol>

                <div className="flex items-center justify-between gap-2 bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg font-mono text-[11px] select-all break-all">
                  <span>{unauthorizedDomain}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs shrink-0"
                    onClick={copyDomain}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="ml-1 text-[11px]">{copied ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
                  </Button>
                </div>

                <div className="pt-1">
                  <a
                    href="https://console.firebase.google.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-500 hover:underline font-medium"
                  >
                    {language === 'ar' ? 'الانتقال إلى Firebase Console' : 'Go to Firebase Console'}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={() => handleLogin(false)}
            disabled={isLoggingIn}
            className="w-full rounded-full py-6 text-base font-semibold shadow-lg shadow-blue-500/20"
          >
            {isLoggingIn
              ? (language === 'ar' ? 'جاري تسجيل الدخول...' : 'Signing in...')
              : (language === 'ar' ? 'تسجيل الدخول باستخدام Google' : 'Sign In with Google')}
          </Button>

          <Button
            onClick={() => handleLogin(true)}
            variant="ghost"
            disabled={isLoggingIn}
            className="w-full text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            {language === 'ar' ? 'تسجيل الدخول بالتحويل المباشر (Redirect)' : 'Sign In with Redirect Mode'}
          </Button>
        </div>
      </div>
    </div>
  );
}

