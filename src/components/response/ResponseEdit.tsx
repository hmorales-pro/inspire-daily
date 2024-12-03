import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ResponseInput from '../ResponseInput';

interface ResponseEditProps {
  editedResponse: string;
  isOptimizing: boolean;
  isPremium: boolean;
  onSave: () => void;
  onCancel: () => void;
  onOptimize: () => void;
  setEditedResponse: (value: string) => void;
}

export const ResponseEdit = ({
  editedResponse,
  isOptimizing,
  isPremium,
  onSave,
  onCancel,
  onOptimize,
  setEditedResponse
}: ResponseEditProps) => {
  return (
    <div className="space-y-4">
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
        Annuler
      </Button>
    </div>
  );
};