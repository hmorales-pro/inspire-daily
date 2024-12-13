import React, { useState } from 'react';
import QuestionCard from '@/components/QuestionCard';
import ResponseInput from '@/components/ResponseInput';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { saveResponse } from '@/lib/supabase';
import { optimizeResponse } from '@/lib/openai';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const [response, setResponse] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

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
      
      if (error) throw error;
      return data;
    }
  });

  const { data: todayQuestion, isLoading } = useQuery({
    queryKey: ['todayQuestion'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_questions')
        .select('*')
        .eq('display_date', today)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const handleSave = async () => {
    if (!todayQuestion) {
      toast({
        title: "Erreur",
        description: t('home.noQuestion'),
        variant: "destructive",
      });
      return;
    }

    try {
      await saveResponse({
        question: i18n.language === 'en' ? todayQuestion.question_en : todayQuestion.question,
        response: response,
        is_optimized: false
      });
      
      toast({
        title: t('common.save'),
        description: t('home.response.saved'),
      });
      
      setResponse('');
      navigate('/history');
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('home.response.saveError'),
        variant: "destructive",
      });
    }
  };

  const handleOptimize = async () => {
    if (!todayQuestion) {
      toast({
        title: t('common.error'),
        description: t('home.noQuestion'),
        variant: "destructive",
      });
      return;
    }

    if (profile?.optimizations_count === 0) {
      toast({
        title: t('common.error'),
        description: t('home.response.optimizationLimit'),
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    
    try {
      const optimizedContent = await optimizeResponse(response);
      
      if (profile && profile.subscription_type === 'free') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            optimizations_count: Math.max(0, (profile.optimizations_count || 0) - 1)
          })
          .eq('id', profile.id);

        if (updateError) throw updateError;
        
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
      
      await saveResponse({
        question: i18n.language === 'en' ? todayQuestion.question_en : todayQuestion.question,
        response: response,
        is_optimized: true,
        optimized_response: optimizedContent
      });
      
      toast({
        title: t('common.optimize'),
        description: t('home.response.optimized'),
      });
      
      setResponse('');
      navigate('/history');
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('home.response.optimizeError'),
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-light p-4 flex items-center justify-center">
        <p className="text-muted-foreground">{t('home.loading')}</p>
      </div>
    );
  }

  if (!todayQuestion) {
    return (
      <div className="min-h-screen bg-primary-light p-4 flex items-center justify-center">
        <p className="text-muted-foreground">{t('home.noQuestion')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-light p-4 space-y-6">
      <div className="max-w-4xl mx-auto pt-8">
        <h1 className="text-2xl font-bold text-center text-primary-dark mb-8">
          {t('home.title')}
        </h1>
        
        <div className="space-y-6">
          <QuestionCard 
            question={i18n.language === 'en' ? todayQuestion.question_en : todayQuestion.question}
            date={new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          />
          
          <ResponseInput
            value={response}
            onChange={setResponse}
            onSave={handleSave}
            onOptimize={handleOptimize}
            isOptimizing={isOptimizing}
            isPremium={profile?.subscription_type === 'premium'}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;