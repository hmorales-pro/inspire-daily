import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PricingFeature } from "./PricingFeature";
import { useTranslation } from "react-i18next";

export const PricingSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <div className="bg-primary-light py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary-dark">
          {t('landing.pricing.title')}
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {t('landing.pricing.subtitle')}
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{t('landing.pricing.free.title')}</CardTitle>
              <CardDescription>{t('landing.pricing.free.description')}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{t('landing.pricing.free.price')}€</span>
                <span className="text-gray-500">/mois</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {t('landing.pricing.free.features', { returnObjects: true }).map((feature, index) => (
                  <PricingFeature key={index} text={feature} />
                ))}
              </ul>
              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90"
                onClick={() => navigate("/login")}
              >
                {t('landing.hero.cta')}
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-white border-primary">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{t('landing.pricing.premium.title')}</CardTitle>
              <CardDescription>{t('landing.pricing.premium.description')}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{t('landing.pricing.premium.price')}€</span>
                <span className="text-gray-500">/mois</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {t('landing.pricing.premium.features', { returnObjects: true }).map((feature, index) => (
                  <PricingFeature key={index} text={feature} />
                ))}
              </ul>
              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90"
                onClick={() => navigate("/login")}
              >
                {t('landing.pricing.premium.title')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};