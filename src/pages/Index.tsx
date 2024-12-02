import React, { useState } from 'react';
import QuestionCard from '@/components/QuestionCard';
import ResponseInput from '@/components/ResponseInput';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [response, setResponse] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const todayQuestion = {
    question: "Quelle est la plus grande leçon que vous ayez apprise dans votre domaine d'expertise ?",
    date: new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };

  const handleSave = () => {
    // Ici, vous pourriez sauvegarder la réponse dans une base de données
    const savedResponse = {
      id: Date.now(),
      question: todayQuestion.question,
      response: response,
      date: new Date(),
      isOptimized: false
    };
    
    // Pour l'instant, on simule la sauvegarde en console
    console.log('Réponse sauvegardée :', savedResponse);
    
    toast({
      title: "Réponse enregistrée",
      description: "Votre réponse a été sauvegardée avec succès.",
    });
    
    setResponse('');
    navigate('/history');
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    
    try {
      // Simulation d'un appel API pour l'optimisation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ici, vous pourriez appeler une API d'IA pour optimiser le contenu
      const optimizedResponse = {
        id: Date.now(),
        question: todayQuestion.question,
        originalResponse: response,
        optimizedResponse: response + "\n\n#expertise #apprentissage #croissance",
        date: new Date(),
        isOptimized: true
      };
      
      console.log('Réponse optimisée :', optimizedResponse);
      
      toast({
        title: "Réponse optimisée",
        description: "Votre contenu a été optimisé avec succès.",
      });
      
      setResponse('');
      navigate('/history');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'optimisation.",
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
          Question du jour
        </h1>
        
        <div className="space-y-6">
          <QuestionCard 
            question={todayQuestion.question}
            date={todayQuestion.date}
          />
          
          <ResponseInput
            value={response}
            onChange={setResponse}
            onSave={handleSave}
            onOptimize={handleOptimize}
            isOptimizing={isOptimizing}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;