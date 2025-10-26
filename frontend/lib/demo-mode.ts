// Demo mode utilities for frontend
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export const demoUser = {
  id: 'demo_user_123',
  email: 'demo@contentcatalyst.ai',
  user_metadata: {
    full_name: 'Demo User'
  }
}

export const demoSession = {
  access_token: 'demo_token_123',
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