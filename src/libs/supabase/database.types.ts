export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface ListCalculations {
  arrival: string | null
  country: string | null
  created_at: string
  departure: string | null
  id: string
  updated_at: string | null
}

export interface Database {
  public: {
    Tables: {
      'list-calculations': {
        Row: ListCalculations
        Insert: Partial<ListCalculations>
        Update: Partial<ListCalculations>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
