import { createClient } from '@supabase/supabase-js'

// Separate client instance (own storage key) so the admin's login session
// never gets picked up by the public site's Supabase client, and vice versa.
export const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { storageKey: 'sb-admin-auth-token' } }
)
