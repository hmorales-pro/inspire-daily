import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const TranslateButton = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-all-questions');
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: data.message,
      });
      
      console.log('Translation response:', data);
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la traduction",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Button 
      onClick={handleTranslate} 
      disabled={isTranslating}
    >
      {isTranslating ? 'Traduction en cours...' : 'Traduire les questions'}
    </Button>
  );
};

export default TranslateButton;