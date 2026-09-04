import { auth } from './firebase.ts';
import { onAuthStateChanged, User } from 'firebase/auth';

const LIVE_STUDIO_BACKEND = 'https://emad-6414.ai.studio';

const getApiUrl = (endpoint: string): string => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const rawEnv = (import.meta.env.VITE_API_URL || '').trim();

  // 1. Explicit VITE_API_URL from environment (e.g. deployed backend URL)
  if (rawEnv.startsWith('http://') || rawEnv.startsWith('https://')) {
    try {
      const parsed = new URL(rawEnv);
      const cleanPath = parsed.pathname.replace(/\/+$/, '').replace(/\/api$/, '');
      return `${parsed.origin}${cleanPath}/api${path}`;
    } catch {
      // Fallback
    }
  }

  // 2. If running on Netlify or external web host, connect directly to the live backend
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname.endsWith('.netlify.app') ||
     window.location.hostname.endsWith('.vercel.app') ||
     window.location.hostname.endsWith('.pages.dev'))
  ) {
    return `${LIVE_STUDIO_BACKEND}/api${path}`;
  }

  // 3. Default to relative /api endpoint (local dev and direct host)
  return `/api${path}`;
};

const getCurrentUser = async (): Promise<User | null> => {
  if (auth.currentUser) return auth.currentUser;

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
    setTimeout(() => {
      unsubscribe();
      resolve(auth.currentUser);
    }, 1200);
  });
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  
  const user = await getCurrentUser();
  if (user) {
    try {
      const token = await user.getIdToken();
      headers.set('Authorization', `Bearer ${token}`);
    } catch (tokenErr) {
      console.warn('Could not get fresh auth token:', tokenErr);
    }
  }
  
  headers.set('Content-Type', 'application/json');

  const url = getApiUrl(endpoint);

  const response = await fetch(url, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    let errorMessage = `API request failed (${response.status})`;
    if (isJson) {
      try {
        const errorData = await response.json();
        if (errorData?.error) errorMessage = errorData.error;
      } catch {
        // Ignore JSON parse errors for failed responses
      }
    } else if (response.status === 404) {
      if (typeof window !== 'undefined' && window.location.hostname.endsWith('.netlify.app')) {
        errorMessage = 'خادم الـ API غير متصل في Netlify (404). يجب نشر التطبيق عبر Cloud Run أو تعيين VITE_API_URL.';
      }
    }
    throw new Error(errorMessage);
  }

  if (!isJson) {
    if (typeof window !== 'undefined' && window.location.hostname.endsWith('.netlify.app')) {
      throw new Error('تعذر العثور على خادم الـ API في Netlify. يرجى التأكد من تشغيل الـ Backend أو تعيين VITE_API_URL.');
    }
    throw new Error(`Expected JSON response from ${url} but received ${contentType || 'non-JSON'}`);
  }

  return response.json();
};
