import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, RefreshCw, X } from "lucide-react";
import ResponseInput from '@/components/ResponseInput';
import { Response } from '@/lib/supabase';

interface ResponseCardProps {
  response: Response;
  editingId: number | null;
  editedResponse: string;
  isOptimizing: boolean;
  profile: any;
  onEdit: (response: Response) => void;
  onSave: (response: Response) => void;
  onOptimize: (response: Response) => void;
  setEditedResponse: (value: string) => void;
}

export const ResponseCard = ({
  response,
  editingId,
  editedResponse,
  isOptimizing,
  profile,
  onEdit,
  onSave,
  onOptimize,
  setEditedResponse
}: ResponseCardProps) => {
  const [editingOptimized, setEditingOptimized] = React.useState(false);

  const handleCancel = () => {
    const textToRestore = editingOptimized ? response.optimized_response || '' : response.response;
    setEditedResponse(textToRestore);
    setEditingOptimized(false);
    onEdit({ ...response, id: null });
  };

  const handleSave = () => {
    onSave({
      ...response,
      ...(editingOptimized 
        ? { optimized_response: editedResponse }
        : { response: editedResponse }
      )
    });
    setEditingOptimized(false);
  };

  const handleEdit = (isOptimized: boolean) => {
    const initialText = isOptimized ? response.optimized_response || '' : response.response;
    setEditedResponse(initialText);
    setEditingOptimized(isOptimized);
    onEdit(response);
  };

  return (
    <Card key={response.id}>
      <CardHeader>
        <h2 className="text-lg font-semibold">{response.question}</h2>
        <p className="text-sm text-muted-foreground">
          {new Date(response.created_at!).toLocaleDateString('fr-FR')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {editingId === response.id ? (
          <div className="space-y-4">
            <ResponseInput
              value={editedResponse}
              onChange={setEditedResponse}
              onSave={handleSave}
              onOptimize={() => onOptimize(response)}
              isOptimizing={isOptimizing}
              isPremium={profile?.subscription_type === 'premium'}
            />
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          </div>
        ) : (
          <>
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Réponse originale :</h3>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(false)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Éditer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOptimize(response)}
                    disabled={isOptimizing || !profile || profile.optimizations_count === 0}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isOptimizing ? 'animate-spin' : ''}`} />
                    Optimiser
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground">{response.response}</p>
            </div>
            {response.is_optimized && response.optimized_response && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Réponse optimisée :</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(true)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Éditer
                  </Button>
                </div>
                <p className="text-muted-foreground">{response.optimized_response}</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};