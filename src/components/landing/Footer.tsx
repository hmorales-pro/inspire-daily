import { useQuery } from "@tanstack/react-query";
import { getAppSettings } from "@/lib/settings";

export const Footer = () => {
  const { data: version } = useQuery({
    queryKey: ['app-version'],
    queryFn: () => getAppSettings('app_version'),
  });

  return (
    <footer className="bg-primary-light py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div>
            <div className="flex items-center space-x-2 mb-4">
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
              <h3 className="text-lg font-bold text-primary">Inspire Daily</h3>
            </div>
            <p className="text-gray-600">
              Développez votre réflexion personnelle jour après jour avec des questions inspirantes.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-primary-dark">Produit</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Fonctionnalités</li>
              <li>Tarifs</li>
              <li>FAQ</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-primary-dark">Légal</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Conditions d'utilisation</li>
              <li>Politique de confidentialité</li>
              <li>Mentions légales</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-primary-dark">Contact</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Support</li>
              <li>Contact</li>
              <li>À propos</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
          <div className="flex justify-between items-center">
            <p>© 2024 Inspire Daily. Tous droits réservés.</p>
            {version && <p className="text-sm text-muted-foreground">v{version}</p>}
          </div>
        </div>
      </div>
    </footer>
  );
};