import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: profileData, isLoading } = useQuery({
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
    return Math.max(0, Math.min(100, ((maxOptimizations - count) / maxOptimizations) * 100));
  };

  const handleUpgrade = () => {
    // TODO: Implement Stripe integration
    console.log('Upgrade to premium');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate('/login');
  };

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
        <p className="text-muted-foreground">Chargement...</p>
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
                <p className="text-sm font-medium">Type d'abonnement</p>
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
                <Button onClick={handleUpgrade} className="w-full">
                  Passer à l'abonnement Premium (5€/mois)
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