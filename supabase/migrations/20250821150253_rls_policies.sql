-- Politiques RLS (Row Level Security) pour Ivoiredocs.ci

-- Activer RLS sur toutes les tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delegates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delegate_ratings ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table users
CREATE POLICY "Utilisateurs peuvent voir leur propre profil"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Utilisateurs peuvent mettre � jour leur propre profil"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Permettre insertion lors de l'inscription"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Politiques pour la table delegates
CREATE POLICY "D�l�gu�s actifs visibles par tous les utilisateurs authentifi�s"
    ON public.delegates FOR SELECT
    TO authenticated
    USING (is_active = true);

CREATE POLICY "D�l�gu�s peuvent voir leur propre profil complet"
    ON public.delegates FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "D�l�gu�s peuvent mettre � jour leur propre profil"
    ON public.delegates FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Politiques pour la table requests
CREATE POLICY "Utilisateurs peuvent voir leurs propres demandes"
    ON public.requests FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "D�l�gu�s peuvent voir leurs demandes assign�es"
    ON public.requests FOR SELECT
    USING (
        delegate_id IN (
            SELECT id FROM public.delegates WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Utilisateurs peuvent cr�er leurs propres demandes"
    ON public.requests FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "D�l�gu�s peuvent mettre � jour leurs demandes assign�es"
    ON public.requests FOR UPDATE
    USING (
        delegate_id IN (
            SELECT id FROM public.delegates WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        delegate_id IN (
            SELECT id FROM public.delegates WHERE user_id = auth.uid()
        )
    );

-- Politiques pour la table delegate_ratings
CREATE POLICY "Utilisateurs peuvent voir leurs propres notations"
    ON public.delegate_ratings FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "D�l�gu�s peuvent voir leurs notations"
    ON public.delegate_ratings FOR SELECT
    USING (
        delegate_id IN (
            SELECT id FROM public.delegates WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Utilisateurs peuvent noter apr�s livraison"
    ON public.delegate_ratings FOR INSERT
    WITH CHECK (
        user_id = auth.uid() 
        AND EXISTS (
            SELECT 1 FROM public.requests 
            WHERE id = request_id 
            AND user_id = auth.uid() 
            AND status = 'completed'
        )
    );

-- Fonctions de s�curit� pour l'attribution automatique des d�l�gu�s
CREATE OR REPLACE FUNCTION public.assign_delegate_to_request(request_id UUID)
RETURNS UUID AS $$
DECLARE
    selected_delegate_id UUID;
    request_service_type VARCHAR;
    request_city VARCHAR;
BEGIN
    -- R�cup�rer les informations de la demande
    SELECT service_type, city INTO request_service_type, request_city
    FROM public.requests WHERE id = request_id;
    
    -- S�lectionner un d�l�gu� disponible avec l'algorithme de distribution
    SELECT d.id INTO selected_delegate_id
    FROM public.delegates d
    WHERE d.is_active = true
        AND request_service_type = ANY(d.services)
        AND d.city = request_city
        AND (
            SELECT COUNT(*) 
            FROM public.requests r 
            WHERE r.delegate_id = d.id 
                AND r.status IN ('assigned', 'in_progress')
        ) < d.max_concurrent_requests
    ORDER BY 
        d.rating DESC,  -- Prioriser les mieux not�s
        d.total_requests ASC,  -- �quilibrer la charge
        RANDOM()  -- �l�ment al�atoire pour fairness
    LIMIT 1;
    
    -- Assigner le d�l�gu� � la demande
    IF selected_delegate_id IS NOT NULL THEN
        UPDATE public.requests 
        SET delegate_id = selected_delegate_id,
            status = 'assigned',
            estimated_completion = NOW() + INTERVAL '48 hours'  -- Estimation par d�faut
        WHERE id = request_id;
    END IF;
    
    RETURN selected_delegate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour attribution automatique des d�l�gu�s
CREATE OR REPLACE FUNCTION auto_assign_delegate()
RETURNS TRIGGER AS $$
BEGIN
    -- Assigner automatiquement un d�l�gu� lors de la cr�ation d'une demande
    PERFORM public.assign_delegate_to_request(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_assign_delegate_trigger
    AFTER INSERT ON public.requests
    FOR EACH ROW EXECUTE FUNCTION auto_assign_delegate();

-- Fonction pour compter les demandes actives d'un utilisateur
CREATE OR REPLACE FUNCTION public.count_user_active_requests(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM public.requests
        WHERE user_id = user_uuid 
        AND status IN ('new', 'assigned', 'in_progress')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Politique pour limiter les demandes simultan�es par utilisateur (optionnel)
-- CREATE POLICY "Limite demandes simultan�es"
--     ON public.requests FOR INSERT
--     WITH CHECK (
--         public.count_user_active_requests(auth.uid()) < 5  -- Max 5 demandes simultan�es
--     );