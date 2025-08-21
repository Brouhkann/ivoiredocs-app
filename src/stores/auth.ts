import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import type { User as AppUser } from '../types';

interface AuthState {
  user: User | null;
  profile: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  updateProfile: (profile: Partial<AppUser>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Récupérer le profil utilisateur
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        set({ user: data.user, profile, loading: false });
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },

  signUp: async (email: string, password: string, name: string, phone: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Créer le profil utilisateur
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            name,
            phone,
            preferences: {
              notifications: true,
              default_city: '',
              preferred_shipping: 'standard'
            }
          })
          .select()
          .single();

        if (profileError) throw profileError;

        set({ user: data.user, profile, loading: false });
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ user: null, profile: null, loading: false });
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw error;
    }
  },

  initializeAuth: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Récupérer le profil utilisateur
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Erreur lors de la récupération du profil:', profileError);
        }

        set({ user, profile, loading: false });
      } else {
        set({ user: null, profile: null, loading: false });
      }
    } catch (error) {
      console.error('Erreur d\'initialisation auth:', error);
      set({ loading: false });
    }
  },

  updateProfile: async (updatedProfile: Partial<AppUser>) => {
    try {
      const { profile } = get();
      if (!profile) throw new Error('Aucun profil utilisateur');

      const { data, error } = await supabase
        .from('users')
        .update(updatedProfile)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;

      set({ profile: data });
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error);
      throw error;
    }
  },
}));

// Écouter les changements d'authentification
supabase.auth.onAuthStateChange((event, session) => {
  const { initializeAuth } = useAuthStore.getState();
  
  if (event === 'SIGNED_OUT' || !session) {
    useAuthStore.setState({ user: null, profile: null, loading: false });
  } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    initializeAuth();
  }
});