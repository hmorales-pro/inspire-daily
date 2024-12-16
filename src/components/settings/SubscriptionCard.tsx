import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { PricingGrid } from '../pricing/PricingGrid';

interface SubscriptionCardProps {
  profileData: any;
}

export const SubscriptionCard = ({ profileData }: SubscriptionCardProps) => {
  const { t } = useTranslation(['settings', 'common', 'landing']);
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleUpgrade = async (subscriptionType: string) => {
    try {
      setSelectedPlan(subscriptionType);
      setIsUpgrading(true);
      
      const response = await supabase.functions.invoke('create-checkout-session', {
        body: { subscriptionType }
      });
      
      if (response.error) throw response.error;
      
      const { url } = response.data;
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: t('common:error'),
        description: t('settings:subscription.upgradeError'),
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings:subscription.title')}</CardTitle>
        <CardDescription>{t('settings:subscription.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <PricingGrid
            onSelectPlan={handleUpgrade}
            isUpgrading={isUpgrading}
            selectedPlan={selectedPlan}
            currentPlan={profileData?.subscription_type}
            optimizationsCount={profileData?.optimizations_count}
            optimizationsResetDate={profileData?.optimizations_reset_date}
          />
        </div>
      </CardContent>
    </Card>
  );
};