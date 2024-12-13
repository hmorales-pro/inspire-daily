import React from 'react';
import { ResponseActions } from './ResponseActions';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from 'react-i18next';

interface ResponseContentProps {
  title: string;
  content: string;
  isOptimizing: boolean;
  profile: any;
  onEdit: () => void;
  onOptimize: () => void;
  isOriginalVersion?: boolean;
}

export const ResponseContent = ({
  title,
  content,
  isOptimizing,
  profile,
  onEdit,
  onOptimize,
  isOriginalVersion = true
}: ResponseContentProps) => {
  const { toast } = useToast();
  const { t } = useTranslation(['history', 'common']);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        description: t('history:response.copied'),
      });
    } catch (err) {
      toast({
        title: t('common:error'),
        description: t('history:response.copyError'),
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
          >
            <Copy className="w-4 h-4 mr-2" />
            {t('common:copy')}
          </Button>
          <ResponseActions
            isOptimizing={isOptimizing}
            profile={profile}
            onEdit={onEdit}
            onOptimize={onOptimize}
            showOptimize={isOriginalVersion}
          />
        </div>
      </div>
      <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
    </div>
  );
};