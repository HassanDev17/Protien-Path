import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key in environment variables');
}

// Singleton pattern to prevent multiple client instances
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
    if (!supabaseInstance) {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: true, // Store session in localStorage (default: true)
                autoRefreshToken: true, // Automatically refresh expired tokens (default: true)
                detectSessionInUrl: true, // Detect session from URL fragments (default: true)
                storage: typeof window !== 'undefined' ? window.localStorage : undefined, // Use localStorage for session storage
                storageKey: 'sb-auth-token', // Explicit storage key to prevent conflicts
            },
        });
    }
    return supabaseInstance;
}

export const supabase = getSupabaseClient();
