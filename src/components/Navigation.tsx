import { Home, History, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2">
      <div className="max-w-md mx-auto flex justify-around items-center">
        <Link
          to="/"
          className={`flex flex-col items-center p-2 ${
            isActive("/") ? "text-primary" : "text-muted-foreground"
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
        
        <Link
          to="/settings"
          className={`flex flex-col items-center p-2 ${
            isActive("/settings") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs">Paramètres</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;