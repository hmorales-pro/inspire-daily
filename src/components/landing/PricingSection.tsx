import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { PricingGrid } from "../pricing/PricingGrid";

export const PricingSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['landing', 'common']);
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleUpgrade = async (subscriptionType: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
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
      setSelectedPlan(null);
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
        <div className="max-w-7xl mx-auto">
          <PricingGrid
            onSelectPlan={handleUpgrade}
            isUpgrading={isUpgrading}
            selectedPlan={selectedPlan}
          />
        </div>
      </div>
    </div>
  );
};