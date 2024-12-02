import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: profileData, isLoading, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const getOptimizationsLimit = () => {
    if (profileData?.subscription_type === 'premium') return Infinity;
    return 5;
  };

  const getRemainingOptimizations = () => {
    if (profileData?.subscription_type === 'premium') return 'Illimité';
    return profileData?.optimizations_count || 0;
  };

  const getNextResetDate = () => {
    if (!profileData?.optimizations_reset_date) return null;
    return new Date(profileData.optimizations_reset_date).toLocaleDateString('fr-FR');
  };

  const getProgressValue = () => {
    const limit = getOptimizationsLimit();
    if (limit === Infinity) return 100;
    const count = profileData?.optimizations_count || 0;
    const maxOptimizations = 5;
    return Math.max(0, Math.min(100, (count / maxOptimizations) * 100));
  };

  const handleUpgrade = async () => {
    try {
      setIsUpgrading(true);
      const response = await supabase.functions.invoke('create-checkout-session');
      
      if (response.error) throw response.error;
      
      const { url } = response.data;
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la session de paiement.",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate('/login');
  };

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      // Force un rechargement immédiat des données du profil
      refetch();
      
      // Invalider le cache pour forcer un rechargement lors de la prochaine requête
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      toast({
        title: "Succès !",
        description: "Votre abonnement Premium a été activé avec succès.",
      });
    } else if (searchParams.get('canceled') === 'true') {
      toast({
        description: "Le processus de paiement a été annulé.",
      });
    }
  }, [searchParams, toast, queryClient, refetch]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        queryClient.clear();
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-light p-4 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-light p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <h1 className="text-2xl font-bold text-center text-primary-dark mb-8">
          Paramètres
        </h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Abonnement</CardTitle>
              <CardDescription>
                Gérez votre abonnement et vos optimisations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Type d&apos;abonnement</p>
                <p className="text-2xl font-bold capitalize">
                  {profileData?.subscription_type || 'Gratuit'}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Optimisations restantes</p>
                <Progress 
                  value={getProgressValue()}
                  className="mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  {getRemainingOptimizations()} optimisation{getRemainingOptimizations() !== 1 ? 's' : ''} restante{getRemainingOptimizations() !== 1 ? 's' : ''}
                  {getNextResetDate() && ` (Réinitialisation le ${getNextResetDate()})`}
                </p>
              </div>

              {profileData?.subscription_type === 'free' && (
                <Button 
                  onClick={handleUpgrade} 
                  className="w-full" 
                  disabled={isUpgrading}
                >
                  {isUpgrading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirection vers le paiement...
                    </>
                  ) : (
                    "Passer à l'abonnement Premium (5€/mois)"
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compte</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-muted-foreground">{session?.user?.email}</p>
              </div>
              <Button onClick={handleSignOut} variant="destructive" className="w-full">
                Se déconnecter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;