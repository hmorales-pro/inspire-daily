import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import ResponseInput from '@/components/ResponseInput';
import DailyQuestion from '@/components/DailyQuestion';
import OptimizedResponseCard from '@/components/home/OptimizedResponseCard';
import { useAnonymousSession } from '@/components/home/useAnonymousSession';
import { useResponseActions } from '@/components/home/useResponseActions';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';

const Index = () => {
  const { t } = useTranslation(['home', 'common']);
  const { sessionId, hasOptimized, markAsOptimized } = useAnonymousSession();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      return data;
    }
  });

  const { data: todayQuestion } = useQuery({
    queryKey: ['todayQuestion'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_questions')
        .select('*')
        .eq('display_date', today)
        .single();

      if (error) {
        console.error('Error fetching today question:', error);
        throw error;
      }
      return data;
    }
  });

  const {
    response,
    setResponse,
    optimizedResponse,
    isOptimizing,
    handleSave,
    handleOptimize
  } = useResponseActions({
    sessionId,
    hasOptimized,
    markAsOptimized,
    profile
  });

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-primary-light p-4 flex items-center justify-center">
      <p className="text-muted-foreground">{t('common:loading')}</p>
    </div>;
  }

  return (
    <>
      {isAuthenticated ? (
        <Header />
      ) : null}
      <div className="min-h-screen bg-primary-light p-4 space-y-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-center text-primary-dark mb-8">
            {t('home:title')}
          </h1>
          
          <div className="space-y-6">
            <DailyQuestion />
            
            <ResponseInput
              value={response}
              onChange={setResponse}
              onSave={() => handleSave(todayQuestion)}
              onOptimize={() => handleOptimize(todayQuestion)}
              isOptimizing={isOptimizing}
              isPremium={profile?.subscription_type === 'premium'}
            />

            {optimizedResponse && !profile && (
              <OptimizedResponseCard optimizedResponse={optimizedResponse} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;