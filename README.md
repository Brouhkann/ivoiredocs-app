# 🇨🇮 Ivoiredocs.ci

Plateforme SaaS pour les demandes de documents administratifs en Côte d'Ivoire.

## ✨ Fonctionnalités

- 🔐 **Authentification sécurisée** avec Supabase Auth
- 📋 **Demandes de documents** (acte de naissance, mariage, casier judiciaire, certificat de nationalité)
- 👥 **Système de délégués** par ville et service administratif
- ⭐ **Notation des délégués** avec feedback utilisateurs
- 💰 **Paiement Mobile Money** via CinetPay
- 📱 **Notifications** SMS et WhatsApp
- 📊 **Tableau de bord** temps réel pour utilisateurs et délégués

## 🛠️ Stack Technique

- **Frontend**: Vite + React 18 + TypeScript + TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **État**: Zustand + SWR
- **Déploiement**: Netlify
- **Paiement**: CinetPay API
- **Notifications**: Orange SMS API + WhatsApp Business

## 🚀 Installation

### Prérequis

- Node.js 18+
- NPM ou Yarn
- Supabase CLI
- Git

### Setup local

1. **Cloner le repository**
   ```bash
   git clone https://github.com/Brouhkann/ivoiredocs-app.git
   cd ivoiredocs-app
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env avec vos valeurs Supabase
   ```

4. **Démarrer Supabase localement**
   ```bash
   supabase start
   ```

5. **Appliquer les migrations**
   ```bash
   supabase db push
   ```

6. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

## 📊 Base de données

### Schema principal

- **users**: Profils utilisateurs étendant auth.users
- **delegates**: Délégués par ville et service
- **requests**: Demandes de documents avec routing
- **delegate_ratings**: Système de notation

### Migrations

Les migrations Supabase sont dans `supabase/migrations/`:
- `initial_schema.sql`: Tables principales
- `rls_policies.sql`: Politiques de sécurité
- `seed_data.sql`: Données de test

## 🔧 Configuration

### Variables d'environnement

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CINETPAY_API_KEY=your_cinetpay_api_key
VITE_ORANGE_SMS_API_KEY=your_orange_sms_api_key
```

### Services externes

1. **Supabase**: Base de données et authentification
2. **CinetPay**: Paiements Mobile Money
3. **Orange API**: Notifications SMS
4. **WhatsApp Business**: Messages WhatsApp

## 🏗️ Architecture

```
src/
├── components/          # Composants React
│   ├── ui/             # Composants UI réutilisables
│   ├── forms/          # Formulaires
│   └── layout/         # Layout et navigation
├── pages/              # Pages de l'application
├── services/           # Services et APIs
├── stores/             # État global (Zustand)
├── types/              # Types TypeScript
└── utils/              # Utilitaires
```

## 📱 Fonctionnement

### Pour les utilisateurs

1. **Inscription/Connexion** obligatoire
2. **Sélection du document** souhaité
3. **Saisie des informations** requises
4. **Paiement** via Mobile Money
5. **Attribution automatique** d'un délégué
6. **Suivi temps réel** de la demande
7. **Réception** du document
8. **Notation** du délégué

### Pour les délégués

1. **Dashboard Kanban** des demandes
2. **Traitement** par service (mairie/sous-préfecture/justice)
3. **Mise à jour** des statuts
4. **Calcul automatique** des dotations
5. **Statistiques** de performance

## 🚀 Déploiement

### Netlify

Le déploiement se fait automatiquement via GitHub:
1. Connecter le repo à Netlify
2. Configurer les variables d'environnement
3. Le site se déploie à chaque push

### Supabase

1. Créer un projet sur supabase.com
2. Configurer les variables d'environnement
3. Appliquer les migrations

## 📈 Roadmap

### Phase 1 (Actuel)
- ✅ MVP avec 4 documents
- ✅ 7 délégués dans 3 villes
- ✅ Système de notation
- ✅ Paiement CinetPay

### Phase 2 (Mois 3-6)
- [ ] 7 types de documents
- [ ] 30 délégués dans 10 villes
- [ ] Chat délégué-utilisateur
- [ ] Application mobile (PWA)

### Phase 3 (Mois 6-12)
- [ ] IA pour routing automatique
- [ ] Analytics avancées
- [ ] API publique
- [ ] Multi-pays (Bénin, Togo)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- 📧 Email: support@ivoiredocs.ci
- 🌐 Site web: https://ivoiredocs.ci
- 📱 WhatsApp: +225 XX XX XX XX

---

Fait avec ❤️ pour simplifier l'administration en Côte d'Ivoire
