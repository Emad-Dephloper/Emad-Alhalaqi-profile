import { auth } from './firebase.ts';

const getApiUrl = (endpoint: string): string => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const rawEnv = (import.meta.env.VITE_API_URL || '').trim();

  // Only use VITE_API_URL if it is a valid absolute HTTP/HTTPS URL
  if (rawEnv.startsWith('http://') || rawEnv.startsWith('https://')) {
    try {
      const parsed = new URL(rawEnv);
      const cleanPath = parsed.pathname.replace(/\/+$/, '').replace(/\/api$/, '');
      return `${parsed.origin}${cleanPath}/api${path}`;
    } catch {
      // If URL parsing fails, fall back to relative path
    }
  }

  // Default to relative /api endpoint
  return `/api${path}`;
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    headers.set('Authorization', `Bearer ${token}`);
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
    }
    throw new Error(errorMessage);
  }

  if (!isJson) {
    throw new Error(`Expected JSON response from ${url} but received ${contentType || 'non-JSON'}`);
  }

  return response.json();
};
