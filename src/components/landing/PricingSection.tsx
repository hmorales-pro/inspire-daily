import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PricingFeature } from "./PricingFeature";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

export const PricingSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('landing');
  
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
  
  return (
    <div className="bg-primary-light py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary-dark">
          {t('pricing.title')}
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {t('pricing.subtitle')}
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{t('pricing.free.title')}</CardTitle>
              <CardDescription>{t('pricing.free.description')}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{t('pricing.free.price')}€</span>
                <span className="text-gray-500">/mois</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {freeFeatures.map((feature, index) => (
                  <PricingFeature key={index} text={feature} />
                ))}
              </ul>
              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90"
                onClick={() => navigate("/login")}
              >
                {t('hero.cta')}
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
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
              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90"
                onClick={() => navigate("/login")}
              >
                {t('pricing.premium.title')}
              </Button>
            </CardContent>
          </Card>

          {/* Annual Plan */}
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
              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90"
                onClick={() => navigate("/login")}
              >
                {t('pricing.annual.title')}
              </Button>
            </CardContent>
          </Card>

          {/* Lifetime Plan */}
          <Card className="bg-white border-2 border-primary relative overflow-hidden">
            <div className="absolute -right-12 top-6 rotate-45 bg-primary text-white px-12 py-1 text-sm">
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
              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90"
                onClick={() => navigate("/login")}
              >
                {t('pricing.lifetime.title')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
