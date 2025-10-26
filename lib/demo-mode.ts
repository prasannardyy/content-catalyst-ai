// Demo mode utilities for frontend
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export const demoUser = {
  id: 'demo_user_123',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'demo@contentcatalyst.ai',
  email_confirmed_at: '2024-01-01T00:00:00.000Z',
  phone: '',
  confirmed_at: '2024-01-01T00:00:00.000Z',
  last_sign_in_at: '2024-01-01T00:00:00.000Z',
  app_metadata: {
    provider: 'email',
    providers: ['email']
  },
  user_metadata: {
    full_name: 'Demo User'
  },
  identities: [],
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z'
}

export const demoSession = {
  access_token: 'demo_token_123',
  refresh_token: 'demo_refresh_123',
  expires_in: 3600,
  token_type: 'bearer',
  user: demoUser
}

// Check if we're in demo mode by checking API health
export async function checkDemoMode(): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
    const data = await response.json()
    return data.demo_mode === true
  } catch (error) {
    return false
  }
}