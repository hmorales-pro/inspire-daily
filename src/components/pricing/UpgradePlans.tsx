import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { PricingFeature } from "./PricingFeature";

interface UpgradePlansProps {
  onSelectPlan: (plan: string) => void;
  isUpgrading: boolean;
  selectedPlan: string | null;
  currentPlan: string;
}

export const UpgradePlans = ({
  onSelectPlan,
  isUpgrading,
  selectedPlan,
  currentPlan,
}: UpgradePlansProps) => {
  const { t } = useTranslation(['landing', 'common']);

  const getFeaturesArray = (path: string): string[] => {
    const features = t(path, { returnObjects: true });
    return Array.isArray(features) ? features : [];
  };

  // Filtrer les plans disponibles en fonction du plan actuel
  const getAvailablePlans = () => {
    const allPlans = ['premium', 'premiumYear', 'lifetime'];
    return allPlans.filter(plan => plan !== currentPlan);
  };

  const renderPlanCard = (planType: string) => {
    const planKey = planType === 'premiumYear' ? 'annual' : planType;
    const features = getFeaturesArray(`pricing.${planKey}.features`);

    return (
      <Card className="bg-white" key={planType}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              {t(`pricing.${planKey}.title`)}
            </CardTitle>
            {planType === 'lifetime' && (
              <Badge variant="secondary" className="ml-2">200 places</Badge>
            )}
          </div>
          <CardDescription>{t(`pricing.${planKey}.description`)}</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">
              {t(`pricing.${planKey}.price`)}€
            </span>
            <span className="text-gray-500 block text-sm mt-1">
              {planType === 'premium' ? '/mois' : t(`pricing.${planKey}.oneTime`)}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <PricingFeature key={index} text={feature} />
            ))}
          </ul>
          <Button 
            className="w-full mt-6 bg-primary hover:bg-primary/90"
            onClick={() => onSelectPlan(planType)}
            disabled={isUpgrading}
          >
            {isUpgrading && selectedPlan === planType ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common:loading')}
              </>
            ) : (
              t(`pricing.${planKey}.title`)
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {getAvailablePlans().map(renderPlanCard)}
    </div>
  );
};