import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingFeature } from "./PricingFeature";

interface CurrentPlanProps {
  currentPlan: string;
  optimizationsCount?: number;
  optimizationsResetDate?: string;
}

export const CurrentPlan = ({ 
  currentPlan, 
  optimizationsCount, 
  optimizationsResetDate 
}: CurrentPlanProps) => {
  const { t } = useTranslation(['landing', 'settings']);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const getPlanFeatures = () => {
    const planKey = currentPlan === 'premiumYear' ? 'annual' : currentPlan;
    const features = t(`pricing.${planKey}.features`, { returnObjects: true });
    return Array.isArray(features) ? features : [];
  };

  const getPlanPrice = () => {
    switch (currentPlan) {
      case 'premium':
        return '5€/mois';
      case 'premiumYear':
        return '50€/an';
      case 'lifetime':
        return '85€';
      default:
        return '0€/mois';
    }
  };

  return (
    <Card className="w-full mb-8 bg-primary/5 border-primary">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          <CardTitle className="text-2xl font-bold">
            {t(`pricing.${currentPlan === 'premiumYear' ? 'annual' : currentPlan}.title`)}
          </CardTitle>
        </div>
        <CardDescription>
          {t('settings:subscription.currentPlan')}
        </CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">{getPlanPrice()}</span>
        </div>
        {currentPlan === 'free' && optimizationsCount !== undefined && (
          <div className="mt-4 p-4 bg-white rounded-lg">
            <p className="text-sm font-medium text-gray-900">
              {optimizationsCount} {t('settings:subscription.optimizations')}
            </p>
            {optimizationsResetDate && (
              <p className="text-xs text-gray-500 mt-1">
                {t('settings:subscription.resetDate')} {formatDate(optimizationsResetDate)}
              </p>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {getPlanFeatures().map((feature, index) => (
            <PricingFeature key={index} text={feature} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};