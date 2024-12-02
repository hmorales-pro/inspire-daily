import React, { useState } from 'react';
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

interface ResponseInputProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onOptimize: () => void;
  isOptimizing: boolean;
}

const ResponseInput = ({ value, onChange, onSave, onOptimize, isOptimizing }: ResponseInputProps) => {
  const { toast } = useToast();

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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="px-4"
                disabled
              >
                <Mic className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>La reconnaissance vocale arrive bientôt !</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ResponseInput;