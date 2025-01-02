import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import QuestionCard from './QuestionCard';

const DailyQuestion = () => {
  const { i18n } = useTranslation();

  const { data: todayQuestion, isLoading, error } = useQuery({
    queryKey: ['todayQuestion', i18n.language],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      console.log('Fetching question for date:', today);
      
      const { data, error } = await supabase
        .from('daily_questions')
        .select('*')
        .eq('display_date', today)
        .maybeSingle();

      if (error) {
        console.error('Error fetching today question:', error);
        throw error;
      }

      if (!data) {
        console.log('No question found for today. Checking database content...');
        // Log a few days of questions to help debug
        const { data: recentQuestions, error: recentError } = await supabase
          .from('daily_questions')
          .select('display_date, question')
          .order('display_date', { ascending: false })
          .limit(5);
          
        if (recentError) {
          console.error('Error fetching recent questions:', recentError);
        } else {
          console.log('Recent questions in database:', recentQuestions);
        }
      }

      console.log('Today question data:', data);
      return data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (error) {
    console.error('Error in DailyQuestion component:', error);
    return (
      <div className="flex items-center justify-center">
        <p className="text-red-500">Une erreur est survenue lors du chargement de la question.</p>
      </div>
    );
  }

  if (!todayQuestion) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-muted-foreground">Aucune question disponible pour aujourd'hui.</p>
      </div>
    );
  }

  console.log('Current language:', i18n.language);
  console.log('Question data:', {
    question: todayQuestion.question,
    question_en: todayQuestion.question_en,
  });

  const questionText = i18n.language === 'en' && todayQuestion.question_en 
    ? todayQuestion.question_en 
    : todayQuestion.question;

  return (
    <QuestionCard 
      question={questionText}
      date={new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    />
  );
};

export default DailyQuestion;