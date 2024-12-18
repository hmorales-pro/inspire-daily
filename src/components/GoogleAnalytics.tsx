import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Analytics from 'analytics';
import googleAnalytics from '@analytics/google-analytics';

const analytics = Analytics({
  app: 'inspire-daily',
  plugins: [
    googleAnalytics({
      measurementId: 'G-YFXS2JBWBW'
    })
  ]
});

export const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Envoie une vue de page à chaque changement de route
    analytics.page();
  }, [location]);

  return null;
};