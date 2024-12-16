import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface OptimizedResponseCardProps {
  optimizedResponse: string;
}

const OptimizedResponseCard = ({ optimizedResponse }: OptimizedResponseCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['home', 'common']);

  const handleEditClick = () => {
    navigate('/login');
  };

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold">{t('home:response.optimizedVersion')}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEditClick}
          className="flex items-center gap-2"
        >
          <Edit2 className="w-4 h-4" />
          {t('common:edit')}
        </Button>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{optimizedResponse}</p>
      </CardContent>
    </Card>
  );
};

export default OptimizedResponseCard;