import { Home, History } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  // Ne pas afficher la navigation sur la landing page et la page de login
  if (location.pathname === "/" || location.pathname === "/login") {
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2">
      <div className="max-w-md mx-auto flex justify-around items-center">
        <Link
          to="/home"
          className={`flex flex-col items-center p-2 ${
            isActive("/home") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Accueil</span>
        </Link>
        
        <Link
          to="/history"
          className={`flex flex-col items-center p-2 ${
            isActive("/history") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <History className="h-5 w-5" />
          <span className="text-xs">Historique</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;