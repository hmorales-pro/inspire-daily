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
      const { data, error } = await supabase
        .from('daily_questions')
        .select('*')
        .eq('display_date', today)
        .single();

      if (error) {
        console.error('Error fetching today question:', error);
        throw error;
      }

      console.log('Today question data:', data);
      return data;
    }
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