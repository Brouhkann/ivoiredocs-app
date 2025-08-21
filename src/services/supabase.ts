import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types Supabase générés automatiquement
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone: string;
          name: string;
          preferences: any;
          created_at: string;
          total_requests: number;
        };
        Insert: {
          id?: string;
          email: string;
          phone: string;
          name: string;
          preferences?: any;
          created_at?: string;
          total_requests?: number;
        };
        Update: {
          id?: string;
          email?: string;
          phone?: string;
          name?: string;
          preferences?: any;
          created_at?: string;
          total_requests?: number;
        };
      };
      delegates: {
        Row: {
          id: string;
          name: string;
          city: string;
          services: string[];
          is_active: boolean;
          rating: number;
          total_requests: number;
          total_earnings: number;
        };
        Insert: {
          id?: string;
          name: string;
          city: string;
          services: string[];
          is_active?: boolean;
          rating?: number;
          total_requests?: number;
          total_earnings?: number;
        };
        Update: {
          id?: string;
          name?: string;
          city?: string;
          services?: string[];
          is_active?: boolean;
          rating?: number;
          total_requests?: number;
          total_earnings?: number;
        };
      };
      requests: {
        Row: {
          id: string;
          user_id: string;
          delegate_id: string | null;
          document_type: string;
          service_type: string;
          status: string;
          city: string;
          copies: number;
          total_amount: number;
          delegate_earnings: number;
          created_at: string;
          estimated_completion: string | null;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          delegate_id?: string | null;
          document_type: string;
          service_type: string;
          status?: string;
          city: string;
          copies?: number;
          total_amount: number;
          delegate_earnings?: number;
          created_at?: string;
          estimated_completion?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          delegate_id?: string | null;
          document_type?: string;
          service_type?: string;
          status?: string;
          city?: string;
          copies?: number;
          total_amount?: number;
          delegate_earnings?: number;
          created_at?: string;
          estimated_completion?: string | null;
          completed_at?: string | null;
        };
      };
    };
  };
};