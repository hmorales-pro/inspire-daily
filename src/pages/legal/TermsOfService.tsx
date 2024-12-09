import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
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

        <h1 className="text-3xl font-bold mb-8">Conditions d'utilisation</h1>
        
        <div className="prose prose-purple max-w-none">
          <p className="text-lg mb-6">Dernière mise à jour : {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptation des conditions</h2>
          <p>En accédant et en utilisant Inspire Daily, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description du service</h2>
          <p>Inspire Daily est une plateforme qui fournit des questions quotidiennes pour stimuler la création de contenu sur les réseaux sociaux. Notre service inclut des fonctionnalités gratuites et premium.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Comptes utilisateurs</h2>
          <p>Pour utiliser certaines fonctionnalités de notre service, vous devez créer un compte. Vous êtes responsable de maintenir la confidentialité de votre compte et de toutes les activités qui s'y déroulent.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Utilisation acceptable</h2>
          <p>Vous acceptez de ne pas utiliser le service pour :</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Violer des lois ou règlements</li>
            <li>Enfreindre les droits de propriété intellectuelle</li>
            <li>Diffuser du contenu inapproprié ou offensant</li>
            <li>Perturber le fonctionnement du service</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Propriété intellectuelle</h2>
          <p>Tout le contenu fourni par Inspire Daily est protégé par les droits d'auteur et autres lois sur la propriété intellectuelle.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Modifications des conditions</h2>
          <p>Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur le site.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;