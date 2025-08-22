import {
  UserGroupIcon,
  ShieldCheckIcon,
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  const stats = [
    { name: 'Documents traités', value: '2,500+' },
    { name: 'Utilisateurs satisfaits', value: '1,200+' },
    { name: 'Villes couvertes', value: '15+' },
    { name: 'Délégués certifiés', value: '50+' }
  ];

  const values = [
    {
      icon: ClockIcon,
      title: 'Rapidité',
      description: 'Nous nous engageons à traiter vos demandes dans les délais les plus courts possibles.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Sécurité',
      description: 'Vos données personnelles sont protégées et traitées avec la plus grande confidentialité.'
    },
    {
      icon: UserGroupIcon,
      title: 'Proximité',
      description: 'Notre réseau de délégués locaux assure un service de qualité dans toute la Côte d\'Ivoire.'
    },
    {
      icon: HeartIcon,
      title: 'Engagement',
      description: 'Nous sommes dédiés à simplifier vos démarches administratives au quotidien.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              À propos d'Ivoiredocs.ci
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Notre mission est de moderniser et simplifier l'accès aux documents 
              administratifs pour tous les Ivoiriens.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Notre mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Ivoiredocs.ci est né d'un constat simple : obtenir des documents administratifs 
                en Côte d'Ivoire peut être long, fastidieux et nécessiter de nombreux déplacements.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Nous avons créé une plateforme digitale qui connecte les citoyens ivoiriens 
                à un réseau de délégués certifiés, permettant d'obtenir ses documents officiels 
                sans se déplacer.
              </p>
              <p className="text-lg text-gray-600">
                Notre objectif est de faire gagner du temps à chaque Ivoirien tout en 
                créant des opportunités d'emploi local à travers notre réseau de délégués.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <div key={stat.name} className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos valeurs
            </h2>
            <p className="text-xl text-gray-600">
              Les principes qui guident notre action au quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Un processus simple en quelques étapes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Créez votre compte
              </h3>
              <p className="text-gray-600">
                Inscrivez-vous gratuitement avec votre email et numéro de téléphone
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Faites votre demande
              </h3>
              <p className="text-gray-600">
                Sélectionnez votre document, remplissez les informations et payez en ligne
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Recevez votre document
              </h3>
              <p className="text-gray-600">
                Notre délégué traite votre demande et vous livre le document chez vous
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Notre équipe
            </h2>
            <p className="text-xl text-primary-100">
              Une équipe passionnée au service de la modernisation administrative
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserGroupIcon className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Équipe Tech</h3>
              <p className="text-primary-100">
                Développeurs passionnés par l'innovation digitale en Afrique
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <MapPinIcon className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Réseau Local</h3>
              <p className="text-primary-100">
                Délégués certifiés présents dans toute la Côte d'Ivoire
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ChartBarIcon className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Support Client</h3>
              <p className="text-primary-100">
                Équipe dédiée pour accompagner chaque utilisateur
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Une question ? Contactez-nous !
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Notre équipe est là pour vous accompagner dans vos démarches
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+225XXXXXXXX"
              className="btn-primary"
            >
              📞 +225 XX XX XX XX
            </a>
            <a
              href="mailto:contact@ivoiredocs.ci"
              className="btn-secondary"
            >
              📧 contact@ivoiredocs.ci
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}