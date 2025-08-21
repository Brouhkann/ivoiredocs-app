-- Schéma initial pour Ivoiredocs.ci

-- Table des utilisateurs (étend auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    phone VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    preferences JSONB DEFAULT '{"notifications": true, "default_city": "", "preferred_shipping": "standard"}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_requests INTEGER DEFAULT 0
);

-- Table des délégués
CREATE TABLE public.delegates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name VARCHAR NOT NULL,
    city VARCHAR NOT NULL,
    services TEXT[] NOT NULL CHECK (array_length(services, 1) > 0),
    specialties TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    max_concurrent_requests INTEGER DEFAULT 10,
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_requests INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des demandes
CREATE TABLE public.requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    delegate_id UUID REFERENCES public.delegates(id) ON DELETE SET NULL,
    document_type VARCHAR NOT NULL CHECK (document_type IN ('acte_naissance', 'acte_mariage', 'casier_judiciaire', 'certificat_nationalite')),
    service_type VARCHAR NOT NULL CHECK (service_type IN ('mairie', 'sous_prefecture', 'justice')),
    status VARCHAR DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'in_progress', 'completed', 'cancelled')),
    city VARCHAR NOT NULL,
    copies INTEGER DEFAULT 1 CHECK (copies > 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount > 0),
    delegate_earnings DECIMAL(10,2) DEFAULT 0,
    form_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estimated_completion TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Table des notations des délégués
CREATE TABLE public.delegate_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
    delegate_id UUID REFERENCES public.delegates(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    speed_rating INTEGER NOT NULL CHECK (speed_rating >= 1 AND speed_rating <= 5),
    quality_rating INTEGER NOT NULL CHECK (quality_rating >= 1 AND quality_rating <= 5),
    communication_rating INTEGER NOT NULL CHECK (communication_rating >= 1 AND communication_rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contrainte : un seul rating par demande
    UNIQUE(request_id)
);

-- Index pour optimiser les performances
CREATE INDEX idx_requests_user_id ON public.requests(user_id);
CREATE INDEX idx_requests_delegate_id ON public.requests(delegate_id);
CREATE INDEX idx_requests_status ON public.requests(status);
CREATE INDEX idx_requests_service_type ON public.requests(service_type);
CREATE INDEX idx_requests_city ON public.requests(city);
CREATE INDEX idx_requests_created_at ON public.requests(created_at);
CREATE INDEX idx_delegates_city_services ON public.delegates(city, services);
CREATE INDEX idx_delegates_active ON public.delegates(is_active) WHERE is_active = true;

-- Fonctions de mise à jour automatique des timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delegates_updated_at BEFORE UPDATE ON public.delegates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON public.requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour calculer le rating moyen d'un délégué
CREATE OR REPLACE FUNCTION calculate_delegate_rating(delegate_uuid UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
    avg_rating DECIMAL(3,2);
BEGIN
    SELECT COALESCE(AVG(overall_rating), 0)::DECIMAL(3,2)
    INTO avg_rating
    FROM public.delegate_ratings
    WHERE delegate_id = delegate_uuid;
    
    RETURN avg_rating;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour le rating du délégué après une nouvelle notation
CREATE OR REPLACE FUNCTION update_delegate_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.delegates
    SET rating = calculate_delegate_rating(NEW.delegate_id)
    WHERE id = NEW.delegate_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_delegate_rating_trigger
    AFTER INSERT ON public.delegate_ratings
    FOR EACH ROW EXECUTE FUNCTION update_delegate_rating();

-- Vue pour les statistiques temps réel des délégués
CREATE VIEW delegate_stats AS
SELECT 
    d.id,
    d.name,
    d.city,
    d.services,
    d.rating,
    d.total_requests,
    d.total_earnings,
    COUNT(r.id) FILTER (WHERE r.status IN ('assigned', 'in_progress')) as active_requests,
    COUNT(r.id) FILTER (WHERE r.created_at >= CURRENT_DATE) as requests_today,
    SUM(r.delegate_earnings) FILTER (WHERE r.status = 'completed' AND r.created_at >= CURRENT_DATE) as earnings_today
FROM public.delegates d
LEFT JOIN public.requests r ON d.id = r.delegate_id
WHERE d.is_active = true
GROUP BY d.id, d.name, d.city, d.services, d.rating, d.total_requests, d.total_earnings;