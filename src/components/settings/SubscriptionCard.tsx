import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubscriptionCardProps {
  profileData: any;
  isUpgrading: boolean;
  handleUpgrade: () => void;
}

export const SubscriptionCard = ({ profileData, isUpgrading, handleUpgrade }: SubscriptionCardProps) => {
  const { t } = useTranslation();
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.subscription.title')}</CardTitle>
        <CardDescription>{t('settings.subscription.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">{t('settings.subscription.type')}</h3>
          <p>
            {profileData?.subscription_type === 'premium' ? (
              <>
                Premium ({t('settings.subscription.active')})
              </>
            ) : (
              <>
                {t('settings.subscription.free')}
              </>
            )}
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-2">{t('settings.subscription.remainingOptimizations')}</h3>
          <p>
            {profileData?.subscription_type === 'premium' ? (
              t('settings.subscription.unlimited')
            ) : (
              <>
                {profileData?.optimizations_count} {t('settings.subscription.optimizations')}
                {profileData?.optimizations_reset_date && (
                  <span className="text-sm text-muted-foreground ml-2">
                    ({t('settings.subscription.resetDate')} {formatDate(profileData.optimizations_reset_date)})
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {profileData?.subscription_type !== 'premium' && (
          <div className="pt-4">
            <h3 className="font-medium mb-4">{t('settings.subscription.features.title')}</h3>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>{t('settings.subscription.features.unlimited')}</li>
              <li>{t('settings.subscription.features.history')}</li>
              <li>{t('settings.subscription.features.voice')}</li>
            </ul>

            <Button 
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full"
            >
              {isUpgrading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('settings.subscription.redirecting')}
                </>
              ) : (
                t('settings.subscription.upgrade')
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};