import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ID</span>
              </div>
              <span className="text-xl font-bold text-white">Ivoiredocs.ci</span>
            </div>
            <p className="text-gray-400 max-w-md">
              La plateforme qui simplifie vos démarches administratives en Côte d'Ivoire. 
              Obtenez vos documents officiels sans vous déplacer.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-medium mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="hover:text-primary-400 transition-colors">
                  Documents disponibles
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-primary-400 transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-primary-400 transition-colors">
                  Comment ça marche
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="hover:text-primary-400 transition-colors">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a 
                  href="tel:+225XXXXXXXX" 
                  className="hover:text-primary-400 transition-colors"
                >
                  +225 XX XX XX XX
                </a>
              </li>
              <li>
                <a 
                  href="mailto:support@ivoiredocs.ci" 
                  className="hover:text-primary-400 transition-colors"
                >
                  support@ivoiredocs.ci
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Ivoiredocs.ci. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link 
              to="/privacy" 
              className="text-gray-400 hover:text-primary-400 text-sm transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Link 
              to="/terms" 
              className="text-gray-400 hover:text-primary-400 text-sm transition-colors"
            >
              Conditions d'utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}