import React from 'react';
import { Button } from "@/components/ui/button";
import { Bold, Italic } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TextFormattingProps {
  isPremium: boolean;
  onFormat: (type: 'bold' | 'italic') => void;
}

export const TextFormatting = ({ isPremium, onFormat }: TextFormattingProps) => {
  return (
    <TooltipProvider delayDuration={50}>
      <div className="flex space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onFormat('bold')}
                disabled={!isPremium}
              >
                <Bold className="w-4 h-4" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{isPremium ? "Mettre en gras" : "Fonctionnalité réservée aux membres Premium"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onFormat('italic')}
                disabled={!isPremium}
              >
                <Italic className="w-4 h-4" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{isPremium ? "Mettre en italique" : "Fonctionnalité réservée aux membres Premium"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};