import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { optimizeResponse } from '@/lib/openai';

interface UseResponseActionsProps {
  sessionId: string;
  hasOptimized: boolean;
  markAsOptimized: () => void;
  profile?: any;
}

export const useResponseActions = ({ sessionId, hasOptimized, markAsOptimized, profile }: UseResponseActionsProps) => {
  const [response, setResponse] = useState('');
  const [optimizedResponse, setOptimizedResponse] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['home', 'common']);

  const handleSave = async (todayQuestion: any) => {
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
        await supabase
          .from('responses')
          .insert({
            question: i18n.language === 'en' ? todayQuestion.question_en : todayQuestion.question,
            response: response,
            is_optimized: false,
            user_id: profile.id
          });
      } else {
        await supabase
          .from('anonymous_responses')
          .insert({
            question: i18n.language === 'en' ? todayQuestion.question_en : todayQuestion.question,
            response: response,
            session_id: sessionId
          });
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

  const handleOptimize = async (todayQuestion: any) => {
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
      setOptimizedResponse(optimizedContent);
      
      if (profile) {
        if (profile.subscription_type === 'free') {
          await supabase
            .from('profiles')
            .update({ 
              optimizations_count: Math.max(0, (profile.optimizations_count || 0) - 1)
            })
            .eq('id', profile.id);
        }
        
        await supabase
          .from('responses')
          .insert({
            question: i18n.language === 'en' ? todayQuestion.question_en : todayQuestion.question,
            response: response,
            is_optimized: true,
            optimized_response: optimizedContent,
            user_id: profile.id
          });
        
        navigate('/history');
      } else {
        await supabase
          .from('anonymous_responses')
          .insert({
            question: i18n.language === 'en' ? todayQuestion.question_en : todayQuestion.question,
            response: response,
            is_optimized: true,
            optimized_response: optimizedContent,
            session_id: sessionId
          });
        
        markAsOptimized();
      }
      
      toast({
        title: t('common:success'),
        description: t('home:response.optimized'),
      });
      
    } catch (error) {
      console.error('Error optimizing response:', error);
      toast({
        title: t('common:error'),
        description: t('home:response.optimizeError'),
        variant: "destructive",
      });
      setOptimizedResponse(null);
    } finally {
      setIsOptimizing(false);
    }
  };

  return {
    response,
    setResponse,
    optimizedResponse,
    isOptimizing,
    handleSave,
    handleOptimize
  };
};