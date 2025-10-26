import axios from 'axios'
// Removed Supabase import - using demo mode only

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth interceptor (demo mode only)
api.interceptors.request.use(async (config) => {
  // Always use demo token since we removed Supabase
  config.headers.Authorization = `Bearer demo_token_123`
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // In demo mode, just log errors
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export interface Project {
  id: string
  user_id: string
  original_video_url: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  title?: string
  description?: string
  duration?: number
  thumbnail_url?: string
  assets?: Asset[]
  created_at: string
  updated_at: string
}

export interface Asset {
  id: string
  project_id: string
  asset_type: 'blog' | 'linkedin_post' | 'tweet' | 'video_clip' | 'image'
  content?: string
  file_url?: string
  metadata?: any
  created_at: string
}

export const projectsApi = {
  // Get all projects for the current user
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects')
    return response.data
  },

  // Get a specific project with assets
  getProject: async (projectId: string): Promise<Project> => {
    const response = await api.get(`/projects/${projectId}`)
    return response.data
  },

  // Create a new project
  createProject: async (youtubeUrl: string): Promise<Project> => {
    const response = await api.post('/projects', {
      youtube_url: youtubeUrl
    })
    return response.data
  },
}

export default api