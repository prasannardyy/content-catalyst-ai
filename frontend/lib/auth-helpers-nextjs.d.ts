// Type definitions for Supabase Auth Helpers
declare module '@supabase/auth-helpers-nextjs' {
  export function createServerComponentClient(options: { cookies: any }): any
  export function createClientComponentClient(): any
}