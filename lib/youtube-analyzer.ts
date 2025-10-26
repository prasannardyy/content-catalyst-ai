// YouTube Video Analysis Service
export interface VideoAnalysis {
  videoId: string
  title: string
  description: string
  channelTitle: string
  duration: string
  viewCount: string
  publishedAt: string
  tags: string[]
  category: string
  thumbnail: string
  transcript?: string
  keyTopics: string[]
  summary: string
}

// Extract video ID from YouTube URL
export const getVideoId = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
  return match ? match[1] : ''
}

// Get video metadata using YouTube Data API
export const getVideoMetadata = async (videoId: string): Promise<Partial<VideoAnalysis>> => {
  try {
    // For demo purposes, we'll simulate API response based on video ID
    // In production, you would use: https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet,statistics,contentDetails
    
    // Simulate different video types based on video ID patterns
    const mockData = generateMockVideoData(videoId)
    
    return mockData
  } catch (error) {
    console.error('Error fetching video metadata:', error)
    return {
      videoId,
      title: 'Video Analysis',
      description: 'Analyzing video content...',
      category: 'general'
    }
  }
}

// Generate realistic mock data based on video ID
const generateMockVideoData = (videoId: string): Partial<VideoAnalysis> => {
  // Different mock data based on video ID characteristics
  const videoTypes = [
    {
      pattern: /[0-9]/,
      title: 'How to Start a Successful Business in 2024',
      description: 'Learn the essential steps to launch and grow your business. This comprehensive guide covers everything from idea validation to scaling your startup.',
      category: 'business',
      tags: ['business', 'entrepreneurship', 'startup', 'success', 'marketing'],
      keyTopics: ['Business Planning', 'Market Research', 'Funding', 'Marketing Strategy', 'Team Building'],
      summary: 'A comprehensive guide to starting and scaling a successful business, covering market research, funding strategies, and growth tactics.'
    },
    {
      pattern: /[a-c]/i,
      title: '10 Productivity Hacks That Actually Work',
      description: 'Discover science-backed productivity techniques that will transform your daily workflow and help you achieve more in less time.',
      category: 'productivity',
      tags: ['productivity', 'time management', 'efficiency', 'work', 'habits'],
      keyTopics: ['Time Blocking', 'Priority Matrix', 'Deep Work', 'Automation', 'Energy Management'],
      summary: 'Evidence-based productivity strategies including time blocking, energy management, and automation techniques for maximum efficiency.'
    },
    {
      pattern: /[d-f]/i,
      title: 'Complete Guide to Personal Finance and Investing',
      description: 'Master your money with this step-by-step guide to budgeting, saving, and investing for long-term wealth building.',
      category: 'finance',
      tags: ['finance', 'investing', 'money', 'wealth', 'budgeting'],
      keyTopics: ['Budgeting Basics', 'Investment Strategies', 'Retirement Planning', 'Risk Management', 'Passive Income'],
      summary: 'A complete financial education covering budgeting fundamentals, investment strategies, and wealth-building techniques for financial independence.'
    },
    {
      pattern: /[g-i]/i,
      title: 'Fitness Transformation: Build Muscle and Lose Fat',
      description: 'Transform your body with proven workout routines and nutrition strategies. Learn how to build lean muscle while burning fat effectively.',
      category: 'fitness',
      tags: ['fitness', 'workout', 'nutrition', 'health', 'muscle building'],
      keyTopics: ['Strength Training', 'Cardio Optimization', 'Nutrition Planning', 'Recovery Methods', 'Progress Tracking'],
      summary: 'A comprehensive fitness program combining strength training, cardio, and nutrition strategies for optimal body composition and health.'
    },
    {
      pattern: /[j-l]/i,
      title: 'Master JavaScript: From Beginner to Advanced',
      description: 'Complete JavaScript tutorial covering fundamentals to advanced concepts. Build real projects and master modern web development.',
      category: 'technology',
      tags: ['javascript', 'programming', 'web development', 'coding', 'tutorial'],
      keyTopics: ['ES6+ Features', 'Async Programming', 'DOM Manipulation', 'API Integration', 'Modern Frameworks'],
      summary: 'Comprehensive JavaScript course covering modern syntax, asynchronous programming, and practical web development skills.'
    },
    {
      pattern: /[m-o]/i,
      title: 'Travel Hacks: How to Travel the World on a Budget',
      description: 'Discover insider secrets to affordable travel. Learn how to find cheap flights, budget accommodations, and travel like a pro.',
      category: 'travel',
      tags: ['travel', 'budget travel', 'adventure', 'tips', 'lifestyle'],
      keyTopics: ['Flight Deals', 'Budget Accommodation', 'Travel Planning', 'Local Experiences', 'Safety Tips'],
      summary: 'Practical travel strategies for exploring the world affordably, including flight hacking, budget accommodation, and local travel tips.'
    }
  ]

  // Find matching video type or use default
  const matchedType = videoTypes.find(type => type.pattern.test(videoId)) || videoTypes[0]

  return {
    videoId,
    title: matchedType.title,
    description: matchedType.description,
    channelTitle: 'Content Creator',
    duration: '12:34',
    viewCount: Math.floor(Math.random() * 100000 + 10000).toString(),
    publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    tags: matchedType.tags,
    category: matchedType.category,
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    keyTopics: matchedType.keyTopics,
    summary: matchedType.summary
  }
}

// Generate content based on video analysis
export const generateVideoBasedContent = (analysis: VideoAnalysis) => {
  const { title, description, keyTopics, summary, category, tags } = analysis

  return {
    blogPost: generateBlogPost(analysis),
    linkedinPosts: generateLinkedInPosts(analysis),
    tweets: generateTweets(analysis),
    quotes: generateQuotes(analysis)
  }
}

const generateBlogPost = (analysis: VideoAnalysis) => {
  const { title, summary, keyTopics, category } = analysis
  
  return `# ${title}: Complete Guide and Key Insights

## Introduction

I recently watched an incredible video about ${category} that completely changed my perspective. The insights shared were so valuable that I had to break them down and share the key takeaways with you.

## Video Overview

${summary}

## Key Topics Covered

${keyTopics.map((topic, index) => `### ${index + 1}. ${topic}

This section provided actionable insights that you can implement immediately. The practical approach makes it easy to understand and apply these concepts in real-world situations.`).join('\n\n')}

## Main Takeaways

Based on the video content, here are the most important points to remember:

### Practical Application
The strategies discussed aren't just theoretical - they're proven methods that have been tested and refined. Each technique comes with specific steps you can follow.

### Real-World Results
What makes this content particularly valuable is the focus on measurable outcomes. You're not just learning concepts, but gaining tools that produce tangible results.

### Implementation Strategy
The video provides a clear roadmap for implementation, making it easy to get started regardless of your current level of experience.

## Action Steps

Here's how you can apply these insights:

1. **Start with the fundamentals** - Master the basics before moving to advanced techniques
2. **Focus on consistency** - Small daily actions compound into significant results
3. **Track your progress** - Measure what matters to stay motivated and adjust your approach
4. **Stay committed** - Success requires persistence and dedication to the process

## Conclusion

This video delivers exceptional value for anyone interested in ${category}. The combination of practical advice, real-world examples, and actionable strategies makes it a must-watch.

The insights shared can genuinely transform your approach to ${category} and help you achieve better results faster.

## Resources

- **Original Video**: Watch the full breakdown for detailed explanations and examples
- **Key Topics**: ${keyTopics.join(', ')}
- **Category**: ${category}

*What was your biggest takeaway? Share your thoughts and let me know how you plan to implement these strategies!*`
}

const generateLinkedInPosts = (analysis: VideoAnalysis) => {
  const { title, category, keyTopics, tags } = analysis
  
  return [
    {
      content: `🎥 Just watched an incredible video: "${title}"

The insights on ${category} were absolutely game-changing! Here are the key takeaways:

${keyTopics.slice(0, 4).map((topic, i) => `${i + 1}️⃣ ${topic}`).join('\n')}

What resonated most with me was the practical approach - these aren't just theories, but proven strategies you can implement immediately.

Have you explored ${category} recently? What's been your biggest challenge or success?

#${tags.join(' #')}`,
      hashtags: tags
    },
    {
      content: `💡 Key insight from today's video on ${category}:

"${analysis.summary.split('.')[0]}."

This completely shifted my perspective on how to approach ${category}. The practical examples and step-by-step guidance make it so much easier to understand and implement.

What's your experience with ${category}? I'd love to hear your thoughts and any tips you've discovered!

#${tags.slice(0, 3).join(' #')}`,
      hashtags: tags.slice(0, 3)
    }
  ]
}

const generateTweets = (analysis: VideoAnalysis) => {
  const { title, category, keyTopics, tags } = analysis
  
  return [
    {
      content: `🎯 Just watched: "${title.length > 60 ? title.substring(0, 57) + '...' : title}"

Mind-blowing insights on ${category}! 

Key takeaway: ${keyTopics[0]}

#${tags.slice(0, 2).join(' #')}`,
      hashtags: tags.slice(0, 2)
    },
    {
      content: `💡 Best ${category} advice I've heard:

"${analysis.summary.split('.')[0]}."

Simple but powerful. Sometimes the most effective strategies are the most straightforward ones.

#${tags[0]} #${category}`,
      hashtags: [tags[0], category]
    },
    {
      content: `🚀 New video breakdown on ${category}!

Covers: ${keyTopics.slice(0, 2).join(' & ')}

The practical approach makes it so much easier to implement these strategies.

#${tags.slice(0, 3).join(' #')}`,
      hashtags: tags.slice(0, 3)
    }
  ]
}

const generateQuotes = (analysis: VideoAnalysis) => {
  const { category, keyTopics } = analysis
  
  const quotes = [
    `Success in ${category} comes from consistent daily action`,
    `Master the fundamentals of ${category} first`,
    `${keyTopics[0]} is the foundation of success`,
    `Great ${category} results require great ${category} habits`
  ]
  
  return quotes.map(quote => ({
    text: quote,
    category: category
  }))
}