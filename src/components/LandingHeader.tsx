import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useQuery } from "@tanstack/react-query";
import { getAppSettings } from "@/lib/settings";
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const LandingHeader = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const { data: redirectUrl } = useQuery({
    queryKey: ['redirectUrl'],
    queryFn: () => getAppSettings('redirect_url'),
    initialData: 'https://inspire-daily.lovable.dev'
  });

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-primary"
            >
              <path d="M9 18h6"/>
              <path d="M10 22h4"/>
              <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8c0-1-.26-1.87-.78-2.6a5.06 5.06 0 00-2.12-1.82C14.31 3.2 13.36 3 12.35 3c-1.31 0-2.42.3-3.33.9-.91.6-1.6 1.4-2.06 2.4-.46 1-.69 2.1-.69 3.3 0 1.2.33 2.22.99 3.05.66.83 1.12 1.51 1.38 2.05.27.54.4 1.06.4 1.57v.01"/>
            </svg>
            <h1 className="text-xl font-bold text-primary">Inspire Daily</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <Button
                onClick={() => navigate('/home')}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {t('auth.myAccount')}
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-primary hover:text-primary/90"
                >
                  {t('auth.login')}
                </Button>
                <Button
                  onClick={() => navigate('/login')}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {t('auth.signup')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;