// src/lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

// Server-only Supabase client using the Service Role Key
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key';

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('[SupabaseAdmin] SUPABASE_SERVICE_ROLE_KEY is not set in environment.');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
