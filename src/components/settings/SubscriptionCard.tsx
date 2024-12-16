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
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

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
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">{t('settings:subscription.type')}</h3>
            <p className="text-lg">
              {profileData?.subscription_type === 'premium' ? (
                <span className="text-green-600 font-medium">
                  Premium ({t('settings:subscription.active')})
                </span>
              ) : profileData?.subscription_type === 'premiumYear' ? (
                <span className="text-green-600 font-medium">
                  {t('landing:pricing.annual.title')} ({t('settings:subscription.active')})
                </span>
              ) : profileData?.subscription_type === 'lifetime' ? (
                <span className="text-green-600 font-medium">
                  {t('landing:pricing.lifetime.title')} ({t('settings:subscription.active')})
                </span>
              ) : (
                <span className="text-muted-foreground">
                  {t('settings:subscription.free')}
                </span>
              )}
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">{t('settings:subscription.remainingOptimizations')}</h3>
            <p className="text-lg">
              {profileData?.subscription_type !== 'free' ? (
                <span className="text-green-600 font-medium">
                  {t('settings:subscription.unlimited')}
                </span>
              ) : (
                <div className="space-y-1">
                  <span className="text-xl font-medium">
                    {profileData?.optimizations_count} {t('settings:subscription.optimizations')}
                  </span>
                  {profileData?.optimizations_reset_date && (
                    <p className="text-sm text-muted-foreground">
                      {t('settings:subscription.resetDate')} {formatDate(profileData.optimizations_reset_date)}
                    </p>
                  )}
                </div>
              )}
            </p>
          </div>
        </div>

        {profileData?.subscription_type === 'free' && (
          <div className="space-y-4 pt-4">
            <div className="space-y-4">
              <h3 className="font-medium">{t('settings:subscription.upgradePlans')}</h3>
              <PricingGrid
                onSelectPlan={handleUpgrade}
                isUpgrading={isUpgrading}
                selectedPlan={selectedPlan}
                showAllPlans={false}
                currentPlan={profileData?.subscription_type}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};