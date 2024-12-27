import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import DailyQuestion from '../DailyQuestion';
import { TextFormatting } from '../TextFormatting';
import { Textarea } from '../ui/textarea';
import { Card, CardContent } from '../ui/card';
import { useToast } from '../ui/use-toast';

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

    const prefix = type === 'bold' ? '**' : '_';
    const suffix = type === 'bold' ? '**' : '_';

    const newText = 
      demoText.substring(0, start) + 
      prefix + 
      selectedText + 
      suffix + 
      demoText.substring(end);

    setDemoText(newText);

    // Restore focus and set new selection
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          start + prefix.length,
          end + prefix.length
        );
      }
    }, 0);
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
                <div className="flex justify-end mb-2">
                  <TextFormatting onFormat={handleFormat} />
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