// Types principaux pour Ivoiredocs.ci
export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  preferences?: UserPreferences;
  created_at: string;
  total_requests: number;
}

export interface UserPreferences {
  notifications: boolean;
  default_city: string;
  preferred_shipping: string;
}

export interface Delegate {
  id: string;
  name: string;
  city: string;
  services: ServiceType[];
  is_active: boolean;
  rating: number;
  total_requests: number;
  total_earnings: number;
}

export interface Request {
  id: string;
  user_id: string;
  delegate_id?: string;
  document_type: DocumentType;
  service_type: ServiceType;
  status: RequestStatus;
  city: string;
  copies: number;
  total_amount: number;
  delegate_earnings: number;
  created_at: string;
  estimated_completion?: string;
  completed_at?: string;
}

export interface DelegateRating {
  id: string;
  request_id: string;
  delegate_id: string;
  user_id: string;
  overall_rating: number;
  speed_rating: number;
  quality_rating: number;
  communication_rating: number;
  comment?: string;
  created_at: string;
}

// Énumérations
export type DocumentType = 
  | 'acte_naissance'
  | 'acte_mariage'
  | 'casier_judiciaire'
  | 'certificat_nationalite';

export type ServiceType = 
  | 'mairie'
  | 'sous_prefecture'
  | 'justice';

export type RequestStatus = 
  | 'new'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

// Configuration des documents
export interface DocumentConfig {
  type: DocumentType;
  name: string;
  service: ServiceType;
  base_price: number;
  processing_time: number; // en heures
  required_fields: string[];
}

// Configuration de prix
export interface PricingConfig {
  base_price: number;
  city_multiplier: number;
  delegate_bonus: number;
  shipping_cost: number;
}