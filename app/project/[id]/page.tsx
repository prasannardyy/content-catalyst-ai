'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Copy, 
  Download, 
  FileText, 
  Share2, 
  Video, 
  Image as ImageIcon,
  ExternalLink,
  Edit3,
  Check
} from 'lucide-react'
import toast from 'react-hot-toast'
import { projectsApi, Project, Asset } from '@/lib/api'
import ReactMarkdown from 'react-markdown'

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { user, loading: authLoading } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('blog')
  const [editingAsset, setEditingAsset] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      fetchProject()
    }
  }, [user, authLoading, params.id, router])

  const fetchProject = async () => {
    try {
      const projectData = await projectsApi.getProject(params.id)
      setProject(projectData)
    } catch (error) {
      console.error('Failed to fetch project:', error)
      toast.error('Failed to load project')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const downloadAsText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const startEditing = (asset: Asset) => {
    setEditingAsset(asset.id)
    setEditContent(asset.content || '')
  }

  const saveEdit = async () => {
    // In a real implementation, you'd call an API to update the asset
    toast.success('Changes saved!')
    setEditingAsset(null)
    
    // Update local state
    if (project) {
      const updatedAssets = project.assets?.map(asset => 
        asset.id === editingAsset 
          ? { ...asset, content: editContent }
          : asset
      )
      setProject({ ...project, assets: updatedAssets })
    }
  }

  const cancelEdit = () => {
    setEditingAsset(null)
    setEditContent('')
  }

  const getAssetsByType = (type: string): Asset[] => {
    return project?.assets?.filter(asset => asset.asset_type === type) || []
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

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
          <Link href="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'blog', label: 'Blog Post', icon: FileText, count: getAssetsByType('blog').length },
    { id: 'social', label: 'Social Posts', icon: Share2, count: getAssetsByType('linkedin_post').length + getAssetsByType('tweet').length },
    { id: 'videos', label: 'Video Clips', icon: Video, count: getAssetsByType('video_clip').length },
    { id: 'images', label: 'Images', icon: ImageIcon, count: getAssetsByType('image').length },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="btn-secondary flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {project.title || 'Content Campaign'}
                </h1>
                <p className="text-sm text-gray-600">
                  Duration: {formatDuration(project.duration)} • Created {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <a
              href={project.original_video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View Original</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Blog Post Tab */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              {getAssetsByType('blog').map((asset) => (
                <div key={asset.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Blog Post</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(asset)}
                        className="btn-secondary p-2"
                        title="Edit content"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(asset.content || '')}
                        className="btn-secondary p-2"
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => downloadAsText(asset.content || '', 'blog-post.md')}
                        className="btn-secondary p-2"
                        title="Download as file"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {editingAsset === asset.id ? (
                    <div className="space-y-4">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm"
                        placeholder="Edit your blog post content..."
                      />
                      <div className="flex space-x-2">
                        <button onClick={saveEdit} className="btn-primary flex items-center space-x-2">
                          <Check className="h-4 w-4" />
                          <span>Save Changes</span>
                        </button>
                        <button onClick={cancelEdit} className="btn-secondary">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="prose max-w-none">
                      <ReactMarkdown>{asset.content || ''}</ReactMarkdown>
                    </div>
                  )}
                </div>
              ))}
              
              {getAssetsByType('blog').length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No blog post generated yet</p>
                </div>
              )}
            </div>
          )}

          {/* Social Posts Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              {/* LinkedIn Posts */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">LinkedIn Posts</h3>
                <div className="grid gap-4">
                  {getAssetsByType('linkedin_post').map((asset, index) => (
                    <div key={asset.id} className="card">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium text-gray-900">LinkedIn Post #{index + 1}</h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => copyToClipboard(asset.content || '')}
                            className="btn-secondary p-2"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => downloadAsText(asset.content || '', `linkedin-post-${index + 1}.txt`)}
                            className="btn-secondary p-2"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="whitespace-pre-wrap text-gray-800">{asset.content}</p>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {asset.metadata?.character_count} characters
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tweets */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tweets</h3>
                <div className="grid gap-4">
                  {getAssetsByType('tweet').map((asset, index) => (
                    <div key={asset.id} className="card">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium text-gray-900">Tweet #{index + 1}</h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => copyToClipboard(asset.content || '')}
                            className="btn-secondary p-2"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => downloadAsText(asset.content || '', `tweet-${index + 1}.txt`)}
                            className="btn-secondary p-2"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
                        <p className="whitespace-pre-wrap text-gray-800">{asset.content}</p>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {asset.metadata?.character_count} characters
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {getAssetsByType('linkedin_post').length === 0 && getAssetsByType('tweet').length === 0 && (
                <div className="text-center py-12">
                  <Share2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No social media posts generated yet</p>
                </div>
              )}
            </div>
          )}

          {/* Video Clips Tab */}
          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getAssetsByType('video_clip').map((asset, index) => (
                <div key={asset.id} className="card">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    {asset.file_url ? (
                      <video
                        src={asset.file_url}
                        controls
                        className="w-full h-full object-cover"
                        poster={project.thumbnail_url}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Clip #{index + 1}</h4>
                    <p className="text-sm text-gray-600">
                      Duration: {asset.metadata?.duration ? `${Math.round(asset.metadata.duration)}s` : 'Unknown'}
                    </p>
                    {asset.metadata?.description && (
                      <p className="text-sm text-gray-600">{asset.metadata.description}</p>
                    )}
                    {asset.file_url && (
                      <a
                        href={asset.file_url}
                        download={`clip-${index + 1}.mp4`}
                        className="btn-primary w-full text-center flex items-center justify-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
              
              {getAssetsByType('video_clip').length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No video clips generated yet</p>
                </div>
              )}
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getAssetsByType('image').map((asset, index) => (
                <div key={asset.id} className="card">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    {asset.file_url ? (
                      <img
                        src={asset.file_url}
                        alt={`Quote graphic ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Quote Graphic #{index + 1}</h4>
                    {asset.metadata?.quote_text && (
                      <p className="text-sm text-gray-600 italic">"{asset.metadata.quote_text}"</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {asset.metadata?.dimensions || '1080x1080'}
                    </p>
                    {asset.file_url && (
                      <a
                        href={asset.file_url}
                        download={`quote-graphic-${index + 1}.png`}
                        className="btn-primary w-full text-center flex items-center justify-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
              
              {getAssetsByType('image').length === 0 && (
                <div className="col-span-full text-center py-12">
                  <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No images generated yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}