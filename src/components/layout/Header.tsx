import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ID</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Ivoiredocs.ci</span>
            </Link>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Tableau de bord
                </Link>
                <Link 
                  to="/requests/new" 
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Nouvelle demande
                </Link>
                <Link 
                  to="/requests" 
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Mes demandes
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/about" 
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  À propos
                </Link>
                <Link 
                  to="/services" 
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Services
                </Link>
              </>
            )}
          </nav>

          {/* Actions utilisateur */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <UserCircleIcon className="w-6 h-6" />
                  <span className="text-sm font-medium">
                    {profile?.name || user.email}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Mon profil
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Se connecter
                </Link>
                <Link
                  to="/auth/register"
                  className="btn-primary"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile ouvert */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-4">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tableau de bord
                  </Link>
                  <Link 
                    to="/requests/new" 
                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Nouvelle demande
                  </Link>
                  <Link 
                    to="/requests" 
                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mes demandes
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon profil
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Se déconnecter
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/about" 
                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    À propos
                  </Link>
                  <Link 
                    to="/services" 
                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Services
                  </Link>
                  <Link 
                    to="/auth/login" 
                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Se connecter
                  </Link>
                  <Link 
                    to="/auth/register" 
                    className="block btn-primary inline-block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}