import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
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
      <footer className="bg-primary-light py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 Inspire Daily. Tous droits réservés.</p>
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