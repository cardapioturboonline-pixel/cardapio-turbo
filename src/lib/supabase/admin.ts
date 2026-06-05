import { createClient } from '@supabase/supabase-js'

// Service-role client — bypasses RLS. Use ONLY in server-side admin routes
// after verifying the caller is an authorized admin.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase admin env vars missing')
  return createClient(url, key, { auth: { persistSession: false } })
}
