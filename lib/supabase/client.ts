'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export const createClient = () => {
  // Avoid recreating the client if it already exists
  if (client) return client

  // Only create client in browser environment
  if (typeof window === 'undefined') {
    return null as any
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn('Supabase URL or anon key not available')
    return null as any
  }

  client = createBrowserClient<Database>(url, key)
  return client
}

/**
 * Same as createClient(), but throws a clear, actionable error instead of
 * returning null. Use this in hooks/mutations that are about to call
 * supabase.auth.* or supabase.from(...) — it turns a confusing
 * "Cannot read properties of null" crash into an explanation of what's
 * actually missing. Always call this fresh at the point of use (inside a
 * hook's queryFn/mutationFn), never cache the result at module scope —
 * doing so would freeze in whatever createClient() returned the first time
 * the module was evaluated (e.g. before env vars were available).
 */
export const getSupabaseClient = () => {
  const supabase = createClient()
  if (!supabase) {
    throw new Error(
      'Supabase client failed to initialize. Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    )
  }
  return supabase
}
