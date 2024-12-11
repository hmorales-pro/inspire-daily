import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary-light">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <h1 className="text-3xl font-bold mb-8">Support</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Comment fonctionne Inspire Daily ?</h3>
                <p className="text-muted-foreground">Inspire Daily vous propose une question inspirante chaque jour pour vous aider à créer du contenu authentique pour vos réseaux sociaux.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Comment puis-je accéder à mon historique ?</h3>
                <p className="text-muted-foreground">Votre historique de réponses est accessible depuis l'onglet "Historique" dans la navigation principale.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Comment fonctionne l'optimisation des réponses ?</h3>
                <p className="text-muted-foreground">L'optimisation des réponses utilise l'IA pour améliorer la formulation de vos réponses tout en conservant votre message d'origine.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Nous contacter</h2>
            <p className="text-muted-foreground mb-4">Notre équipe est disponible pour vous aider. Contactez-nous par email ou via nos réseaux sociaux.</p>
            <div className="space-y-2">
              <p>Email : hugo.morales.pro@gmail.com</p>
              <p>Horaires : Du lundi au vendredi, 9h-18h</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Support;