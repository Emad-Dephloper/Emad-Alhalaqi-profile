
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const isViteHmrError = (error: any): boolean => {
  const str = error instanceof Error ? `${error.message} ${error.stack}` : String(error || '');
  return str.includes('WebSocket') || str.includes('@vite/client') || str.includes('websocket');
};

const reportError = (error: any, context: string) => {
  if (isViteHmrError(error)) return;

  try {
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: error instanceof Error ? error.stack || error.message : String(error), 
        context 
      })
    }).catch(console.error);
  } catch(e) {}
};

window.addEventListener('error', (event) => {
  if (isViteHmrError(event.error || event.message)) {
    event.preventDefault();
    return;
  }
  reportError(event.error || event.message, 'Uncaught Exception');
});

window.addEventListener('unhandledrejection', (event) => {
  if (isViteHmrError(event.reason)) {
    event.preventDefault();
    return;
  }
  reportError(event.reason, 'Unhandled Rejection');
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
