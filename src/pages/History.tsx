import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getResponses, updateResponse } from '@/lib/supabase';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { optimizeResponse } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { ResponseList } from '@/components/ResponseList';
import { useHistoryState } from '@/hooks/useHistoryState';
import { filterResponsesBySubscription } from '@/utils/responseFilters';

const History = () => {
  const { editingId, editedResponse, isOptimizing, setEditingId, setEditedResponse, setIsOptimizing } = useHistoryState();
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
      return data;
    }
  });

  const handleEdit = (response) => {
    setEditingId(response.id);
    setEditedResponse(response.response);
  };

  const handleSave = async (response) => {
    try {
      // Nous utilisons maintenant l'objet response complet qui contient les bonnes propriétés à mettre à jour
      await updateResponse(response.id, response);
      
      toast({
        title: "Réponse mise à jour",
        description: "Votre réponse a été modifiée avec succès.",
      });
      
      setEditingId(null);
      setEditedResponse('');
      queryClient.invalidateQueries({ queryKey: ['responses'] });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive",
      });
    }
  };

  const handleOptimize = async (response) => {
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
      
      if (profile && profile.subscription_type === 'free') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            optimizations_count: Math.max(0, (profile.optimizations_count || 0) - 1)
          })
          .eq('id', profile.id);

        if (updateError) throw updateError;
        
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
      
      await updateResponse(response.id, {
        is_optimized: true,
        optimized_response: optimizedContent,
      });
      
      toast({
        title: "Réponse optimisée",
        description: "Votre contenu a été optimisé avec succès.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['responses'] });
    } catch (error) {
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

  const filteredResponses = filterResponsesBySubscription(responses, profile?.subscription_type);

  return (
    <div className="min-h-screen bg-primary-light p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <h1 className="text-2xl font-bold text-center text-primary-dark mb-8">
          Historique
        </h1>
        
        <ScrollArea className="h-[calc(100vh-200px)]">
          <ResponseList
            responses={filteredResponses}
            editingId={editingId}
            editedResponse={editedResponse}
            isOptimizing={isOptimizing}
            profile={profile}
            onEdit={handleEdit}
            onSave={handleSave}
            onOptimize={handleOptimize}
            setEditedResponse={setEditedResponse}
          />
        </ScrollArea>
      </div>
    </div>
  );
};

export default History;