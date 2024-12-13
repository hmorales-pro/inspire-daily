import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAppSettings } from "@/lib/settings";
import { useTranslation } from "react-i18next";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { data: redirectUrl } = useQuery({
    queryKey: ['redirectUrl'],
    queryFn: () => getAppSettings('redirect_url'),
    initialData: 'https://inspire-daily.lovable.dev'
  });
  
  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary-dark mb-6 animate-fade-in">
          {t('landing.hero.title')}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-fade-in">
          {t('landing.hero.subtitle')}
        </p>
        <Button 
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg animate-fade-in"
          onClick={() => navigate("/login")}
        >
          {t('landing.hero.cta')}
        </Button>
      </div>
    </div>
  );
};