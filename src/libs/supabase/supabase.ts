import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

// TODO: Update supabase database ts structure:
// https://supabase.com/docs/reference/javascript/initializing#generating-types
export const supabase = createClient<Record<string, unknown>>(supabaseUrl, supabaseAnonKey)
