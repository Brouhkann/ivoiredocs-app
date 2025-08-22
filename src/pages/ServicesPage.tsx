import { Link } from 'react-router-dom';
import { DOCUMENT_CONFIGS, CITIES } from '../utils/documents';
import {
  DocumentTextIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  CheckCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function ServicesPage() {
  const serviceTypes = {
    mairie: {
      name: 'Services de Mairie',
      description: 'Documents d\'état civil et certificats municipaux',
      icon: '🏛️',
      documents: Object.values(DOCUMENT_CONFIGS).filter(doc => doc.service === 'mairie')
    },
    sous_prefecture: {
      name: 'Services de Sous-préfecture',
      description: 'Documents administratifs et certificats officiels',
      icon: '🏢',
      documents: Object.values(DOCUMENT_CONFIGS).filter(doc => doc.service === 'sous_prefecture')
    },
    justice: {
      name: 'Services Judiciaires',
      description: 'Casiers judiciaires et documents légaux',
      icon: '⚖️',
      documents: Object.values(DOCUMENT_CONFIGS).filter(doc => doc.service === 'justice')
    }
  };

  const features = [
    {
      icon: ClockIcon,
      title: 'Traitement rapide',
      description: 'Délais de traitement optimisés selon le type de document'
    },
    {
      icon: UserGroupIcon,
      title: 'Délégués certifiés',
      description: 'Réseau de professionnels vérifiés dans chaque ville'
    },
    {
      icon: CheckCircleIcon,
      title: 'Suivi temps réel',
      description: 'Notifications à chaque étape de votre demande'
    },
    {
      icon: MapPinIcon,
      title: 'Livraison à domicile',
      description: 'Réception de vos documents directement chez vous'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nos Services
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto mb-8">
              Tous vos documents administratifs ivoiriens, disponibles en ligne 
              avec livraison à domicile dans toute la Côte d'Ivoire.
            </p>
            <Link
              to="/auth/register"
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl bg-white text-primary-600 hover:bg-gray-50 transition-colors shadow-lg"
            >
              Commencer maintenant
            </Link>
          </div>
        </div>
      </section>

      {/* Services par type */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Documents par service administratif
            </h2>
            <p className="text-xl text-gray-600">
              Organisés selon les services officiels de la République de Côte d'Ivoire
            </p>
          </div>

          <div className="space-y-12">
            {Object.entries(serviceTypes).map(([key, service]) => (
              <div key={key} className="bg-gray-50 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {service.documents.map((doc) => (
                    <div key={doc.type} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="flex items-start space-x-4">
                        <DocumentTextIcon className="w-8 h-8 text-primary-600 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {doc.name}
                          </h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                              À partir de {doc.base_price.toLocaleString()} FCFA
                            </div>
                            <div className="flex items-center">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              Délai : {doc.processing_time}h
                            </div>
                          </div>
                          <div className="mt-4">
                            <Link
                              to="/requests/new"
                              className="text-sm font-medium text-primary-600 hover:text-primary-700"
                            >
                              Demander ce document →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Ivoiredocs.ci ?
            </h2>
            <p className="text-xl text-gray-600">
              Un service moderne et fiable pour tous vos besoins administratifs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Couverture géographique */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Couverture nationale
            </h2>
            <p className="text-xl text-gray-600">
              Nos services sont disponibles dans les principales villes de Côte d'Ivoire
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CITIES.map((city) => (
              <div key={city} className="bg-gray-50 rounded-lg p-4 text-center">
                <MapPinIcon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <div className="font-medium text-gray-900">{city}</div>
                <div className="text-sm text-gray-500">Disponible</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Votre ville n'est pas listée ? Contactez-nous !
            </p>
            <a
              href="mailto:expansion@ivoiredocs.ci"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              expansion@ivoiredocs.ci
            </a>
          </div>
        </div>
      </section>

      {/* Processus */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Comment obtenir vos documents ?
            </h2>
            <p className="text-xl text-primary-100">
              Un processus simple et transparent en 5 étapes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { step: '1', title: 'Inscription', desc: 'Créez votre compte gratuitement' },
              { step: '2', title: 'Sélection', desc: 'Choisissez votre document' },
              { step: '3', title: 'Informations', desc: 'Remplissez le formulaire' },
              { step: '4', title: 'Paiement', desc: 'Payez en ligne sécurisé' },
              { step: '5', title: 'Livraison', desc: 'Recevez chez vous' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-primary-100 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/auth/register"
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl bg-white text-primary-600 hover:bg-gray-50 transition-colors shadow-lg"
            >
              Commencer maintenant
            </Link>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Besoin d'aide ou d'informations ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Notre équipe support est disponible pour répondre à toutes vos questions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="text-2xl mb-2">📞</div>
              <div className="font-semibold text-gray-900">Téléphone</div>
              <div className="text-gray-600">+225 XX XX XX XX</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="text-2xl mb-2">📧</div>
              <div className="font-semibold text-gray-900">Email</div>
              <div className="text-gray-600">support@ivoiredocs.ci</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="text-2xl mb-2">💬</div>
              <div className="font-semibold text-gray-900">WhatsApp</div>
              <div className="text-gray-600">+225 XX XX XX XX</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}