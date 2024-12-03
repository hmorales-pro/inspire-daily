import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Response } from '@/lib/supabase';
import { ResponseContent } from './response/ResponseContent';
import { ResponseEdit } from './response/ResponseEdit';

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
    const updatedResponse = {
      ...response,
      ...(editingOptimized
        ? { optimized_response: editedResponse }
        : { response: editedResponse })
    };
    onSave(updatedResponse);
    setEditingOptimized(false);
  };

  const handleEdit = (isOptimized: boolean) => {
    setEditingOptimized(isOptimized);
    const textToEdit = isOptimized ? response.optimized_response || '' : response.response;
    setEditedResponse(textToEdit);
    onEdit(response);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">{response.question}</h2>
        <p className="text-sm text-muted-foreground">
          {new Date(response.created_at!).toLocaleDateString('fr-FR')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {editingId === response.id ? (
          <ResponseEdit
            editedResponse={editedResponse}
            isOptimizing={isOptimizing}
            isPremium={profile?.subscription_type === 'premium'}
            onSave={handleSave}
            onCancel={handleCancel}
            onOptimize={() => onOptimize(response)}
            setEditedResponse={setEditedResponse}
          />
        ) : (
          <>
            <ResponseContent
              title="Réponse originale :"
              content={response.response}
              isOptimizing={isOptimizing}
              profile={profile}
              onEdit={() => handleEdit(false)}
              onOptimize={() => onOptimize(response)}
            />
            {response.is_optimized && response.optimized_response && (
              <ResponseContent
                title="Réponse optimisée :"
                content={response.optimized_response}
                isOptimizing={isOptimizing}
                profile={profile}
                onEdit={() => handleEdit(true)}
                onOptimize={() => onOptimize(response)}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};