import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, RefreshCw, Mic, MicOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ResponseInputProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onOptimize: () => void;
  isOptimizing: boolean;
}

const ResponseInput = ({ value, onChange, onSave, onOptimize, isOptimizing }: ResponseInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Non supporté",
        description: "La reconnaissance vocale n'est pas supportée par votre navigateur.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';

    recognition.onstart = () => {
      setIsListening(true);
      console.log('Démarrage de la reconnaissance vocale');
    };

    recognition.onend = () => {
      console.log('Fin de la reconnaissance vocale, isListening:', isListening);
      if (isListening) {
        recognition.start();
      } else {
        setIsListening(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.log('Erreur de reconnaissance vocale:', event.error);
      if (event.error === 'no-speech') {
        recognition.stop();
        setTimeout(() => {
          if (isListening) {
            recognition.start();
          }
        }, 100);
        return;
      }

      setIsListening(false);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue avec la reconnaissance vocale. Veuillez réessayer.",
        variant: "destructive",
      });
    };

    recognition.onresult = (event: any) => {
      console.log('Résultat reçu:', event.results);
      let currentTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          currentTranscript += transcript + ' ';
        }
      }

      if (currentTranscript) {
        console.log('Transcription:', currentTranscript);
        // Concaténer le nouveau texte avec l'existant
        const newValue = value ? `${value} ${currentTranscript}` : currentTranscript;
        onChange(newValue.trim());
      }
    };

    try {
      recognition.start();
      console.log('Reconnaissance vocale démarrée');
    } catch (error) {
      console.error('Erreur lors du démarrage de la reconnaissance vocale:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la reconnaissance vocale. Veuillez réessayer.",
        variant: "destructive",
      });
    }

    (window as any).recognition = recognition;
  };

  const stopListening = () => {
    if ((window as any).recognition) {
      (window as any).recognition.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-fade-in">
      <Textarea
        placeholder="Écrivez votre réponse ici..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[150px] resize-none"
      />
      <div className="flex space-x-2">
        <Button
          onClick={onSave}
          className="flex-1 bg-primary hover:bg-primary/90"
          disabled={!value.trim() || isOptimizing}
        >
          <Send className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
        <Button
          onClick={onOptimize}
          className="flex-1 bg-secondary hover:bg-secondary/90"
          disabled={!value.trim() || isOptimizing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isOptimizing ? 'animate-spin' : ''}`} />
          Optimiser
        </Button>
        <Button
          onClick={toggleListening}
          variant={isListening ? "destructive" : "outline"}
          className="px-4"
          type="button"
        >
          {isListening ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ResponseInput;