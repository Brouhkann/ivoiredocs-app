-- Données de test pour Ivoiredocs.ci

-- Insérer des délégués de test pour les 3 villes principales
INSERT INTO public.delegates (name, city, services, is_active, rating, max_concurrent_requests) VALUES
-- Abidjan
('Kouassi Jean-Baptiste', 'Abidjan', ARRAY['mairie'], true, 4.5, 15),
('N''Dri Marie-Claire', 'Abidjan', ARRAY['sous_prefecture'], true, 4.2, 12),
('Traoré Mamadou', 'Abidjan', ARRAY['justice'], true, 4.8, 10),

-- Bouaké  
('Koné Fatimata', 'Bouaké', ARRAY['mairie', 'sous_prefecture'], true, 4.1, 12),
('Ouattara Ibrahim', 'Bouaké', ARRAY['justice'], true, 4.3, 8),

-- San-Pédro
('Bamba Adjoua', 'San-Pédro', ARRAY['mairie'], true, 4.0, 10),
('Yao Christian', 'San-Pédro', ARRAY['sous_prefecture', 'justice'], true, 4.6, 10);

-- Mettre à jour les statistiques des délégués avec des données réalistes
UPDATE public.delegates SET 
    total_requests = FLOOR(RANDOM() * 100) + 20,
    total_earnings = FLOOR(RANDOM() * 500000) + 100000
WHERE id IS NOT NULL;

-- Fonction pour générer des données de test (utilisateurs et demandes)
-- Cette fonction peut être appelée après l'authentification d'utilisateurs réels

CREATE OR REPLACE FUNCTION generate_sample_requests()
RETURNS VOID AS $$
DECLARE
    sample_user_id UUID;
    delegate_record RECORD;
    document_types TEXT[] := ARRAY['acte_naissance', 'acte_mariage', 'casier_judiciaire', 'certificat_nationalite'];
    cities TEXT[] := ARRAY['Abidjan', 'Bouaké', 'San-Pédro'];
    statuses TEXT[] := ARRAY['completed', 'in_progress', 'assigned'];
    i INTEGER;
BEGIN
    -- Cette fonction est désactivée par défaut pour éviter la pollution des données
    -- Décommentez et exécutez manuellement si nécessaire pour les tests
    
    /*
    -- Créer quelques demandes de test avec des UUIDs factices
    FOR i IN 1..20 LOOP
        sample_user_id := gen_random_uuid();
        
        INSERT INTO public.requests (
            user_id,
            document_type,
            service_type,
            status,
            city,
            copies,
            total_amount,
            delegate_earnings,
            form_data,
            created_at,
            completed_at
        ) VALUES (
            sample_user_id,
            document_types[1 + (i % array_length(document_types, 1))],
            CASE 
                WHEN document_types[1 + (i % array_length(document_types, 1))] IN ('acte_naissance', 'acte_mariage') THEN 'mairie'
                WHEN document_types[1 + (i % array_length(document_types, 1))] = 'certificat_nationalite' THEN 'sous_prefecture'
                ELSE 'justice'
            END,
            statuses[1 + (i % array_length(statuses, 1))],
            cities[1 + (i % array_length(cities, 1))],
            1,
            2000 + (i * 500),
            (2000 + (i * 500)) * 0.6,
            jsonb_build_object(
                'nom', 'Test Nom ' || i,
                'prenoms', 'Test Prénoms ' || i,
                'date_naissance', '1990-01-01',
                'lieu_naissance', cities[1 + (i % array_length(cities, 1))]
            ),
            NOW() - INTERVAL '1 day' * i,
            CASE 
                WHEN statuses[1 + (i % array_length(statuses, 1))] = 'completed' 
                THEN NOW() - INTERVAL '1 day' * (i - 2)
                ELSE NULL
            END
        );
    END LOOP;
    */
    
    RAISE NOTICE 'Fonction generate_sample_requests() disponible mais désactivée. Décommentez le code si nécessaire.';
END;
$$ LANGUAGE plpgsql;

-- Créer des vues utiles pour le développement et les tests
CREATE OR REPLACE VIEW requests_with_delegate_info AS
SELECT 
    r.*,
    d.name as delegate_name,
    d.city as delegate_city,
    d.rating as delegate_rating
FROM public.requests r
LEFT JOIN public.delegates d ON r.delegate_id = d.id;

-- Vue pour les statistiques des documents
CREATE OR REPLACE VIEW document_stats AS
SELECT 
    document_type,
    service_type,
    COUNT(*) as total_requests,
    AVG(total_amount) as avg_amount,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_requests,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as requests_last_30_days
FROM public.requests
GROUP BY document_type, service_type;

-- Vue pour les statistiques par ville
CREATE OR REPLACE VIEW city_stats AS
SELECT 
    city,
    COUNT(*) as total_requests,
    COUNT(DISTINCT delegate_id) as active_delegates,
    AVG(total_amount) as avg_request_amount,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_requests
FROM public.requests
GROUP BY city
ORDER BY total_requests DESC;