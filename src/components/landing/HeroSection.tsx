import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};