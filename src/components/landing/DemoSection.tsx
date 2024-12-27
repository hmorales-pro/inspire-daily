import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import DailyQuestion from '../DailyQuestion';
import { TextFormatting } from '../TextFormatting';
import { Textarea } from '../ui/textarea';
import { Card, CardContent } from '../ui/card';
import { useToast } from '../ui/use-toast';
import { Button } from '../ui/button';
import { Copy } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

export const DemoSection = () => {
  const { t } = useTranslation(['landing']);
  const [demoText, setDemoText] = useState('');
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormat = (type: 'bold' | 'italic') => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = demoText.substring(start, end);

    if (!selectedText) {
      toast({
        title: t('demo.selectionRequired'),
        description: t('demo.selectionRequiredDesc'),
        variant: "destructive",
      });
      return;
    }

    // Convert text to bold or italic using proper Unicode characters
    const formattedText = type === 'bold'
      ? selectedText.split('').map(char => {
          // Map regular characters to their bold Unicode equivalents
          const boldMap: { [key: string]: string } = {
            'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
            'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
            'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
            'y': '𝘆', 'z': '𝘇', 'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙',
            'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
            'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩',
            'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭', '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯',
            '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
          };
          return boldMap[char] || char;
        }).join('')
      : selectedText.split('').map(char => {
          // Map regular characters to their italic Unicode equivalents
          const italicMap: { [key: string]: string } = {
            'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩',
            'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱',
            'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹',
            'y': '𝘺', 'z': '𝘻', 'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍',
            'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕',
            'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝',
            'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡'
          };
          return italicMap[char] || char;
        }).join('');

    const newText = 
      demoText.substring(0, start) + 
      formattedText + 
      demoText.substring(end);

    setDemoText(newText);

    // Restore focus and set new selection
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          start,
          start + formattedText.length
        );
      }
    }, 0);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(demoText);
      toast({
        description: t('demo.copied'),
      });
    } catch (err) {
      toast({
        title: t('common:error'),
        description: t('demo.copyError'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary-dark">
          {t('demo.title')}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-primary-dark">
              {t('demo.howItWorks')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  1
                </div>
                <p>{t('demo.step1')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  2
                </div>
                <p>{t('demo.step2')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  3
                </div>
                <p>{t('demo.step3')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  4
                </div>
                <p>{t('demo.step4')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-primary-dark">
              {t('demo.tryIt')}
            </h3>
            <DailyQuestion />
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-end mb-2 gap-2">
                  <TextFormatting onFormat={handleFormat} />
                  <TooltipProvider delayDuration={50}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleCopy}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{t('common:copy')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea
                  ref={textareaRef}
                  placeholder={t('demo.placeholder')}
                  value={demoText}
                  onChange={(e) => setDemoText(e.target.value)}
                  className="min-h-[150px] resize-none"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};