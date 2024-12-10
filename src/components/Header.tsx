import { useNavigate } from 'react-router-dom';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { History, Home, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-primary"
            >
              <path d="M9 18h6"/>
              <path d="M10 22h4"/>
              <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8c0-1-.26-1.87-.78-2.6a5.06 5.06 0 00-2.12-1.82C14.31 3.2 13.36 3 12.35 3c-1.31 0-2.42.3-3.33.9-.91.6-1.6 1.4-2.06 2.4-.46 1-.69 2.1-.69 3.3 0 1.2.33 2.22.99 3.05.66.83 1.12 1.51 1.38 2.05.27.54.4 1.06.4 1.57v.01"/>
            </svg>
            <h1 className="text-xl font-bold text-primary">
              Inspire Daily
              {import.meta.env.VITE_APP_VERSION && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">v{import.meta.env.VITE_APP_VERSION}</span>
              )}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-2 ${
                isActive("/home") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
              onClick={() => navigate('/home')}
            >
              <Home className="h-5 w-5" />
              <span className="hidden sm:inline">Accueil</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-2 ${
                isActive("/history") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
              onClick={() => navigate('/history')}
            >
              <History className="h-5 w-5" />
              <span className="hidden sm:inline">Historique</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-2 ${
                isActive("/settings") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
              onClick={() => navigate('/settings')}
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">Profil</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;