import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
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

        <h1 className="text-3xl font-bold mb-8">À propos d'Inspire Daily</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Notre mission</h2>
            <p className="text-muted-foreground">
              Inspire Daily est né d'une vision simple : aider les créateurs de contenu à partager des histoires authentiques et engageantes sur les réseaux sociaux. Nous croyons que chacun a une histoire unique à raconter, et notre mission est de vous aider à la partager.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Notre approche</h2>
            <p className="text-muted-foreground">
              Chaque jour, nous vous proposons une question soigneusement choisie pour stimuler votre créativité et vous encourager à partager votre authenticité. Notre technologie d'optimisation par IA vous aide ensuite à affiner vos messages tout en préservant votre voix unique.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Notre équipe</h2>
            <p className="text-muted-foreground">
              Inspire Daily est porté par une équipe passionnée de créateurs, développeurs et experts en médias sociaux. Nous travaillons chaque jour pour améliorer votre expérience et vous aider à créer du contenu qui résonne avec votre audience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Nos valeurs</h2>
            <ul className="space-y-4">
              <li>
                <h3 className="font-medium">Authenticité</h3>
                <p className="text-muted-foreground">Nous encourageons le partage d'histoires vraies et personnelles.</p>
              </li>
              <li>
                <h3 className="font-medium">Innovation</h3>
                <p className="text-muted-foreground">Nous utilisons la technologie pour améliorer, pas pour remplacer la créativité humaine.</p>
              </li>
              <li>
                <h3 className="font-medium">Communauté</h3>
                <p className="text-muted-foreground">Nous créons un espace où chacun peut s'exprimer et grandir ensemble.</p>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;