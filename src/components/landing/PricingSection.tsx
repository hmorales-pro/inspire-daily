import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PricingFeature } from "./PricingFeature";

export const PricingSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-primary-light py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary-dark">
          Choisissez votre formule
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Des options flexibles pour partager votre quotidien sur les réseaux sociaux
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Gratuit</CardTitle>
              <CardDescription>Pour commencer votre voyage</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">0€</span>
                <span className="text-gray-500">/mois</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <PricingFeature text="1 question par jour" />
                <PricingFeature text="Historique limité à 30 jours" />
                <PricingFeature text="5 optimisations IA par mois" />
              </ul>
              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90"
                onClick={() => navigate("/login")}
              >
                Commencer gratuitement
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-white border-primary">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Premium</CardTitle>
              <CardDescription>Pour aller plus loin</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">5€</span>
                <span className="text-gray-500">/mois</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <PricingFeature text="1 question par jour" />
                <PricingFeature text="Historique illimité" />
                <PricingFeature text="Optimisations IA illimitées" />
                <PricingFeature text="Saisie vocale" />
              </ul>
              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90"
                onClick={() => navigate("/login")}
              >
                Choisir Premium
              </Button>
            </CardContent>
          </Card>

          {/* Annual Plan */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Annuel</CardTitle>
              <CardDescription>La meilleure valeur</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">50€</span>
                <span className="text-gray-500">/an</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <PricingFeature text="Tous les avantages Premium" />
                <PricingFeature text="2 mois gratuits" />
                <PricingFeature text="Support prioritaire" />
              </ul>
              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90"
                onClick={() => navigate("/login")}
              >
                Économiser 17%
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};