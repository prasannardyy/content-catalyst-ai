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
  
  // Generate topic-specific content based on common video types
  const generateTopicContent = () => {
    const topics = [
      {
        title: "Ultimate Guide to Success",
        blogTitle: "# The Ultimate Guide to Success: Key Insights from the Video\n\nSuccess isn't just about luck—it's about strategy, persistence, and making the right choices at the right time.",
        linkedinPost: "🚀 Just dropped my latest video on the ultimate guide to success!\n\nKey takeaways:\n✅ Success requires consistent daily habits\n✅ Mindset is everything - think growth, not fixed\n✅ Network with purpose, not just for numbers\n✅ Failure is feedback, not a final verdict\n\nWhat's your #1 success principle? Share below! 👇\n\nWatch the full breakdown: ${youtubeUrl}\n\n#Success #Motivation #PersonalDevelopment #Growth",
        tweet: "🎯 Success isn't about perfection, it's about progression.\n\nMy latest video breaks down the exact framework I use to achieve my goals.\n\nWatch here: ${youtubeUrl}\n\n#Success #Goals #Motivation",
        quoteText: "Success is progression, not perfection"
      },
      {
        title: "Productivity Hacks That Actually Work",
        blogTitle: "# Productivity Hacks That Actually Work: Proven Strategies\n\nStop wasting time on productivity tips that don't work. Here are the science-backed methods that will transform your daily output.",
        linkedinPost: "⚡ Tired of productivity advice that doesn't work?\n\nI tested 50+ productivity hacks so you don't have to. Here are the only 5 that actually moved the needle:\n\n1️⃣ Time blocking (not just to-do lists)\n2️⃣ The 2-minute rule for small tasks\n3️⃣ Energy management over time management\n4️⃣ Single-tasking with 25-min focus blocks\n5️⃣ Weekly reviews to course-correct\n\nFull breakdown in my latest video: ${youtubeUrl}\n\n#Productivity #TimeManagement #WorkSmart #Efficiency",
        tweet: "🧠 Productivity isn't about doing more.\n\nIt's about doing the right things at the right time.\n\nMy latest video reveals the 5 hacks that actually work: ${youtubeUrl}\n\n#Productivity #Focus #WorkSmart",
        quoteText: "Work smarter, not harder"
      },
      {
        title: "Business Growth Strategies",
        blogTitle: "# Proven Business Growth Strategies: From Startup to Scale\n\nGrowing a business isn't about luck—it's about implementing the right strategies at the right time. Here's what actually works.",
        linkedinPost: "📈 Want to scale your business but don't know where to start?\n\nI've helped 100+ businesses grow from 6 to 7 figures. Here's the framework:\n\n🎯 Focus on ONE customer avatar first\n💰 Perfect your pricing before scaling\n🔄 Build systems that work without you\n📊 Track metrics that actually matter\n🚀 Invest in team before tools\n\nDetailed breakdown in my latest video: ${youtubeUrl}\n\n#Business #Entrepreneurship #Growth #Scaling #Strategy",
        tweet: "💡 The biggest business growth mistake?\n\nTrying to serve everyone instead of serving someone perfectly.\n\nNiche down, then scale up. Full strategy: ${youtubeUrl}\n\n#Business #Entrepreneurship #Growth",
        quoteText: "Niche down, then scale up"
      },
      {
        title: "Life-Changing Mindset Shifts",
        blogTitle: "# 5 Mindset Shifts That Will Change Your Life Forever\n\nYour mindset determines your reality. These powerful shifts will transform how you see challenges, opportunities, and success.",
        linkedinPost: "🧠 Your mindset is your superpower.\n\nAfter studying high performers for 10+ years, I've identified the 5 mindset shifts that separate winners from everyone else:\n\n1️⃣ Problems → Opportunities\n2️⃣ Fixed → Growth mindset\n3️⃣ Scarcity → Abundance thinking\n4️⃣ Perfectionism → Progress focus\n5️⃣ Victim → Owner mentality\n\nWhich one resonates most with you?\n\nFull deep-dive: ${youtubeUrl}\n\n#Mindset #PersonalDevelopment #Growth #Success #Psychology",
        tweet: "🔄 Mindset shift that changed everything:\n\nFrom \"Why is this happening TO me?\"\nTo \"Why is this happening FOR me?\"\n\nGame changer. More shifts in my latest video: ${youtubeUrl}\n\n#Mindset #Growth #Perspective",
        quoteText: "Your mindset is your superpower"
      },
      {
        title: "Financial Freedom Blueprint",
        blogTitle: "# The Financial Freedom Blueprint: Step-by-Step Guide\n\nFinancial freedom isn't about making millions—it's about making smart decisions with whatever you earn. Here's your roadmap.",
        linkedinPost: "💰 Financial freedom isn't about your income—it's about your habits.\n\nI went from broke to financially free using this exact blueprint:\n\n📊 Track every dollar (awareness is key)\n💳 Pay yourself first (automate savings)\n📈 Invest in assets, not liabilities\n🏠 Build multiple income streams\n🎯 Live below your means, invest the difference\n\nStep-by-step guide in my latest video: ${youtubeUrl}\n\n#FinancialFreedom #PersonalFinance #Investing #MoneyTips #WealthBuilding",
        tweet: "💡 Financial freedom formula:\n\nEarn → Save → Invest → Repeat\n\nSimple but not easy. My complete blueprint: ${youtubeUrl}\n\n#FinancialFreedom #PersonalFinance #Investing",
        quoteText: "Financial freedom starts with financial discipline"
      }
    ]
    
    return topics[Math.floor(Math.random() * topics.length)]
  }
  
  const topicContent = generateTopicContent()
  
  // Generate comprehensive content assets
  const assets: Asset[] = [
    // Blog Post
    {
      id: `asset_blog_${projectId}`,
      project_id: projectId,
      asset_type: 'blog',
      content: `${topicContent.blogTitle}

## Introduction

In this comprehensive guide, I break down the exact strategies and insights from my latest video. Whether you're just starting out or looking to level up, these actionable tips will help you achieve your goals faster.

## Key Insights from the Video

### Main Takeaway #1: Foundation First
Before you can build anything meaningful, you need a solid foundation. This means:
- Clear goals and vision
- Strong daily habits
- The right mindset and attitude
- A system that supports your growth

### Main Takeaway #2: Consistency Beats Perfection
The most successful people aren't the most talented—they're the most consistent. Small daily actions compound into massive results over time.

### Main Takeaway #3: Learn, Apply, Adjust
Success is an iterative process:
1. Learn new strategies and concepts
2. Apply them in your own context
3. Measure results and adjust accordingly
4. Repeat the cycle

## Practical Action Steps

Based on the video content, here are the specific steps you can take today:

1. **Start with clarity** - Define exactly what you want to achieve
2. **Create your system** - Build processes that support your goals
3. **Track your progress** - Measure what matters most
4. **Stay consistent** - Show up every day, even when you don't feel like it
5. **Adjust as needed** - Be flexible with your methods, not your goals

## Common Mistakes to Avoid

- Trying to do everything at once
- Focusing on perfection instead of progress
- Giving up too early when results don't come immediately
- Not tracking your progress and learning from data

## Next Steps

1. Watch the full video for detailed explanations: ${youtubeUrl}
2. Choose ONE action step to implement this week
3. Track your progress and adjust as needed
4. Share your results and lessons learned

## Conclusion

Success isn't about overnight transformations—it's about consistent daily improvements. Use these insights to create lasting change in your life and business.

Remember: The best time to start was yesterday. The second best time is now.

---

*This blog post was generated based on the insights from: ${youtubeUrl}*

**What's your biggest takeaway? Let me know in the comments below!**`,
      metadata: {
        word_count: 420,
        reading_time: '3 min read',
        source_video: youtubeUrl,
        topic: topicContent.title
      },
      created_at: new Date().toISOString()
    },
    
    // LinkedIn Posts
    {
      id: `asset_linkedin_${projectId}_1`,
      project_id: projectId,
      asset_type: 'linkedin_post',
      content: topicContent.linkedinPost.replace('${youtubeUrl}', youtubeUrl),
      metadata: {
        character_count: topicContent.linkedinPost.length,
        hashtags: ['Success', 'Motivation', 'PersonalDevelopment', 'Growth', 'Video'],
        source_video: youtubeUrl,
        topic: topicContent.title
      },
      created_at: new Date().toISOString()
    },
    {
      id: `asset_linkedin_${projectId}_2`,
      project_id: projectId,
      asset_type: 'linkedin_post',
      content: `🎬 Behind the scenes of my latest video creation process!\n\nCreating valuable content isn't just about hitting record. Here's what goes into each video:\n\n📝 Research: 3-4 hours of studying the topic\n🎯 Scripting: Outlining key points and flow\n🎥 Recording: Multiple takes to get it right\n✂️ Editing: Cutting out the fluff, keeping the gold\n📊 Optimization: Thumbnails, titles, descriptions\n\nThe goal? Deliver maximum value in minimum time.\n\nWhat's your content creation process? Share your tips below! 👇\n\nWatch the final result: ${youtubeUrl}\n\n#ContentCreation #VideoMarketing #BehindTheScenes #CreatorLife`,
      metadata: {
        character_count: 580,
        hashtags: ['ContentCreation', 'VideoMarketing', 'BehindTheScenes', 'CreatorLife'],
        source_video: youtubeUrl,
        topic: 'Content Creation Process'
      },
      created_at: new Date().toISOString()
    },
    
    // Tweets
    {
      id: `asset_tweet_${projectId}_1`,
      project_id: projectId,
      asset_type: 'tweet',
      content: topicContent.tweet.replace('${youtubeUrl}', youtubeUrl),
      metadata: {
        character_count: topicContent.tweet.length,
        hashtags: ['Success', 'Goals', 'Motivation'],
        source_video: youtubeUrl,
        topic: topicContent.title
      },
      created_at: new Date().toISOString()
    },
    {
      id: `asset_tweet_${projectId}_2`,
      project_id: projectId,
      asset_type: 'tweet',
      content: `🎥 New video just dropped!\n\nPacked with actionable insights you can implement today.\n\nNo fluff, just value.\n\nWatch: ${youtubeUrl}\n\n#NewVideo #Value #ActionableContent`,
      metadata: {
        character_count: 165,
        hashtags: ['NewVideo', 'Value', 'ActionableContent'],
        source_video: youtubeUrl,
        topic: 'Video Announcement'
      },
      created_at: new Date().toISOString()
    },
    {
      id: `asset_tweet_${projectId}_3`,
      project_id: projectId,
      asset_type: 'tweet',
      content: `💡 Key insight from my latest video:\n\n"${topicContent.quoteText}"\n\nFull context and more insights: ${youtubeUrl}\n\n#Insights #Wisdom #Growth`,
      metadata: {
        character_count: 140,
        hashtags: ['Insights', 'Wisdom', 'Growth'],
        source_video: youtubeUrl,
        topic: 'Key Quote'
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
      file_url: `https://via.placeholder.com/1080x1080/3b82f6/ffffff?text=${encodeURIComponent(topicContent.quoteText)}`,
      metadata: {
        quote_text: topicContent.quoteText,
        dimensions: '1080x1080',
        format: 'PNG',
        background_color: '#3b82f6',
        text_color: '#ffffff',
        source_video: youtubeUrl
      },
      created_at: new Date().toISOString()
    },
    {
      id: `asset_image_${projectId}_2`,
      project_id: projectId,
      asset_type: 'image',
      file_url: `https://via.placeholder.com/1080x1080/10b981/ffffff?text=Watch+My+Latest+Video`,
      metadata: {
        quote_text: 'Watch My Latest Video',
        dimensions: '1080x1080',
        format: 'PNG',
        background_color: '#10b981',
        text_color: '#ffffff',
        source_video: youtubeUrl
      },
      created_at: new Date().toISOString()
    },
    {
      id: `asset_image_${projectId}_3`,
      project_id: projectId,
      asset_type: 'image',
      file_url: `https://via.placeholder.com/1080x1080/f59e0b/ffffff?text=New+Content+Alert`,
      metadata: {
        quote_text: 'New Content Alert',
        dimensions: '1080x1080',
        format: 'PNG',
        background_color: '#f59e0b',
        text_color: '#ffffff',
        source_video: youtubeUrl
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