export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          city: string | null
          bio: string | null
          avatar_url: string | null
          member_number: number | null
          status: 'early_member' | 'member' | 'pro' | 'certified'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          city?: string | null
          bio?: string | null
          avatar_url?: string | null
          member_number?: number | null
          status?: 'early_member' | 'member' | 'pro' | 'certified'
          created_at?: string
        }
        Update: {
          first_name?: string
          last_name?: string
          city?: string | null
          bio?: string | null
          avatar_url?: string | null
          status?: 'early_member' | 'member' | 'pro' | 'certified'
        }
      }
      profile_types: {
        Row: {
          id: string
          user_id: string
          type: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
        }
        Update: {
          type?: string
        }
      }
      seeking: {
        Row: {
          id: string
          user_id: string
          seeking_type: string
        }
        Insert: {
          id?: string
          user_id: string
          seeking_type: string
        }
        Update: {
          seeking_type?: string
        }
      }
      first_posts: {
        Row: {
          id: string
          user_id: string
          content: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content?: string | null
          created_at?: string
        }
        Update: {
          content?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
