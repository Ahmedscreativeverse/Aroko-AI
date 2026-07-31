import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

/**
 * Service-role Supabase client for use in server-side API routes only.
 * This bypasses RLS, so callers are responsible for verifying the
 * requesting user (e.g. via supabase.auth.getUser(accessToken)) before
 * trusting any user-scoped data passed in.
 */
export function getServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Missing Supabase credentials. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    )
  }

  return createClient<Database>(url, key)
}
