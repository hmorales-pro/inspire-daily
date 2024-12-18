import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Analytics from '@analytics/google-analytics';

const analytics = Analytics({
  measurementId: 'G-XXXXXXXXXX' // Remplacez par votre ID de mesure GA4
});

export const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Envoie une vue de page à chaque changement de route
    analytics.page();
  }, [location]);

  return null;
};