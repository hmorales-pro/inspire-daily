import { useState } from 'react';

export const useHistoryState = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedResponse, setEditedResponse] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  return {
    editingId,
    editedResponse,
    isOptimizing,
    setEditingId,
    setEditedResponse,
    setIsOptimizing
  };
};