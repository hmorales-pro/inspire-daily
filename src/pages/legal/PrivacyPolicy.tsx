import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
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

        <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>
        
        <div className="prose prose-purple max-w-none">
          <p className="text-lg mb-6">Dernière mise à jour : {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Collecte des données</h2>
          <p>Nous collectons les informations suivantes :</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Informations de compte (email, nom d'utilisateur)</li>
            <li>Données d'utilisation du service</li>
            <li>Informations de paiement (via notre processeur de paiement)</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Utilisation des données</h2>
          <p>Nous utilisons vos données pour :</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Fournir et améliorer nos services</li>
            <li>Communiquer avec vous</li>
            <li>Personnaliser votre expérience</li>
            <li>Traiter vos paiements</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Protection des données</h2>
          <p>Nous prenons la sécurité de vos données très au sérieux et mettons en place des mesures appropriées pour les protéger.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Cookies</h2>
          <p>Nous utilisons des cookies pour améliorer votre expérience sur notre site. Vous pouvez contrôler les cookies via les paramètres de votre navigateur.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Vos droits</h2>
          <p>Vous avez le droit de :</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Accéder à vos données personnelles</li>
            <li>Rectifier vos données</li>
            <li>Supprimer vos données</li>
            <li>Vous opposer au traitement</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact</h2>
          <p>Pour toute question concernant notre politique de confidentialité, contactez-nous à hugo.morales.pro@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;