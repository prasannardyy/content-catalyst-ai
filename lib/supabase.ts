import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Create a mock supabase client for demo mode
const createMockSupabaseClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
    signUp: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null })
  }
})

// Use demo mode if Supabase URL is not properly configured
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || 
                   !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url'

export const supabase = isDemoMode ? createMockSupabaseClient() : createClientComponentClient()

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          user_id: string
          original_video_url: string
          status: 'pending' | 'processing' | 'completed' | 'failed'
          title: string | null
          description: string | null
          duration: number | null
          thumbnail_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_video_url: string
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          title?: string | null
          description?: string | null
          duration?: number | null
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          original_video_url?: string
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          title?: string | null
          description?: string | null
          duration?: number | null
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      assets: {
        Row: {
          id: string
          project_id: string
          asset_type: 'blog' | 'linkedin_post' | 'tweet' | 'video_clip' | 'image'
          content: string | null
          file_url: string | null
          metadata: any | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          asset_type: 'blog' | 'linkedin_post' | 'tweet' | 'video_clip' | 'image'
          content?: string | null
          file_url?: string | null
          metadata?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          asset_type?: 'blog' | 'linkedin_post' | 'tweet' | 'video_clip' | 'image'
          content?: string | null
          file_url?: string | null
          metadata?: any | null
          created_at?: string
        }
      }
    }
  }
}