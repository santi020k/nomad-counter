import { createClient } from '@supabase/supabase-js'

import { type Database } from './database.types'

const supabaseUrl: string = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey: string = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

// TODO: Update supabase database ts structure:
// https://supabase.com/docs/reference/javascript/initializing#generating-types
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)
