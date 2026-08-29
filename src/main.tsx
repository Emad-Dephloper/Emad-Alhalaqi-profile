
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const reportError = (error: any, context: string) => {
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
  reportError(event.error || event.message, 'Uncaught Exception');
});

window.addEventListener('unhandledrejection', (event) => {
  reportError(event.reason, 'Unhandled Rejection');
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
