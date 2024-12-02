import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getResponses, type Response } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const History = () => {
  const { data: responses, isLoading, error } = useQuery({
    queryKey: ['responses'],
    queryFn: getResponses
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-light p-4 flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary-light p-4 flex items-center justify-center">
        <p className="text-destructive">Une erreur est survenue lors du chargement de l'historique.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-light p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <h1 className="text-2xl font-bold text-center text-primary-dark mb-8">
          Historique
        </h1>
        
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {responses?.length === 0 ? (
              <p className="text-center text-muted-foreground">
                Aucune réponse enregistrée pour le moment.
              </p>
            ) : (
              responses?.map((response: Response) => (
                <Card key={response.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{response.question}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(response.created_at!).toLocaleDateString('fr-FR')}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Réponse originale :</h3>
                      <p className="text-muted-foreground">{response.response}</p>
                    </div>
                    {response.is_optimized && response.optimized_response && (
                      <div>
                        <h3 className="font-medium mb-2">Réponse optimisée :</h3>
                        <p className="text-muted-foreground">{response.optimized_response}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default History;