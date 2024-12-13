import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAppSettings } from "@/lib/settings";
import { useTranslation } from "react-i18next";

export const CTASection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { data: redirectUrl } = useQuery({
    queryKey: ['redirectUrl'],
    queryFn: () => getAppSettings('redirect_url'),
    initialData: 'https://inspire-daily.lovable.dev'
  });
  
  return (
    <div className="bg-primary-dark text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {t('landing.cta.title')}
        </h2>
        <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
          {t('landing.cta.subtitle')}
        </p>
        <Button 
          variant="outline" 
          size="lg"
          className="bg-white text-primary-dark hover:bg-gray-100 px-8 py-6 text-lg"
          onClick={() => navigate("/login")}
        >
          {t('landing.cta.button')}
        </Button>
      </div>
    </div>
  );
};