import { createClient } from '@supabase/supabase-js'

// Used by the public site (contact form). Never persists or reads an auth
// session, so it always talks to Supabase as the anonymous role — even in
// a browser where the admin dashboard is also logged in on the same origin.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
)
