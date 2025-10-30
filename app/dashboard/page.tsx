'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Video, Clock, CheckCircle, XCircle, ExternalLink, Zap, LogOut, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { projectsApi } from '@/lib/api'
import { auth } from '@/lib/firebase'

interface Project {
  id: string
  original_video_url: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  title?: string
  description?: string
  duration?: number
  thumbnail_url?: string
  created_at: string
  updated_at: string
}

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [creating, setCreating] = useState(false)
  const [deletingProject, setDeletingProject] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      fetchProjects()
    }

    // Listen for project completion events
    const handleProjectCompleted = (event: CustomEvent) => {
      toast.success('Project processing completed! Click "View Results" to see your generated content.')
      fetchProjects() // Refresh the projects list
    }

    window.addEventListener('projectCompleted', handleProjectCompleted as EventListener)

    return () => {
      window.removeEventListener('projectCompleted', handleProjectCompleted as EventListener)
    }
  }, [user, authLoading, router])

  const fetchProjects = async () => {
    try {
      const projectsData = await projectsApi.getProjects()
      setProjects(projectsData)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const newProject = await projectsApi.createProject(newVideoUrl)

      toast.success('Project created! AI processing has started.')
      setShowNewProjectModal(false)
      setNewVideoUrl('')

      // Add new project to the list
      setProjects([newProject, ...projects])

      // The project completion is now handled by the API client
      // It will automatically notify when processing is complete
    } catch (error: any) {
      console.error('Failed to create project:', error)

      let errorMessage = 'Failed to create project'

      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map((err: any) => err.msg).join(', ')
        } else if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
    } finally {
      setCreating(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    setDeletingProject(projectId)
    
    try {
      // For demo/local mode, delete from localStorage
      if (typeof window !== 'undefined') {
        const storedProjects = JSON.parse(localStorage.getItem('user_projects') || '[]')
        const updatedProjects = storedProjects.filter((p: Project) => p.id !== projectId)
        localStorage.setItem('user_projects', JSON.stringify(updatedProjects))
      }
      
      // Update local state
      setProjects(projects.filter(p => p.id !== projectId))
      
      toast.success('Project deleted successfully')
      setShowDeleteConfirm(null)
      
      // TODO: When backend is ready, call API to delete from database
      // await projectsApi.deleteProject(projectId)
    } catch (error) {
      console.error('Failed to delete project:', error)
      toast.error('Failed to delete project')
    } finally {
      setDeletingProject(null)
    }
  }

  const confirmDelete = (projectId: string) => {
    setShowDeleteConfirm(projectId)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'processing':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'processing':
        return 'Processing'
      case 'completed':
        return 'Completed'
      case 'failed':
        return 'Failed'
      default:
        return 'Unknown'
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">Content Catalyst AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.user_metadata?.full_name || user?.email}</span>
              <button
                onClick={handleSignOut}
                className="btn-secondary flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Projects</h1>
            <p className="text-gray-600 mt-1">Transform your videos into complete content campaigns</p>
          </div>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Project</span>
          </button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">Create your first project to get started with AI-powered content repurposing</p>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="btn-primary"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="card hover:shadow-md transition-shadow">
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title || 'Video thumbnail'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {project.title || 'Processing...'}
                    </h3>
                    {project.duration && (
                      <p className="text-sm text-gray-500">Duration: {formatDuration(project.duration)}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(project.status)}
                    <span className={`text-sm font-medium ${project.status === 'completed' ? 'text-green-600' :
                      project.status === 'processing' ? 'text-blue-600' :
                        project.status === 'failed' ? 'text-red-600' :
                          'text-yellow-600'
                      }`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    {project.status === 'completed' ? (
                      <Link
                        href={`/project/${project.id}`}
                        className="btn-primary flex-1 text-center"
                      >
                        View Results
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="btn-primary flex-1 opacity-50 cursor-not-allowed"
                      >
                        {project.status === 'processing' ? 'Processing...' : 'Pending'}
                      </button>
                    )}
                    <a
                      href={project.original_video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary p-2"
                      title="View original video"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => confirmDelete(project.id)}
                      className="btn-secondary p-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      title="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Created Date */}
                  <p className="text-xs text-gray-500">
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Project</h2>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube Video URL
                </label>
                <input
                  id="videoUrl"
                  type="url"
                  required
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste the URL of the YouTube video you want to repurpose
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewProjectModal(false)
                    setNewVideoUrl('')
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-primary flex-1 flex items-center justify-center"
                >
                  {creating ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Create Project'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Delete Project</h2>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to delete this project? This action cannot be undone and all generated content will be permanently removed.
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={cancelDelete}
                disabled={deletingProject === showDeleteConfirm}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(showDeleteConfirm)}
                disabled={deletingProject === showDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex-1 flex items-center justify-center"
              >
                {deletingProject === showDeleteConfirm ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Delete Project'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}