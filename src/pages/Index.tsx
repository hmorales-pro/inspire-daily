import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { saveResponse, supabase } from '@/lib/supabase';
import { optimizeResponse } from '@/lib/openai';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import ResponseInput from '@/components/ResponseInput';
import DailyQuestion from '@/components/DailyQuestion';
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const [response, setResponse] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [hasOptimized, setHasOptimized] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['home', 'common']);

  useEffect(() => {
    // Generate or retrieve session ID from localStorage
    const storedSessionId = localStorage.getItem('anonymousSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      // Check if user has already optimized
      const hasOptimizedBefore = localStorage.getItem('hasOptimized') === 'true';
      setHasOptimized(hasOptimizedBefore);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem('anonymousSessionId', newSessionId);
      setSessionId(newSessionId);
    }
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

  const handleSave = async () => {
    if (!todayQuestion) {
      toast({
        title: t('common:error'),
        description: t('home:noQuestion'),
        variant: "destructive",
      });
      return;
    }

    try {
      if (profile) {
        await saveResponse({
          question: i18n.language === 'en' ? todayQuestion.question_en : todayQuestion.question,
          response: response,
          is_optimized: false
        });
      } else {
        // Save anonymous response
        const { error } = await supabase
          .from('anonymous_responses')
          .insert({
            question: i18n.language === 'en' ? todayQuestion.question_en : todayQuestion.question,
            response: response,
            session_id: sessionId
          });

        if (error) throw error;
      }
      
      toast({
        title: t('common:success'),
        description: t('home:response.saved'),
      });
      
      setResponse('');
      if (profile) {
        navigate('/history');
      }
    } catch (error) {
      console.error('Error saving response:', error);
      toast({
        title: t('common:error'),
        description: t('home:response.saveError'),
        variant: "destructive",
      });
    }
  };

  const handleOptimize = async () => {
    if (!todayQuestion) {
      toast({
        title: t('common:error'),
        description: t('home:noQuestion'),
        variant: "destructive",
      });
      return;
    }

    if (!profile && hasOptimized) {
      toast({
        title: t('common:error'),
        description: t('home:response.registerToOptimize'),
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (profile?.optimizations_count === 0) {
      toast({
        title: t('common:error'),
        description: t('home:response.optimizationLimit'),
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    
    try {
      const optimizedContent = await optimizeResponse(response);
      
      if (profile) {
        if (profile.subscription_type === 'free') {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              optimizations_count: Math.max(0, (profile.optimizations_count || 0) - 1)
            })
            .eq('id', profile.id);

          if (updateError) throw updateError;
        }
        
        await saveResponse({
          question: i18n.language === 'en' ? todayQuestion.question_en : todayQuestion.question,
          response: response,
          is_optimized: true,
          optimized_response: optimizedContent
        });
        
        navigate('/history');
      } else {
        // Save anonymous optimized response
        const { error } = await supabase
          .from('anonymous_responses')
          .insert({
            question: i18n.language === 'en' ? todayQuestion.question_en : todayQuestion.question,
            response: response,
            is_optimized: true,
            optimized_response: optimizedContent,
            session_id: sessionId
          });

        if (error) throw error;
        
        // Mark that user has used their free optimization
        localStorage.setItem('hasOptimized', 'true');
        setHasOptimized(true);
      }
      
      toast({
        title: t('common:success'),
        description: t('home:response.optimized'),
      });
      
      setResponse('');
    } catch (error) {
      console.error('Error optimizing response:', error);
      toast({
        title: t('common:error'),
        description: t('home:response.optimizeError'),
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

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