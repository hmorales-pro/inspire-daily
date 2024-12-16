import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

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
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings:subscription.title')}</CardTitle>
        <CardDescription>{t('settings:subscription.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">{t('settings:subscription.type')}</h3>
          <p>
            {profileData?.subscription_type === 'premium' ? (
              <>
                Premium ({t('settings:subscription.active')})
              </>
            ) : profileData?.subscription_type === 'premiumYear' ? (
              <>
                {t('landing:pricing.annual.title')} ({t('settings:subscription.active')})
              </>
            ) : profileData?.subscription_type === 'lifetime' ? (
              <>
                {t('landing:pricing.lifetime.title')} ({t('settings:subscription.active')})
              </>
            ) : (
              <>
                {t('settings:subscription.free')}
              </>
            )}
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-2">{t('settings:subscription.remainingOptimizations')}</h3>
          <p>
            {profileData?.subscription_type !== 'free' ? (
              t('settings:subscription.unlimited')
            ) : (
              <>
                {profileData?.optimizations_count} {t('settings:subscription.optimizations')}
                {profileData?.optimizations_reset_date && (
                  <span className="text-sm text-muted-foreground ml-2">
                    ({t('settings:subscription.resetDate')} {formatDate(profileData.optimizations_reset_date)})
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {profileData?.subscription_type === 'free' && (
          <div className="space-y-4 pt-4">
            <div className="space-y-4">
              <h3 className="font-medium">{t('settings:subscription.upgradePlans')}</h3>
              
              {/* Premium mensuel */}
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-semibold">{t('landing:pricing.premium.title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('landing:pricing.premium.description')}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{t('landing:pricing.premium.price')}€</div>
                    <div className="text-sm text-muted-foreground">/mois</div>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => handleUpgrade('premium')}
                  disabled={isUpgrading}
                >
                  {isUpgrading && selectedPlan === 'premium' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('settings:subscription.redirecting')}
                    </>
                  ) : (
                    t('settings:subscription.choosePlan')
                  )}
                </Button>
              </Card>

              {/* Premium annuel */}
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-semibold">{t('landing:pricing.annual.title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('landing:pricing.annual.description')}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{t('landing:pricing.annual.price')}€</div>
                    <div className="text-sm text-muted-foreground">{t('landing:pricing.annual.oneTime')}</div>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => handleUpgrade('premiumYear')}
                  disabled={isUpgrading}
                >
                  {isUpgrading && selectedPlan === 'premiumYear' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('settings:subscription.redirecting')}
                    </>
                  ) : (
                    t('settings:subscription.choosePlan')
                  )}
                </Button>
              </Card>

              {/* Lifetime */}
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-semibold">{t('landing:pricing.lifetime.title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('landing:pricing.lifetime.description')}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{t('landing:pricing.lifetime.price')}€</div>
                    <div className="text-sm text-muted-foreground">{t('landing:pricing.lifetime.oneTime')}</div>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => handleUpgrade('lifetime')}
                  disabled={isUpgrading}
                >
                  {isUpgrading && selectedPlan === 'lifetime' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('settings:subscription.redirecting')}
                    </>
                  ) : (
                    t('settings:subscription.choosePlan')
                  )}
                </Button>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};