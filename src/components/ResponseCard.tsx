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
  const [isEditingOptimized, setIsEditingOptimized] = React.useState(false);

  const handleCancel = () => {
    const textToRestore = isEditingOptimized ? response.optimized_response || '' : response.response;
    setEditedResponse(textToRestore);
    setIsEditingOptimized(false);
    onEdit({ ...response, id: null });
  };

  const handleSave = () => {
    const updatedResponse = {
      ...response,
      ...(isEditingOptimized
        ? { optimized_response: editedResponse }
        : { response: editedResponse })
    };
    onSave(updatedResponse);
    setIsEditingOptimized(false);
  };

  const handleEdit = (isOptimized: boolean) => {
    // Important: On met à jour d'abord isEditingOptimized pour que le bon texte soit chargé
    setIsEditingOptimized(isOptimized);
    // Ensuite on charge le texte correspondant
    const textToEdit = isOptimized ? response.optimized_response || '' : response.response;
    // On met à jour le texte dans la textarea
    setEditedResponse(textToEdit);
    // On informe le parent que nous sommes en mode édition
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
            isEditingOptimized={isEditingOptimized}
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
              isOriginalVersion={true}
            />
            {response.is_optimized && response.optimized_response && (
              <ResponseContent
                title="Réponse optimisée :"
                content={response.optimized_response}
                isOptimizing={isOptimizing}
                profile={profile}
                onEdit={() => handleEdit(true)}
                onOptimize={() => onOptimize(response)}
                isOriginalVersion={false}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};