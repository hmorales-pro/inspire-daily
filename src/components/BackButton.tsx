import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export const BackButton = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  return (
    <Button
      variant="ghost"
      onClick={() => navigate(-1)}
      className="mb-6"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {t('back')}
    </Button>
  );
};