import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getResponses, type Response, updateResponse } from '@/lib/supabase';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Edit2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { optimizeResponse } from '@/lib/openai';
import ResponseInput from '@/components/ResponseInput';
import { supabase } from '@/lib/supabase';

// Composants extraits pour réduire la taille du fichier
import { ResponseCard } from '@/components/ResponseCard';
import { ResponseList } from '@/components/ResponseList';

const History = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedResponse, setEditedResponse] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: responses, isLoading, error } = useQuery({
    queryKey: ['responses'],
    queryFn: getResponses
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      console.log('Profile data:', data); // Debug log
      return data;
    }
  });

  const handleEdit = (response: Response) => {
    setEditingId(response.id!);
    setEditedResponse(response.response);
  };

  const handleSave = async (response: Response) => {
    try {
      await updateResponse(response.id!, {
        response: editedResponse,
      });
      
      toast({
        title: "Réponse mise à jour",
        description: "Votre réponse a été modifiée avec succès.",
      });
      
      setEditingId(null);
      setEditedResponse('');
      queryClient.invalidateQueries({ queryKey: ['responses'] });
    } catch (error) {
      console.error('Save error:', error); // Debug log
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive",
      });
    }
  };

  const handleOptimize = async (response: Response) => {
    console.log('Current profile:', profile); // Debug log
    console.log('Optimizations count:', profile?.optimizations_count); // Debug log
    
    if (!profile || profile.optimizations_count === 0) {
      toast({
        title: "Limite atteinte",
        description: "Vous avez atteint votre limite d'optimisations pour ce mois. Passez à l'abonnement premium pour des optimisations illimitées.",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    
    try {
      const optimizedContent = await optimizeResponse(response.response);
      
      // Mise à jour du compteur d'optimisations
      if (profile && profile.subscription_type === 'free') {
        console.log('Updating optimizations count...'); // Debug log
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            optimizations_count: Math.max(0, (profile.optimizations_count || 0) - 1)
          })
          .eq('id', profile.id);

        if (updateError) {
          console.error('Update error:', updateError); // Debug log
          throw updateError;
        }
        
        // Invalider le cache pour forcer le rechargement du profil
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
      
      await updateResponse(response.id!, {
        is_optimized: true,
        optimized_response: optimizedContent,
      });
      
      toast({
        title: "Réponse optimisée",
        description: "Votre contenu a été optimisé avec succès.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['responses'] });
    } catch (error) {
      console.error('Optimization error:', error); // Debug log
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'optimisation.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

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
                    <h2 className="text-lg font-semibold">{response.question}</h2>
                    <p className="text-sm text-muted-foreground">
                      {new Date(response.created_at!).toLocaleDateString('fr-FR')}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editingId === response.id ? (
                      <ResponseInput
                        value={editedResponse}
                        onChange={setEditedResponse}
                        onSave={() => handleSave(response)}
                        onOptimize={() => handleOptimize(response)}
                        isOptimizing={isOptimizing}
                      />
                    ) : (
                      <>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Réponse originale :</h3>
                            <div className="space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(response)}
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Éditer
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOptimize(response)}
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
                            <h3 className="font-medium mb-2">Réponse optimisée :</h3>
                            <p className="text-muted-foreground">{response.optimized_response}</p>
                          </div>
                        )}
                      </>
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