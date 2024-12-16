import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PricingFeature } from "./PricingFeature";

interface PricingGridProps {
  onSelectPlan: (plan: string) => void;
  isUpgrading: boolean;
  selectedPlan: string | null;
  showAllPlans?: boolean;
  currentPlan?: string;
  optimizationsCount?: number;
  optimizationsResetDate?: string;
}

export const PricingGrid = ({ 
  onSelectPlan, 
  isUpgrading, 
  selectedPlan,
  showAllPlans = true,
  currentPlan,
  optimizationsCount,
  optimizationsResetDate
}: PricingGridProps) => {
  const { t } = useTranslation(['landing', 'common', 'settings']);
  
  const getFeaturesArray = (path: string): string[] => {
    const features = t(path, { returnObjects: true });
    if (!features) return [];
    
    if (Array.isArray(features)) {
      return features.map(item => String(item));
    }
    
    console.warn(`Translation for ${path} is not an array:`, features);
    return [];
  };

  const freeFeatures = getFeaturesArray('pricing.free.features');
  const premiumFeatures = getFeaturesArray('pricing.premium.features');
  const annualFeatures = getFeaturesArray('pricing.annual.features');
  const lifetimeFeatures = getFeaturesArray('pricing.lifetime.features');

  // Ne pas afficher le plan gratuit si l'utilisateur est déjà sur un plan payant
  const shouldShowFreePlan = showAllPlans || currentPlan === 'free';

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {shouldShowFreePlan && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{t('pricing.free.title')}</CardTitle>
            <CardDescription>{t('pricing.free.description')}</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">{t('pricing.free.price')}€</span>
              <span className="text-gray-500">/mois</span>
            </div>
            {currentPlan === 'free' && optimizationsCount !== undefined && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
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
              {freeFeatures.map((feature, index) => (
                <PricingFeature key={index} text={feature} />
              ))}
            </ul>
            {currentPlan !== 'free' && (
              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90"
                onClick={() => onSelectPlan('free')}
                disabled={isUpgrading || currentPlan === 'free'}
              >
                {isUpgrading && selectedPlan === 'free' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common:loading')}
                  </>
                ) : (
                  t('hero.cta')
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-white border-primary">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t('pricing.premium.title')}</CardTitle>
          <CardDescription>{t('pricing.premium.description')}</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">{t('pricing.premium.price')}€</span>
            <span className="text-gray-500">/mois</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {premiumFeatures.map((feature, index) => (
              <PricingFeature key={index} text={feature} />
            ))}
          </ul>
          {currentPlan !== 'premium' && (
            <Button 
              className="w-full mt-6 bg-primary hover:bg-primary/90"
              onClick={() => onSelectPlan('premium')}
              disabled={isUpgrading || currentPlan === 'premium'}
            >
              {isUpgrading && selectedPlan === 'premium' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common:loading')}
                </>
              ) : (
                t('pricing.premium.title')
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white border-primary">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t('pricing.annual.title')}</CardTitle>
          <CardDescription>{t('pricing.annual.description')}</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">{t('pricing.annual.price')}€</span>
            <span className="text-gray-500 block text-sm mt-1">{t('pricing.annual.oneTime')}</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {annualFeatures.map((feature, index) => (
              <PricingFeature key={index} text={feature} />
            ))}
          </ul>
          {currentPlan !== 'premiumYear' && (
            <Button 
              className="w-full mt-6 bg-primary hover:bg-primary/90"
              onClick={() => onSelectPlan('premiumYear')}
              disabled={isUpgrading || currentPlan === 'premiumYear'}
            >
              {isUpgrading && selectedPlan === 'premiumYear' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common:loading')}
                </>
              ) : (
                t('pricing.annual.title')
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-primary relative overflow-hidden">
        <div className="absolute -right-12 top-6 rotate-45 bg-primary text-white px-12 py-1.5 text-sm text-center">
          {t('pricing.lifetime.exclusive')}
        </div>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            {t('pricing.lifetime.title')}
            <Badge variant="secondary" className="ml-2">200 places</Badge>
          </CardTitle>
          <CardDescription>{t('pricing.lifetime.description')}</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">{t('pricing.lifetime.price')}€</span>
            <span className="text-gray-500 block text-sm mt-1">{t('pricing.lifetime.oneTime')}</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {lifetimeFeatures.map((feature, index) => (
              <PricingFeature key={index} text={feature} />
            ))}
          </ul>
          {currentPlan !== 'lifetime' && (
            <Button 
              className="w-full mt-6 bg-primary hover:bg-primary/90"
              onClick={() => onSelectPlan('lifetime')}
              disabled={isUpgrading || currentPlan === 'lifetime'}
            >
              {isUpgrading && selectedPlan === 'lifetime' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common:loading')}
                </>
              ) : (
                t('pricing.lifetime.title')
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};