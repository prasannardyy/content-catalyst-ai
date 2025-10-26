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

// Function to generate content based on YouTube URL
const generateContentForVideo = (youtubeUrl: string, projectId: string) => {
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    return match ? match[1] : 'unknown'
  }
  
  const videoId = getVideoId(youtubeUrl)
  
  // Analyze the URL to determine content type and generate relevant content
  const analyzeVideoContent = (url: string) => {
    const urlLower = url.toLowerCase()
    
    // Extract potential keywords from URL parameters or common patterns
    let detectedTopic = 'general'
    let title = 'Your Video Content'
    let hashtags = ['Video', 'Content', 'YouTube']
    let quoteText = 'Great content creates great conversations'
    
    // Business/Entrepreneurship keywords
    if (urlLower.includes('business') || urlLower.includes('entrepreneur') || urlLower.includes('startup') || 
        urlLower.includes('marketing') || urlLower.includes('sales') || urlLower.includes('money') ||
        urlLower.includes('profit') || urlLower.includes('revenue')) {
      detectedTopic = 'business'
      title = 'Business & Entrepreneurship Insights'
      hashtags = ['Business', 'Entrepreneurship', 'Marketing', 'Success', 'Growth']
      quoteText = 'Success in business comes from serving others'
    }
    
    // Technology/Programming keywords
    else if (urlLower.includes('tech') || urlLower.includes('code') || urlLower.includes('programming') ||
             urlLower.includes('software') || urlLower.includes('ai') || urlLower.includes('javascript') ||
             urlLower.includes('python') || urlLower.includes('react') || urlLower.includes('tutorial')) {
      detectedTopic = 'technology'
      title = 'Technology & Programming Guide'
      hashtags = ['Technology', 'Programming', 'Coding', 'Tech', 'Development']
      quoteText = 'Code is poetry written for machines'
    }
    
    // Fitness/Health keywords
    else if (urlLower.includes('fitness') || urlLower.includes('workout') || urlLower.includes('health') ||
             urlLower.includes('diet') || urlLower.includes('exercise') || urlLower.includes('nutrition') ||
             urlLower.includes('weight') || urlLower.includes('muscle')) {
      detectedTopic = 'fitness'
      title = 'Health & Fitness Journey'
      hashtags = ['Fitness', 'Health', 'Workout', 'Nutrition', 'Wellness']
      quoteText = 'Your body is your temple, treat it well'
    }
    
    // Education/Learning keywords
    else if (urlLower.includes('learn') || urlLower.includes('education') || urlLower.includes('study') ||
             urlLower.includes('course') || urlLower.includes('lesson') || urlLower.includes('tutorial') ||
             urlLower.includes('guide') || urlLower.includes('how') || urlLower.includes('tips')) {
      detectedTopic = 'education'
      title = 'Learning & Educational Content'
      hashtags = ['Education', 'Learning', 'Knowledge', 'Skills', 'Growth']
      quoteText = 'Learning never stops, growing never ends'
    }
    
    // Lifestyle/Personal Development keywords
    else if (urlLower.includes('lifestyle') || urlLower.includes('motivation') || urlLower.includes('inspiration') ||
             urlLower.includes('mindset') || urlLower.includes('productivity') || urlLower.includes('habits') ||
             urlLower.includes('success') || urlLower.includes('goals')) {
      detectedTopic = 'lifestyle'
      title = 'Personal Development & Lifestyle'
      hashtags = ['Lifestyle', 'Motivation', 'PersonalDevelopment', 'Mindset', 'Success']
      quoteText = 'Your mindset determines your reality'
    }
    
    // Travel/Adventure keywords
    else if (urlLower.includes('travel') || urlLower.includes('adventure') || urlLower.includes('explore') ||
             urlLower.includes('journey') || urlLower.includes('destination') || urlLower.includes('trip')) {
      detectedTopic = 'travel'
      title = 'Travel & Adventure Experience'
      hashtags = ['Travel', 'Adventure', 'Explore', 'Journey', 'Experience']
      quoteText = 'Adventure awaits those who seek it'
    }
    
    // Food/Cooking keywords
    else if (urlLower.includes('food') || urlLower.includes('cooking') || urlLower.includes('recipe') ||
             urlLower.includes('kitchen') || urlLower.includes('chef') || urlLower.includes('meal')) {
      detectedTopic = 'food'
      title = 'Culinary Adventures & Recipes'
      hashtags = ['Food', 'Cooking', 'Recipe', 'Culinary', 'Kitchen']
      quoteText = 'Good food brings people together'
    }
    
    // Gaming keywords
    else if (urlLower.includes('game') || urlLower.includes('gaming') || urlLower.includes('play') ||
             urlLower.includes('stream') || urlLower.includes('esports')) {
      detectedTopic = 'gaming'
      title = 'Gaming Content & Entertainment'
      hashtags = ['Gaming', 'Games', 'Entertainment', 'Fun', 'Play']
      quoteText = 'Gaming is not just play, it\'s an art form'
    }
    
    // Music keywords
    else if (urlLower.includes('music') || urlLower.includes('song') || urlLower.includes('audio') ||
             urlLower.includes('sound') || urlLower.includes('beat') || urlLower.includes('melody')) {
      detectedTopic = 'music'
      title = 'Musical Journey & Sound'
      hashtags = ['Music', 'Audio', 'Sound', 'Melody', 'Art']
      quoteText = 'Music is the universal language of emotion'
    }
    
    return { detectedTopic, title, hashtags, quoteText }
  }
  
  const analysis = analyzeVideoContent(youtubeUrl)
  const shortUrl = youtubeUrl.length > 50 ? youtubeUrl.substring(0, 47) + '...' : youtubeUrl
  
  // Generate comprehensive content assets
  const assets: Asset[] = [
    // Blog Post
    {
      id: `asset_blog_${projectId}`,
      project_id: projectId,
      asset_type: 'blog',
      content: `# ${analysis.title}: Key Insights from Your Video

## Introduction

I just finished watching your video and wanted to share the key insights and takeaways that stood out to me. This content breakdown will help you repurpose your video into multiple formats and reach a wider audience.

## Video Analysis Summary

Your video covers important aspects of ${analysis.detectedTopic} that many people are looking to understand better. The content is well-structured and provides valuable information that can be repurposed across different platforms.

## Key Insights from Your Video

### Main Takeaway #1: Core Message
The central theme of your video focuses on delivering practical value to your audience. This approach resonates well because it provides actionable insights that viewers can implement immediately.

### Main Takeaway #2: Audience Engagement
Your presentation style and content structure show a clear understanding of your target audience's needs and interests. This is crucial for building a loyal following.

### Main Takeaway #3: Value Delivery
The way you present information demonstrates expertise while remaining accessible to viewers at different knowledge levels.

## Content Repurposing Opportunities

Based on your video, here are several ways to extend its reach:

### Blog Content
- Expand on the main points with additional examples
- Create step-by-step guides based on your recommendations
- Write follow-up posts addressing common questions

### Social Media
- Extract key quotes for Instagram posts
- Create Twitter threads summarizing main points
- Share behind-the-scenes insights on LinkedIn

### Visual Content
- Design quote graphics with your best insights
- Create infographics summarizing key points
- Develop carousel posts for Instagram and LinkedIn

## Recommended Next Steps

1. **Watch the original video**: ${youtubeUrl}
2. **Identify your favorite insights** and share them with your network
3. **Engage with the content** by leaving thoughtful comments
4. **Subscribe for more valuable content** like this

## Conclusion

Your video provides excellent value and demonstrates clear expertise in ${analysis.detectedTopic}. The insights shared can help many people improve their understanding and achieve better results.

Keep creating valuable content like this - your audience clearly benefits from your knowledge and experience.

---

*This analysis was generated based on: ${youtubeUrl}*

**What was your biggest takeaway from this video? Share your thoughts below!**`,
      metadata: {
        word_count: 380,
        reading_time: '3 min read',
        source_video: youtubeUrl,
        topic: analysis.title,
        detected_category: analysis.detectedTopic
      },
      created_at: new Date().toISOString()
    },
    
    // LinkedIn Posts
    {
      id: `asset_linkedin_${projectId}_1`,
      project_id: projectId,
      asset_type: 'linkedin_post',
      content: `🎥 Just shared some valuable insights about ${analysis.detectedTopic}!

This video covers key aspects that many professionals in our field are looking to understand better.

Key highlights:
✅ Practical, actionable advice you can implement today
✅ Real-world examples and case studies
✅ Step-by-step guidance for better results
✅ Common mistakes to avoid

The response has been incredible, and I wanted to share these insights with my LinkedIn network too.

What's your experience with ${analysis.detectedTopic}? I'd love to hear your thoughts and experiences in the comments! 👇

Watch the full breakdown: ${youtubeUrl}

#${analysis.hashtags.join(' #')}`,
      metadata: {
        character_count: 520,
        hashtags: analysis.hashtags,
        source_video: youtubeUrl,
        topic: analysis.title,
        detected_category: analysis.detectedTopic
      },
      created_at: new Date().toISOString()
    },
    {
      id: `asset_linkedin_${projectId}_2`,
      project_id: projectId,
      asset_type: 'linkedin_post',
      content: `💡 Key insight from my latest video on ${analysis.detectedTopic}:

"${analysis.quoteText}"

This resonates with so many people because it captures the essence of what really matters in this field.

In the full video, I dive deeper into:
🔍 Why this principle is so important
📊 Real examples of how it works in practice
🚀 How you can apply it to your own situation
⚠️ Common pitfalls to avoid

What's your take on this? Do you agree or have a different perspective?

Full video: ${shortUrl}

#${analysis.hashtags.join(' #')}`,
      metadata: {
        character_count: 480,
        hashtags: analysis.hashtags,
        source_video: youtubeUrl,
        topic: analysis.title,
        detected_category: analysis.detectedTopic
      },
      created_at: new Date().toISOString()
    },
    
    // Tweets
    {
      id: `asset_tweet_${projectId}_1`,
      project_id: projectId,
      asset_type: 'tweet',
      content: `🎥 New video about ${analysis.detectedTopic} is live!\n\nPacked with practical insights you can use right away.\n\nWatch: ${shortUrl}\n\n#${analysis.hashtags.slice(0, 3).join(' #')}`,
      metadata: {
        character_count: 150,
        hashtags: analysis.hashtags.slice(0, 3),
        source_video: youtubeUrl,
        topic: analysis.title,
        detected_category: analysis.detectedTopic
      },
      created_at: new Date().toISOString()
    },
    {
      id: `asset_tweet_${projectId}_2`,
      project_id: projectId,
      asset_type: 'tweet',
      content: `💡 Key insight from my latest ${analysis.detectedTopic} video:\n\n"${analysis.quoteText}"\n\nFull breakdown: ${shortUrl}\n\n#${analysis.hashtags.slice(0, 2).join(' #')}`,
      metadata: {
        character_count: 140,
        hashtags: analysis.hashtags.slice(0, 2),
        source_video: youtubeUrl,
        topic: analysis.title,
        detected_category: analysis.detectedTopic
      },
      created_at: new Date().toISOString()
    },
    {
      id: `asset_tweet_${projectId}_3`,
      project_id: projectId,
      asset_type: 'tweet',
      content: `🚀 Just shared my thoughts on ${analysis.detectedTopic}\n\nThis video covers everything you need to know to get started.\n\nCheck it out: ${shortUrl}\n\n#${analysis.hashtags[0]} #Video`,
      metadata: {
        character_count: 160,
        hashtags: [analysis.hashtags[0], 'Video'],
        source_video: youtubeUrl,
        topic: analysis.title,
        detected_category: analysis.detectedTopic
      },
      created_at: new Date().toISOString()
    },
    
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
    {
      id: `asset_image_${projectId}_1`,
      project_id: projectId,
      asset_type: 'image',
      file_url: `https://via.placeholder.com/1080x1080/3b82f6/ffffff?text=${encodeURIComponent(analysis.quoteText)}`,
      metadata: {
        quote_text: analysis.quoteText,
        dimensions: '1080x1080',
        format: 'PNG',
        background_color: '#3b82f6',
        text_color: '#ffffff',
        source_video: youtubeUrl,
        topic: analysis.detectedTopic
      },
      created_at: new Date().toISOString()
    },
    {
      id: `asset_image_${projectId}_2`,
      project_id: projectId,
      asset_type: 'image',
      file_url: `https://via.placeholder.com/1080x1080/10b981/ffffff?text=${encodeURIComponent(`New ${analysis.detectedTopic} Video`)}`,
      metadata: {
        quote_text: `New ${analysis.detectedTopic} Video`,
        dimensions: '1080x1080',
        format: 'PNG',
        background_color: '#10b981',
        text_color: '#ffffff',
        source_video: youtubeUrl,
        topic: analysis.detectedTopic
      },
      created_at: new Date().toISOString()
    },
    {
      id: `asset_image_${projectId}_3`,
      project_id: projectId,
      asset_type: 'image',
      file_url: `https://via.placeholder.com/1080x1080/f59e0b/ffffff?text=${encodeURIComponent(`${analysis.title} - Watch Now`)}`,
      metadata: {
        quote_text: `${analysis.title} - Watch Now`,
        dimensions: '1080x1080',
        format: 'PNG',
        background_color: '#f59e0b',
        text_color: '#ffffff',
        source_video: youtubeUrl,
        topic: analysis.detectedTopic
      },
      created_at: new Date().toISOString()
    }
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

// Helper function to complete project processing
const completeProject = (projectId: string, youtubeUrl: string) => {
  setTimeout(() => {
    const getVideoId = (url: string) => {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
      return match ? match[1] : 'unknown'
    }
    
    const videoId = getVideoId(youtubeUrl)
    
    const completedProject: Project = {
      id: projectId,
      user_id: auth?.currentUser?.uid || 'demo_user',
      original_video_url: youtubeUrl,
      title: `Content from Your Video`,
      description: 'AI-generated content based on your YouTube video',
      status: 'completed',
      duration: Math.floor(Math.random() * 600) + 120, // Random duration between 2-12 minutes
      thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      assets: generateContentForVideo(youtubeUrl, projectId),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    storeProject(completedProject)
    
    // Trigger a custom event to notify the UI (only in browser)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('projectCompleted', { detail: { projectId } }))
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
    // Extract video ID from YouTube URL for more realistic simulation
    const getVideoId = (url: string) => {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
      return match ? match[1] : 'unknown'
    }
    
    const videoId = getVideoId(youtubeUrl)
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
    
    // Start the completion process
    completeProject(projectId, youtubeUrl)
    
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