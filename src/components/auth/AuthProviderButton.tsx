import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BackButton = () => {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      onClick={() => navigate('/')}
      className="mb-4 text-primary hover:text-primary/90"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Retour
    </Button>
  );
};