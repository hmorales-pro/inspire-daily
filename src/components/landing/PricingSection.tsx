import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PricingFeature } from "./PricingFeature";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const PricingSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['landing', 'common']);
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
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

  const handleUpgrade = async (subscriptionType: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
        navigate("/login");
        return;
      }

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
        description: t('common:errorOccurred'),
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };
  
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
                onClick={() => handleUpgrade('free')}
                disabled={isUpgrading}
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
                onClick={() => handleUpgrade('premium')}
                disabled={isUpgrading}
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
                onClick={() => handleUpgrade('premiumYear')}
                disabled={isUpgrading}
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
            </CardContent>
          </Card>

          {/* Lifetime Plan */}
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
              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90"
                onClick={() => handleUpgrade('lifetime')}
                disabled={isUpgrading}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};