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
        console.error('Failed to track analytics', err);
      });
    }
  }, [location.pathname]);

  return null;
}
