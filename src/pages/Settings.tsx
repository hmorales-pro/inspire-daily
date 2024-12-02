import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Profile {
  subscription_type: string;
  optimizations_count: number;
  optimizations_reset_date: string;
}

const Settings = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: profileData } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
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
    const limit = getOptimizationsLimit();
    if (limit === Infinity) return 'Illimité';
    return Math.max(0, limit - (profileData?.optimizations_count || 0));
  };

  const getNextResetDate = () => {
    if (!profileData?.optimizations_reset_date) return null;
    return new Date(profileData.optimizations_reset_date).toLocaleDateString('fr-FR');
  };

  const handleUpgrade = () => {
    // TODO: Implement Stripe integration
    console.log('Upgrade to premium');
  };

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
                  value={((profileData?.optimizations_count || 0) / getOptimizationsLimit()) * 100} 
                  className="mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  {getRemainingOptimizations()} optimisations restantes
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
            <CardContent>
              <p className="text-sm font-medium">Email</p>
              <p className="text-muted-foreground">{session?.user?.email}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;