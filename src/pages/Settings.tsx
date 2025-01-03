import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Loader2 } from "lucide-react";
import { useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { SubscriptionCard } from '@/components/settings/SubscriptionCard';
import { AccountCard } from '@/components/settings/AccountCard';

const Settings = () => {
  const { toast } = useToast();
  const { t } = useTranslation(['settings', 'common']);
  const [searchParams] = useSearchParams();

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

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Handle Stripe callback
  React.useEffect(() => {
    const checkPaymentStatus = async () => {
      if (searchParams.get('success') === 'true') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await refetch();
        toast({
          title: t('common:success'),
          description: t('settings:subscription.upgradeSuccess'),
        });
      } else if (searchParams.get('canceled') === 'true') {
        toast({
          description: t('settings:subscription.upgradeCanceled'),
        });
      }
    };

    checkPaymentStatus();
  }, [searchParams, toast, refetch, t]);

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
          {t('settings:title')}
        </h1>

        <div className="space-y-6">
          <SubscriptionCard profileData={profileData} />
          <AccountCard 
            email={session?.user?.email} 
            emailNotifications={profileData?.email_notifications}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;