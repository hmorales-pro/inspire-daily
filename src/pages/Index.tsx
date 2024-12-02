import React, { useState } from 'react';
import QuestionCard from '@/components/QuestionCard';
import ResponseInput from '@/components/ResponseInput';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [response, setResponse] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  // Pour cette première version, on utilise une question statique
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
    toast({
      title: "Réponse enregistrée",
      description: "Votre réponse a été sauvegardée avec succès.",
    });
    setResponse('');
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    // Simulation d'une optimisation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Réponse optimisée",
      description: "Votre contenu a été optimisé avec succès.",
    });
    
    setIsOptimizing(false);
    setResponse('');
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