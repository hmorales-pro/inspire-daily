import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, RefreshCw, Mic } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TextFormatting } from './TextFormatting';

interface ResponseInputProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onOptimize: () => void;
  isOptimizing: boolean;
  isPremium?: boolean;
}

const ResponseInput = ({ value, onChange, onSave, onOptimize, isOptimizing, isPremium = false }: ResponseInputProps) => {
  const { toast } = useToast();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleFormat = (type: 'bold' | 'italic') => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = value.substring(start, end);

    if (selectedText) {
      const prefix = type === 'bold' ? '**' : '_';
      const newText = value.substring(0, start) + 
                     `${prefix}${selectedText}${prefix}` + 
                     value.substring(end);
      onChange(newText);

      // Restore cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + prefix.length;
          textareaRef.current.selectionEnd = end + prefix.length;
          textareaRef.current.focus();
        }
      }, 0);
    } else {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner le texte à formater",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-fade-in">
      <div className="flex justify-end mb-2">
        <TextFormatting isPremium={isPremium} onFormat={handleFormat} />
      </div>
      <Textarea
        ref={textareaRef}
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
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-10">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-full"
                  disabled={!isPremium}
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{isPremium ? "La reconnaissance vocale arrive bientôt !" : "Fonctionnalité réservée aux membres Premium"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ResponseInput;