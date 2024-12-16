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
import { useTranslation } from 'react-i18next';

interface ResponseInputProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onOptimize: () => void;
  isOptimizing: boolean;
  isPremium?: boolean;
}

const boldMap: { [key: string]: string } = {
  'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶',
  'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿',
  's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
  'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜',
  'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥',
  'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
  '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
};

const italicMap: { [key: string]: string } = {
  'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪',
  'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳',
  's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻',
  'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝗜',
  'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙',
  'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡'
};

const ResponseInput = ({ value, onChange, onSave, onOptimize, isOptimizing, isPremium = false }: ResponseInputProps) => {
  const { toast } = useToast();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation(['home', 'common']);

  const handleFormat = (type: 'bold' | 'italic') => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = value.substring(start, end);

    if (selectedText) {
      const charMap = type === 'bold' ? boldMap : italicMap;
      const formattedText = selectedText
        .split('')
        .map(char => charMap[char] || char)
        .join('');

      const newText = value.substring(0, start) + formattedText + value.substring(end);
      onChange(newText);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + formattedText.length;
          textareaRef.current.selectionEnd = start + formattedText.length;
          textareaRef.current.focus();
        }
      }, 0);
    } else {
      toast({
        title: t('home:response.selectionRequired'),
        description: t('home:response.selectionRequired'),
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
        placeholder={t('home:response.placeholder')}
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
          {t('home:response.save')}
        </Button>
        <Button
          onClick={onOptimize}
          className="flex-1 bg-secondary hover:bg-secondary/90"
          disabled={!value.trim() || isOptimizing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isOptimizing ? 'animate-spin' : ''}`} />
          {t('home:response.optimize')}
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
              <p>{isPremium ? t('home:response.voiceInput') : t('home:response.premiumOnly')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ResponseInput;
