import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchApi } from '../lib/api';

export function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Only track public routes (ignore admin)
    if (!location.pathname.startsWith('/admin')) {
      fetchApi('/analytics/track', {
        method: 'POST',
        body: JSON.stringify({ path: location.pathname })
      }).catch(err => {
        // Non-blocking warning for background page view tracking
        console.warn('Analytics tracking skipped:', err?.message || err);
      });
    }
  }, [location.pathname]);

  return null;
}
