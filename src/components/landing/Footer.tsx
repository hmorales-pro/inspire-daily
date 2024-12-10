import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              À propos
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-base text-gray-500 hover:text-gray-900">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Légal
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/legal/terms" className="text-base text-gray-500 hover:text-gray-900">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="text-base text-gray-500 hover:text-gray-900">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/legal/notice" className="text-base text-gray-500 hover:text-gray-900">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Réseaux sociaux
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="https://twitter.com/inspiredaily" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://instagram.com/inspiredaily" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/company/inspiredaily" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Newsletter
            </h3>
            <p className="text-base text-gray-500">
              Recevez nos actualités et conseils pour créer du contenu engageant.
            </p>
            <form className="mt-4">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
              <button
                type="submit"
                className="mt-2 w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 flex justify-center items-center space-x-2">
          <p className="text-base text-gray-400">
            © {new Date().getFullYear()} Inspire Daily. Tous droits réservés.
          </p>
          {import.meta.env.VITE_APP_VERSION && (
            <span className="text-xs text-gray-400">
              v{import.meta.env.VITE_APP_VERSION}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
};