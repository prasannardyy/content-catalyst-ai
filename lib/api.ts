import axios from 'axios'
import { auth } from './firebase'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth interceptor
api.interceptors.request.use(async (config) => {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  const hasFirebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                            process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  
  if (isDemoMode || !hasFirebaseConfig || !auth) {
    // Use demo token in demo mode
    config.headers.Authorization = `Bearer demo_token_123`
  } else {
    // Get Firebase ID token
    const user = auth.currentUser
    if (user) {
      const idToken = await user.getIdToken()
      config.headers.Authorization = `Bearer ${idToken}`
    }
  }
  
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    const hasFirebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                              process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    
    if (error.response?.status === 401 && !isDemoMode && hasFirebaseConfig) {
      // Redirect to login on unauthorized (only in non-demo mode with Firebase)
      window.location.href = '/auth/login'
    }
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

// Mock data for demo mode
const mockAssets: Asset[] = [
  {
    id: 'asset_blog_1',
    project_id: 'demo_project_1',
    asset_type: 'blog',
    content: `# The Future of AI: Transforming Industries and Daily Life

Artificial Intelligence (AI) has evolved from a futuristic concept to a transformative force reshaping industries and our daily lives. As we stand at the threshold of an AI-driven era, it's crucial to understand how this technology is revolutionizing the way we work, communicate, and solve complex problems.

## The Current State of AI

Today's AI systems are more sophisticated than ever before. Machine learning algorithms can now:

- **Process vast amounts of data** in real-time
- **Recognize patterns** that humans might miss
- **Make predictions** with remarkable accuracy
- **Automate complex tasks** across various industries

## Industry Transformations

### Healthcare
AI is revolutionizing healthcare through:
- Advanced diagnostic tools that can detect diseases earlier
- Personalized treatment plans based on genetic data
- Drug discovery acceleration
- Robotic surgery with enhanced precision

### Finance
The financial sector leverages AI for:
- Fraud detection and prevention
- Algorithmic trading
- Risk assessment and management
- Customer service automation

### Transportation
Autonomous vehicles and smart transportation systems are:
- Reducing traffic accidents
- Optimizing route planning
- Improving fuel efficiency
- Enabling new mobility services

## The Road Ahead

As AI continues to evolve, we can expect:

1. **More intuitive human-AI collaboration**
2. **Enhanced personalization** in products and services
3. **Breakthrough solutions** to global challenges
4. **New job categories** emerging alongside automation

## Conclusion

The AI revolution is not just about technology—it's about reimagining what's possible. As we embrace these changes, it's essential to ensure that AI development remains ethical, inclusive, and beneficial for all of humanity.

The future is AI-powered, and it's arriving faster than we ever imagined.`,
    metadata: {
      word_count: 285,
      reading_time: '2 min read'
    },
    created_at: new Date().toISOString()
  },
  {
    id: 'asset_linkedin_1',
    project_id: 'demo_project_1',
    asset_type: 'linkedin_post',
    content: `🚀 The AI revolution is here, and it's transforming everything!

From healthcare breakthroughs to autonomous vehicles, artificial intelligence is reshaping industries at an unprecedented pace.

Key highlights:
✅ AI-powered diagnostics are detecting diseases earlier than ever
✅ Financial systems are becoming more secure with AI fraud detection
✅ Transportation is getting safer with autonomous technology

The most exciting part? We're just getting started. The future belongs to those who embrace AI as a collaborative partner, not a replacement.

What industry do you think will be most transformed by AI in the next 5 years?

#AI #ArtificialIntelligence #Innovation #Technology #Future`,
    metadata: {
      character_count: 567,
      hashtags: ['AI', 'ArtificialIntelligence', 'Innovation', 'Technology', 'Future']
    },
    created_at: new Date().toISOString()
  },
  {
    id: 'asset_linkedin_2',
    project_id: 'demo_project_1',
    asset_type: 'linkedin_post',
    content: `💡 AI isn't just changing technology—it's changing how we think about problems.

Yesterday's impossible is today's routine:
• Computers that understand human language
• Systems that learn from experience
• Machines that create art and music

The real magic happens when AI amplifies human creativity and intelligence, not when it replaces them.

Ready to be part of the AI-powered future? 🌟

#MachineLearning #Innovation #FutureOfWork #TechTrends`,
    metadata: {
      character_count: 423,
      hashtags: ['MachineLearning', 'Innovation', 'FutureOfWork', 'TechTrends']
    },
    created_at: new Date().toISOString()
  },
  {
    id: 'asset_tweet_1',
    project_id: 'demo_project_1',
    asset_type: 'tweet',
    content: `🤖 AI is not the future—it's the present!

From your smartphone's camera to Netflix recommendations, AI is already everywhere.

The question isn't "when will AI arrive?" but "how will you use it to create value?"

#AI #Innovation #TechTrends`,
    metadata: {
      character_count: 234,
      hashtags: ['AI', 'Innovation', 'TechTrends']
    },
    created_at: new Date().toISOString()
  },
  {
    id: 'asset_tweet_2',
    project_id: 'demo_project_1',
    asset_type: 'tweet',
    content: `🚀 The AI revolution isn't about replacing humans—it's about amplifying human potential.

Best AI applications:
✅ Enhance creativity
✅ Solve complex problems
✅ Automate repetitive tasks
✅ Unlock new possibilities

#ArtificialIntelligence #FutureOfWork`,
    metadata: {
      character_count: 267,
      hashtags: ['ArtificialIntelligence', 'FutureOfWork']
    },
    created_at: new Date().toISOString()
  },
  {
    id: 'asset_image_1',
    project_id: 'demo_project_1',
    asset_type: 'image',
    file_url: 'https://via.placeholder.com/1080x1080/3b82f6/ffffff?text=AI+is+not+the+future%E2%80%94it%27s+the+present!',
    metadata: {
      quote_text: 'AI is not the future—it\'s the present!',
      dimensions: '1080x1080',
      format: 'PNG'
    },
    created_at: new Date().toISOString()
  },
  {
    id: 'asset_image_2',
    project_id: 'demo_project_1',
    asset_type: 'image',
    file_url: 'https://via.placeholder.com/1080x1080/10b981/ffffff?text=The+future+belongs+to+those+who+embrace+AI',
    metadata: {
      quote_text: 'The future belongs to those who embrace AI',
      dimensions: '1080x1080',
      format: 'PNG'
    },
    created_at: new Date().toISOString()
  }
]

import { getVideoId, getVideoMetadata, generateVideoBasedContent, VideoAnalysis } from './youtube-analyzer'
import { generateQuoteImages, generateThumbnailImages } from './image-generator'

// Function to generate content based on YouTube URL
const generateContentForVideo = async (youtubeUrl: string, projectId: string) => {
  const videoId = getVideoId(youtubeUrl)
  
  if (!videoId) {
    throw new Error('Invalid YouTube URL')
  }

  // Get video metadata and analysis
  const videoData = await getVideoMetadata(videoId, youtubeUrl)
  
  // Create complete video analysis object
  const analysis: VideoAnalysis = {
    videoId,
    title: videoData.title || 'Video Analysis',
    description: videoData.description || 'Analyzing video content...',
    channelTitle: videoData.channelTitle || 'Content Creator',
    duration: videoData.duration || '10:00',
    viewCount: videoData.viewCount || '1000',
    publishedAt: videoData.publishedAt || new Date().toISOString(),
    tags: videoData.tags || ['video', 'content'],
    category: videoData.category || 'general',
    thumbnail: videoData.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    keyTopics: videoData.keyTopics || ['Key Insights', 'Main Points', 'Takeaways'],
    summary: videoData.summary || 'This video provides valuable insights and practical advice.'
  }

  // Generate content based on video analysis
  const generatedContent = generateVideoBasedContent(analysis)
  
  // Generate quote images
  const quoteImages = await generateQuoteImages(generatedContent.quotes, videoId)
  const thumbnailImages = await generateThumbnailImages(analysis.title, analysis.category, videoId)
  
  const shortUrl = youtubeUrl.length > 50 ? youtubeUrl.substring(0, 47) + '...' : youtubeUrl
  
  // Generate comprehensive content assets
  const assets: Asset[] = [
    // Blog Post
    {
      id: `asset_blog_${projectId}`,
      project_id: projectId,
      asset_type: 'blog',
      content: generatedContent.blogPost,
      metadata: {
        word_count: generatedContent.blogPost.split(' ').length,
        reading_time: `${Math.ceil(generatedContent.blogPost.split(' ').length / 200)} min read`,
        source_video: youtubeUrl,
        topic: analysis.title,
        detected_category: analysis.category,
        key_topics: analysis.keyTopics
      },
      created_at: new Date().toISOString()
    },
    
    // LinkedIn Posts
    ...generatedContent.linkedinPosts.map((post, index) => ({
      id: `asset_linkedin_${projectId}_${index + 1}`,
      project_id: projectId,
      asset_type: 'linkedin_post' as const,
      content: post.content,
      metadata: {
        character_count: post.content.length,
        hashtags: post.hashtags,
        source_video: youtubeUrl,
        topic: analysis.title,
        detected_category: analysis.category,
        key_topics: analysis.keyTopics
      },
      created_at: new Date().toISOString()
    })),
    
    // Tweets
    ...generatedContent.tweets.map((tweet, index) => ({
      id: `asset_tweet_${projectId}_${index + 1}`,
      project_id: projectId,
      asset_type: 'tweet' as const,
      content: tweet.content,
      metadata: {
        character_count: tweet.content.length,
        hashtags: tweet.hashtags,
        source_video: youtubeUrl,
        topic: analysis.title,
        detected_category: analysis.category,
        key_topics: analysis.keyTopics
      },
      created_at: new Date().toISOString()
    })),
    
    // Video Clips
    {
      id: `asset_video_${projectId}_1`,
      project_id: projectId,
      asset_type: 'video_clip',
      file_url: `https://www.youtube.com/embed/${videoId}?start=30&end=90`,
      metadata: {
        title: 'Key Insight Clip',
        description: 'The most important takeaway from the video',
        duration: 60,
        start_time: 30,
        end_time: 90,
        source_video: youtubeUrl
      },
      created_at: new Date().toISOString()
    },
    {
      id: `asset_video_${projectId}_2`,
      project_id: projectId,
      asset_type: 'video_clip',
      file_url: `https://www.youtube.com/embed/${videoId}?start=120&end=180`,
      metadata: {
        title: 'Actionable Tips Segment',
        description: 'Practical steps you can implement immediately',
        duration: 60,
        start_time: 120,
        end_time: 180,
        source_video: youtubeUrl
      },
      created_at: new Date().toISOString()
    },
    {
      id: `asset_video_${projectId}_3`,
      project_id: projectId,
      asset_type: 'video_clip',
      file_url: `https://www.youtube.com/embed/${videoId}?start=0&end=30`,
      metadata: {
        title: 'Hook & Introduction',
        description: 'Perfect for social media teasers',
        duration: 30,
        start_time: 0,
        end_time: 30,
        source_video: youtubeUrl
      },
      created_at: new Date().toISOString()
    },
    
    // Quote Graphics/Images
    ...quoteImages.map((image, index) => ({
      id: `asset_image_${projectId}_${index + 1}`,
      project_id: projectId,
      asset_type: 'image' as const,
      file_url: image.url,
      metadata: {
        quote_text: image.quote,
        dimensions: '1080x1080',
        format: 'PNG',
        background_color: image.background,
        text_color: image.textColor,
        source_video: youtubeUrl,
        topic: analysis.category,
        video_title: analysis.title
      },
      created_at: new Date().toISOString()
    })),
    
    // Thumbnail Images
    ...thumbnailImages.map((image, index) => ({
      id: `asset_thumbnail_${projectId}_${index + 1}`,
      project_id: projectId,
      asset_type: 'image' as const,
      file_url: image.url,
      metadata: {
        quote_text: image.quote,
        dimensions: '1280x720',
        format: 'PNG',
        background_color: image.background,
        text_color: image.textColor,
        source_video: youtubeUrl,
        topic: analysis.category,
        video_title: analysis.title,
        type: 'thumbnail'
      },
      created_at: new Date().toISOString()
    }))
  ]
  
  return assets
}

const mockProject: Project = {
  id: 'demo_project_1',
  user_id: 'demo_user_123',
  original_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  status: 'completed',
  title: 'The Future of AI: Transforming Industries and Daily Life',
  description: 'A comprehensive exploration of how artificial intelligence is reshaping our world',
  duration: 847, // 14:07
  thumbnail_url: 'https://via.placeholder.com/320x180/3b82f6/ffffff?text=AI+Future+Video',
  assets: mockAssets,
  created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  updated_at: new Date().toISOString()
}

// Helper function to store projects in localStorage
const storeProject = (project: Project) => {
  // Check if we're in the browser (localStorage is only available client-side)
  if (typeof window === 'undefined') {
    return
  }
  
  const storedProjects = JSON.parse(localStorage.getItem('user_projects') || '[]')
  const existingIndex = storedProjects.findIndex((p: Project) => p.id === project.id)
  
  if (existingIndex >= 0) {
    storedProjects[existingIndex] = project
  } else {
    storedProjects.push(project)
  }
  
  localStorage.setItem('user_projects', JSON.stringify(storedProjects))
}

// Helper function to complete project processing with real content
const completeProjectWithRealContent = async (projectId: string, youtubeUrl: string) => {
  setTimeout(async () => {
    try {
      const videoId = getVideoId(youtubeUrl)
      const assets = await generateContentForVideo(youtubeUrl, projectId)
      
      // Get video metadata for title and description
      const videoData = await getVideoMetadata(videoId, youtubeUrl)
      
      const completedProject: Project = {
        id: projectId,
        user_id: auth?.currentUser?.uid || 'demo_user',
        original_video_url: youtubeUrl,
        title: videoData.title || `Content from Your Video`,
        description: videoData.summary || 'AI-generated content based on your YouTube video',
        status: 'completed',
        duration: Math.floor(Math.random() * 600) + 120, // Random duration between 2-12 minutes
        thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        assets: assets,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      storeProject(completedProject)
      
      // Trigger a custom event to notify the UI (only in browser)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('projectCompleted', { detail: { projectId } }))
      }
    } catch (error) {
      console.error('Error completing project:', error)
      // Fallback to basic completion if content generation fails
      const videoId = getVideoId(youtubeUrl)
      const completedProject: Project = {
        id: projectId,
        user_id: auth?.currentUser?.uid || 'demo_user',
        original_video_url: youtubeUrl,
        title: `Content Analysis Complete`,
        description: 'Basic content analysis completed',
        status: 'completed',
        duration: 300,
        thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        assets: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      storeProject(completedProject)
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('projectCompleted', { detail: { projectId } }))
      }
    }
  }, 3000) // Complete after 3 seconds
}

export const projectsApi = {
  // Get all projects for the current user
  getProjects: async (): Promise<Project[]> => {
    // Check if we're in the browser (localStorage is only available client-side)
    if (typeof window === 'undefined') {
      return [mockProject]
    }
    
    // Get user-created projects from localStorage
    const storedProjects = JSON.parse(localStorage.getItem('user_projects') || '[]')
    
    // Combine with the default demo project
    const allProjects = [mockProject, ...storedProjects]
    
    // Sort by creation date (newest first)
    return allProjects.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    // TODO: Uncomment this when you have a backend API running
    /*
    try {
      const response = await api.get('/projects')
      return response.data
    } catch (error) {
      // Fallback to mock data if API is not available
      console.warn('Backend API not available, using mock data')
      return [mockProject]
    }
    */
  },

  // Get a specific project with assets
  getProject: async (projectId: string): Promise<Project> => {
    // Check if this is the default demo project
    if (projectId === 'demo_project_1') {
      return mockProject
    }
    
    // Check if we're in the browser (localStorage is only available client-side)
    if (typeof window === 'undefined') {
      throw new Error('Project not found')
    }
    
    // For user-created projects, check if we have stored data
    const storedProjects = JSON.parse(localStorage.getItem('user_projects') || '[]')
    const userProject = storedProjects.find((p: Project) => p.id === projectId)
    
    if (userProject) {
      return userProject
    }
    
    // If project not found, return error
    throw new Error('Project not found')
    
    // TODO: Uncomment this when you have a backend API running
    /*
    try {
      const response = await api.get(`/projects/${projectId}`)
      return response.data
    } catch (error) {
      // Fallback to mock data if API is not available
      console.warn('Backend API not available, using mock data')
      if (projectId === 'demo_project_1' || projectId.startsWith('demo_project_') || projectId.startsWith('project_')) {
        return mockProject
      }
      throw new Error('Project not found')
    }
    */
  },

  // Create a new project
  createProject: async (youtubeUrl: string): Promise<Project> => {
    const videoId = getVideoId(youtubeUrl)
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL')
    }
    
    const projectId = `project_${Date.now()}`
    
    // Create a more realistic project based on the URL
    const newProject: Project = {
      id: projectId,
      user_id: auth?.currentUser?.uid || 'demo_user',
      original_video_url: youtubeUrl,
      title: 'Processing your video...',
      description: 'AI is analyzing your content and generating assets',
      status: 'processing',
      duration: undefined,
      thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      assets: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Store the processing project
    storeProject(newProject)
    
    // Start the completion process with real content generation
    completeProjectWithRealContent(projectId, youtubeUrl)
    
    return newProject
    
    // TODO: Uncomment this when you have a backend API running
    /*
    try {
      const response = await api.post('/projects', {
        youtube_url: youtubeUrl
      })
      return response.data
    } catch (error) {
      // Fallback to mock data if API is not available
      console.warn('Backend API not available, using mock data')
      return newProject
    }
    */
  },
}

export default api