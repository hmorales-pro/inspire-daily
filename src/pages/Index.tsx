import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import ResponseInput from '@/components/ResponseInput';
import DailyQuestion from '@/components/DailyQuestion';
import OptimizedResponseCard from '@/components/home/OptimizedResponseCard';
import { useAnonymousSession } from '@/components/home/useAnonymousSession';
import { useResponseActions } from '@/components/home/useResponseActions';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { i18n } = useTranslation();
  const { sessionId, hasOptimized, markAsOptimized } = useAnonymousSession();

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
    queryKey: ['todayQuestion', i18n.language],
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

  return (
    <div className="min-h-screen bg-primary-light p-4 space-y-6">
      <div className="max-w-4xl mx-auto pt-8">
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
  );
};

export default Index;