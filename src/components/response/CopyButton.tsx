import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CopyButtonProps {
  content: string;
}

export const CopyButton = ({ content }: CopyButtonProps) => {
  const { toast } = useToast();
  const { t } = useTranslation(['history', 'common']);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        description: t('response.copied'),
      });
    } catch (err) {
      toast({
        title: t('common:error'),
        description: t('response.copyError'),
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
    >
      <Copy className="w-4 h-4 mr-2" />
      {t('common:copy')}
    </Button>
  );
};