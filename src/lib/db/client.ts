/**
 * Supabase = DATABASE ONLY (no Supabase Auth). All access is server-side with the service key.
 * RLS is enabled with no policies, so the browser can never read data directly.
 * Owner: Robiu (database layer). Query helpers go in ./queries/*.ts
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getServerConfig } from '@/lib/config';

let client: SupabaseClient | null = null;

export function db(): SupabaseClient {
  if (!client) {
    const c = getServerConfig();
    client = createClient(c.supabaseUrl, c.supabaseServiceKey, { auth: { persistSession: false } });
  }
  return client;
}
