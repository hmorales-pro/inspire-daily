import React from 'react';
import { Button } from "@/components/ui/button";
import { Bold, Italic } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from 'react-i18next';

interface TextFormattingProps {
  onFormat: (type: 'bold' | 'italic') => void;
}

export const TextFormatting = ({ onFormat }: TextFormattingProps) => {
  const { t } = useTranslation(['home']);

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
              >
                <Bold className="w-4 h-4" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{t('home:response.boldText')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onFormat('italic')}
              >
                <Italic className="w-4 h-4" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{t('home:response.italicText')}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};