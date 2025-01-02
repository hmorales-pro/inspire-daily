import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const GenerateQuestionsButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateQuestions = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.functions.invoke('generate-monthly-questions', {
        body: { months: 12 }
      });

      if (error) throw error;

      toast({
        title: "Génération des questions en cours",
        description: "Les questions pour les 12 prochains mois sont en cours de génération. Cela peut prendre quelques minutes.",
      });
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération des questions.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleGenerateQuestions}
      disabled={isLoading}
    >
      {isLoading ? "Génération en cours..." : "Générer les questions"}
    </Button>
  );
};

export default GenerateQuestionsButton;