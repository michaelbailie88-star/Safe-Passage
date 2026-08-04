import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Uses the service_role key, which bypasses Row Level Security entirely.
 * Only ever import this in server-only code that never runs in the
 * browser (e.g. the Stripe webhook handler) — never in a Client Component
 * or anything that ships to the client bundle.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
