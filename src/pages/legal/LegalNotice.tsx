import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LegalNotice = () => {
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

        <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>
        
        <div className="prose prose-purple max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">Éditeur du site</h2>
          <p>Inspire Daily est une marque de la société Eziom<br />
          Société par Actions Simplifiée (SAS)<br />
          Capital social : 1000€<br />
          RCS Marseille 922 234 216<br />
          Siège social : 47 chemin des Anémones, 13012 Marseille<br />
          Email : contact@inspire-daily.com</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Directeur de la publication</h2>
          <p>Le directeur de la publication est le représentant légal de la société Eziom.<br />
          Email : director@inspire-daily.com</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Hébergement</h2>
          <p>Le site est hébergé par :<br />
          Vercel Inc.<br />
          340 S Lemon Ave #4133<br />
          Walnut, CA 91789<br />
          États-Unis</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Propriété intellectuelle</h2>
          <p>L'ensemble du site inspire-daily.com est la propriété exclusive de la société Eziom. Toute reproduction, même partielle, est interdite sans autorisation préalable.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Protection des données</h2>
          <p>Conformément à la loi Informatique et Libertés du 6 janvier 1978, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.</p>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;