import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ResponseInput from '../ResponseInput';
import { useTranslation } from 'react-i18next';

interface ResponseEditProps {
  editedResponse: string;
  isOptimizing: boolean;
  isPremium: boolean;
  onSave: () => void;
  onCancel: () => void;
  onOptimize: () => void;
  setEditedResponse: (value: string) => void;
  isEditingOptimized: boolean;
}

export const ResponseEdit = ({
  editedResponse,
  isOptimizing,
  isPremium,
  onSave,
  onCancel,
  onOptimize,
  setEditedResponse,
  isEditingOptimized
}: ResponseEditProps) => {
  const { t } = useTranslation(['history']);

  return (
    <div className="space-y-4">
      <h3 className="font-medium">
        {isEditingOptimized ? t('editOptimized') : t('editOriginal')}
      </h3>
      <ResponseInput
        value={editedResponse}
        onChange={setEditedResponse}
        onSave={onSave}
        onOptimize={onOptimize}
        isOptimizing={isOptimizing}
        isPremium={isPremium}
      />
      <Button
        variant="outline"
        onClick={onCancel}
        className="w-full"
      >
        <X className="w-4 h-4 mr-2" />
        {t('response.cancel')}
      </Button>
    </div>
  );
};