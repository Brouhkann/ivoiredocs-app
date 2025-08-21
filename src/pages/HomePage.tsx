import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const { user } = useAuthStore();

  const documents = [
    {
      type: 'acte_naissance',
      name: 'Acte de naissance',
      price: '2 000 FCFA',
      time: '24h',
      service: 'Mairie'
    },
    {
      type: 'acte_mariage',
      name: 'Acte de mariage',
      price: '2 500 FCFA',
      time: '24h',
      service: 'Mairie'
    },
    {
      type: 'casier_judiciaire',
      name: 'Casier judiciaire',
      price: '3 000 FCFA',
      time: '72h',
      service: 'Tribunal'
    },
    {
      type: 'certificat_nationalite',
      name: 'Certificat de nationalité',
      price: '5 000 FCFA',
      time: '48h',
      service: 'Sous-préfecture'
    }
  ];

  const features = [
    {
      icon: ClockIcon,
      title: 'Rapide et efficace',
      description: 'Obtenez vos documents en 24-72h selon le type'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Sécurisé',
      description: 'Vos données sont protégées et chiffrées'
    },
    {
      icon: UserGroupIcon,
      title: 'Délégués certifiés',
      description: 'Réseau de délégués vérifiés dans toute la Côte d\'Ivoire'
    },
    {
      icon: StarIcon,
      title: 'Service noté',
      description: 'Système de notation pour garantir la qualité'
    }
  ];

  const cities = ['Abidjan', 'Bouaké', 'San-Pédro', 'Yamoussoukro', 'Daloa', 'Korhogo'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Vos documents administratifs
                <span className="block text-secondary-400">sans déplacement</span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
                Obtenez vos extraits d'actes, casier judiciaire et autres documents officiels 
                directement chez vous grâce à notre réseau de délégués certifiés.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl bg-white text-primary-600 hover:bg-gray-50 transition-colors shadow-lg"
                  >
                    Accéder au tableau de bord
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/auth/register"
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl bg-white text-primary-600 hover:bg-gray-50 transition-colors shadow-lg"
                    >
                      Commencer maintenant
                    </Link>
                    <Link
                      to="/auth/login"
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl border-2 border-white text-white hover:bg-white hover:text-primary-600 transition-colors"
                    >
                      Se connecter
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-6">
                {documents.map((doc, index) => (
                  <div 
                    key={doc.type}
                    className={`card bg-white/10 backdrop-blur-sm border-white/20 ${
                      index % 2 === 0 ? 'translate-y-8' : ''
                    }`}
                  >
                    <div className="text-center">
                      <DocumentTextIcon className="w-8 h-8 text-secondary-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-white mb-2">{doc.name}</h3>
                      <p className="text-primary-200 text-sm mb-2">{doc.service}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-secondary-400 font-semibold">{doc.price}</span>
                        <span className="text-primary-200">{doc.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Ivoiredocs.ci ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une solution moderne et sécurisée pour simplifier vos démarches administratives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Documents disponibles
            </h2>
            <p className="text-xl text-gray-600">
              Tous vos documents administratifs essentiels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {documents.map((doc) => (
              <div key={doc.type} className="card hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <DocumentTextIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{doc.service}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-primary-600 font-bold">{doc.price}</span>
                    <span className="text-gray-500 text-sm flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {doc.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            {user ? (
              <Link
                to="/requests/new"
                className="btn-primary text-lg px-8 py-4"
              >
                Faire une demande
              </Link>
            ) : (
              <Link
                to="/auth/register"
                className="btn-primary text-lg px-8 py-4"
              >
                Commencer maintenant
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Disponible dans toute la Côte d'Ivoire
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Notre réseau de délégués certifiés couvre les principales villes 
                et nous étendons continuellement notre présence.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {cities.map((city) => (
                  <div key={city} className="flex items-center">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">{city}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-sm mt-6">
                Et bien d'autres villes en cours d'ajout...
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PhoneIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Besoin d'aide ?
                </h3>
                <p className="text-gray-600 mb-6">
                  Notre équipe support est disponible pour vous accompagner
                </p>
                <div className="space-y-2">
                  <p className="text-primary-600 font-semibold">+225 XX XX XX XX</p>
                  <p className="text-primary-600">support@ivoiredocs.ci</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à simplifier vos démarches ?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Rejoignez des milliers d'Ivoiriens qui font confiance à Ivoiredocs.ci
          </p>
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl bg-white text-primary-600 hover:bg-gray-50 transition-colors shadow-lg"
            >
              Accéder à mon compte
            </Link>
          ) : (
            <Link
              to="/auth/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl bg-white text-primary-600 hover:bg-gray-50 transition-colors shadow-lg"
            >
              Créer mon compte gratuitement
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}