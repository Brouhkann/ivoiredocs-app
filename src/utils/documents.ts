import type { DocumentType, ServiceType, DocumentConfig } from '../types';

// Configuration des documents disponibles
export const DOCUMENT_CONFIGS: Record<DocumentType, DocumentConfig> = {
  acte_naissance: {
    type: 'acte_naissance',
    name: 'Extrait d\'acte de naissance',
    service: 'mairie',
    base_price: 2000,
    processing_time: 24, // 24 heures
    required_fields: ['nom', 'prenoms', 'date_naissance', 'lieu_naissance']
  },
  acte_mariage: {
    type: 'acte_mariage',
    name: 'Extrait d\'acte de mariage',
    service: 'mairie',
    base_price: 2500,
    processing_time: 24,
    required_fields: ['nom_epoux', 'prenoms_epoux', 'nom_epouse', 'prenoms_epouse', 'date_mariage']
  },
  casier_judiciaire: {
    type: 'casier_judiciaire',
    name: 'Casier judiciaire',
    service: 'justice',
    base_price: 3000,
    processing_time: 72, // 72 heures
    required_fields: ['nom', 'prenoms', 'date_naissance', 'lieu_naissance', 'profession']
  },
  certificat_nationalite: {
    type: 'certificat_nationalite',
    name: 'Certificat de nationalité',
    service: 'sous_prefecture',
    base_price: 5000,
    processing_time: 48, // 48 heures
    required_fields: ['nom', 'prenoms', 'date_naissance', 'lieu_naissance', 'filiation']
  }
};

// Villes disponibles
export const CITIES = [
  'Abidjan',
  'Bouaké',
  'San-Pédro',
  'Yamoussoukro',
  'Daloa',
  'Korhogo',
  'Man',
  'Divo',
  'Gagnoa',
  'Abengourou'
];

// Services administratifs
export const SERVICES: Record<ServiceType, string> = {
  mairie: 'Mairie',
  sous_prefecture: 'Sous-préfecture',
  justice: 'Tribunal'
};

// Calculer le prix d'une demande
export function calculatePrice(
  documentType: DocumentType,
  city: string,
  copies: number = 1
): number {
  const config = DOCUMENT_CONFIGS[documentType];
  let basePrice = config.base_price;

  // Multiplicateur selon la ville
  const cityMultiplier = getCityMultiplier(city);
  basePrice *= cityMultiplier;

  // Coût par copie
  const totalPrice = basePrice * copies;

  // Frais de livraison
  const shippingCost = getShippingCost(city);

  return Math.round(totalPrice + shippingCost);
}

// Multiplicateur de prix selon la ville
function getCityMultiplier(city: string): number {
  const multipliers: Record<string, number> = {
    'Abidjan': 1.0,
    'Bouaké': 1.1,
    'San-Pédro': 1.2,
    'Yamoussoukro': 1.1,
    'Daloa': 1.3,
    'Korhogo': 1.4,
    'Man': 1.5,
    'Divo': 1.2,
    'Gagnoa': 1.2,
    'Abengourou': 1.3
  };

  return multipliers[city] || 1.2;
}

// Coût de livraison selon la ville
function getShippingCost(city: string): number {
  const shippingCosts: Record<string, number> = {
    'Abidjan': 1000,
    'Bouaké': 1500,
    'San-Pédro': 2000,
    'Yamoussoukro': 1500,
    'Daloa': 2000,
    'Korhogo': 2500,
    'Man': 3000,
    'Divo': 1500,
    'Gagnoa': 1500,
    'Abengourou': 2000
  };

  return shippingCosts[city] || 2000;
}

// Calculer la dotation du délégué
export function calculateDelegateEarnings(totalAmount: number): number {
  // Le délégué reçoit 60% du montant total (hors frais de livraison)
  const commissionRate = 0.6;
  return Math.round(totalAmount * commissionRate);
}

// Estimer le temps de traitement
export function estimateCompletionTime(
  documentType: DocumentType,
  city: string
): Date {
  const config = DOCUMENT_CONFIGS[documentType];
  let processingHours = config.processing_time;

  // Ajuster selon la ville (villes plus éloignées = plus de temps)
  const cityDelayMultiplier = getCityDelayMultiplier(city);
  processingHours *= cityDelayMultiplier;

  const completionDate = new Date();
  completionDate.setHours(completionDate.getHours() + processingHours);

  return completionDate;
}

function getCityDelayMultiplier(city: string): number {
  const delayMultipliers: Record<string, number> = {
    'Abidjan': 1.0,
    'Bouaké': 1.2,
    'San-Pédro': 1.3,
    'Yamoussoukro': 1.1,
    'Daloa': 1.4,
    'Korhogo': 1.5,
    'Man': 1.6,
    'Divo': 1.3,
    'Gagnoa': 1.3,
    'Abengourou': 1.4
  };

  return delayMultipliers[city] || 1.3;
}