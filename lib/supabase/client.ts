import { createBrowserClient } from "@supabase/ssr"

export function getSupabaseBrowserClient() {
  // <CHANGE> Added fallback handling for missing environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables."
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
