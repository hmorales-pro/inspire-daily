import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LandingHeader from "@/components/LandingHeader";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white">
      <LandingHeader />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-dark mb-6 animate-fade-in">
            Développez votre réflexion personnelle jour après jour
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-fade-in">
            Une question inspirante chaque jour pour stimuler votre réflexion et approfondir votre connaissance de vous-même.
          </p>
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg animate-fade-in"
            onClick={() => navigate("/login")}
          >
            Commencer gratuitement
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              title="Une question par jour"
              description="Recevez chaque jour une nouvelle question stimulante pour approfondir votre réflexion personnelle."
              icon="🎯"
            />
            <FeatureCard
              title="Historique complet"
              description="Gardez une trace de toutes vos réponses et observez votre évolution au fil du temps."
              icon="📚"
            />
            <FeatureCard
              title="Optimisation IA"
              description="Utilisez notre assistant IA pour affiner et approfondir vos réponses."
              icon="✨"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à commencer votre voyage introspectif ?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Rejoignez notre communauté et commencez à développer votre réflexion personnelle dès aujourd'hui.
          </p>
          <Button 
            variant="outline" 
            size="lg"
            className="bg-white text-primary-dark hover:bg-gray-100 px-8 py-6 text-lg"
            onClick={() => navigate("/login")}
          >
            S'inscrire maintenant
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary-light py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-primary"
                >
                  <path d="M9 18h6"/>
                  <path d="M10 22h4"/>
                  <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8c0-1-.26-1.87-.78-2.6a5.06 5.06 0 00-2.12-1.82C14.31 3.2 13.36 3 12.35 3c-1.31 0-2.42.3-3.33.9-.91.6-1.6 1.4-2.06 2.4-.46 1-.69 2.1-.69 3.3 0 1.2.33 2.22.99 3.05.66.83 1.12 1.51 1.38 2.05.27.54.4 1.06.4 1.57v.01"/>
                </svg>
                <h3 className="text-lg font-bold text-primary">Inspire Daily</h3>
              </div>
              <p className="text-gray-600">
                Développez votre réflexion personnelle jour après jour avec des questions inspirantes.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-primary-dark">Produit</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Fonctionnalités</li>
                <li>Tarifs</li>
                <li>FAQ</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-primary-dark">Légal</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Conditions d'utilisation</li>
                <li>Politique de confidentialité</li>
                <li>Mentions légales</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-primary-dark">Contact</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Support</li>
                <li>Contact</li>
                <li>À propos</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
            <p>© 2024 Inspire Daily. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Composant FeatureCard
const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
  <div className="bg-gray-50 p-6 rounded-lg text-center animate-fade-in">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-3 text-primary-dark">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Landing;