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
export const getVideoMetadata = async (videoId: string, url: string): Promise<Partial<VideoAnalysis>> => {
  try {
    // For demo purposes, we'll simulate API response based on URL analysis
    // In production, you would use: https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet,statistics,contentDetails
    
    // Analyze the URL to determine content type
    const mockData = generateMockVideoData(videoId, url)
    
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

// Analyze URL and video ID to determine content type
const analyzeVideoContent = (url: string, videoId: string): Partial<VideoAnalysis> => {
  const urlLower = url.toLowerCase()
  
  // Check for music-related indicators first (highest priority)
  if (isMusicVideo(urlLower, videoId)) {
    return generateMusicContent(videoId)
  }
  
  // Check for other content types
  if (isBusinessContent(urlLower)) {
    return generateBusinessContent(videoId)
  }
  
  if (isTechContent(urlLower)) {
    return generateTechContent(videoId)
  }
  
  if (isFitnessContent(urlLower)) {
    return generateFitnessContent(videoId)
  }
  
  if (isEducationContent(urlLower)) {
    return generateEducationContent(videoId)
  }
  
  if (isTravelContent(urlLower)) {
    return generateTravelContent(videoId)
  }
  
  if (isGamingContent(urlLower)) {
    return generateGamingContent(videoId)
  }
  
  // Default to general content
  return generateGeneralContent(videoId)
}

// Music detection function
const isMusicVideo = (url: string, videoId: string): boolean => {
  // Common music indicators in URLs
  const musicKeywords = [
    'music', 'song', 'audio', 'sound', 'beat', 'melody', 'lyrics', 'album',
    'artist', 'band', 'singer', 'vocal', 'instrumental', 'remix', 'cover',
    'official', 'mv', 'clip', 'single', 'track', 'playlist', 'radio'
  ]
  
  // Common music video ID patterns (many music videos have specific patterns)
  const musicVideoPatterns = [
    /^[a-zA-Z0-9_-]{11}$/, // Standard YouTube video ID format
  ]
  
  // Check URL for music keywords
  const hasMusickeywords = musicKeywords.some(keyword => url.includes(keyword))
  
  // Check for common music channel patterns
  const musicChannelPatterns = [
    'vevo', 'records', 'music', 'entertainment', 'label'
  ]
  const hasMusicChannel = musicChannelPatterns.some(pattern => url.includes(pattern))
  
  return hasMusickeywords || hasMusicChannel
}

// Content type detection functions
const isBusinessContent = (url: string): boolean => {
  return ['business', 'entrepreneur', 'startup', 'marketing', 'sales', 'money', 'profit', 'revenue'].some(keyword => url.includes(keyword))
}

const isTechContent = (url: string): boolean => {
  return ['tech', 'code', 'programming', 'software', 'ai', 'javascript', 'python', 'react', 'tutorial', 'development'].some(keyword => url.includes(keyword))
}

const isFitnessContent = (url: string): boolean => {
  return ['fitness', 'workout', 'health', 'diet', 'exercise', 'nutrition', 'weight', 'muscle', 'gym'].some(keyword => url.includes(keyword))
}

const isEducationContent = (url: string): boolean => {
  return ['learn', 'education', 'study', 'course', 'lesson', 'tutorial', 'guide', 'how', 'tips', 'school'].some(keyword => url.includes(keyword))
}

const isTravelContent = (url: string): boolean => {
  return ['travel', 'adventure', 'explore', 'journey', 'destination', 'trip', 'vacation', 'tourism'].some(keyword => url.includes(keyword))
}

const isGamingContent = (url: string): boolean => {
  return ['game', 'gaming', 'play', 'stream', 'esports', 'gameplay', 'review', 'walkthrough'].some(keyword => url.includes(keyword))
}

// Content generators for each category
const generateMusicContent = (videoId: string): Partial<VideoAnalysis> => {
  const musicTitles = [
    'Amazing New Song - Official Music Video',
    'Incredible Musical Performance',
    'Latest Hit Single - Music Video',
    'Beautiful Acoustic Performance',
    'Epic Music Video Release'
  ]
  
  const title = musicTitles[Math.floor(Math.random() * musicTitles.length)]
  
  return {
    videoId,
    title,
    description: 'Experience this incredible musical journey. This song captures emotions and tells a story through beautiful melodies and meaningful lyrics.',
    category: 'music',
    tags: ['music', 'song', 'audio', 'melody', 'lyrics', 'artist'],
    keyTopics: ['Musical Composition', 'Lyrical Content', 'Production Quality', 'Artistic Expression', 'Emotional Impact'],
    summary: 'A captivating musical piece that showcases artistic talent and emotional depth through melody, lyrics, and production.'
  }
}

const generateBusinessContent = (videoId: string): Partial<VideoAnalysis> => ({
  videoId,
  title: 'How to Start a Successful Business in 2024',
  description: 'Learn the essential steps to launch and grow your business. This comprehensive guide covers everything from idea validation to scaling your startup.',
  category: 'business',
  tags: ['business', 'entrepreneurship', 'startup', 'success', 'marketing'],
  keyTopics: ['Business Planning', 'Market Research', 'Funding', 'Marketing Strategy', 'Team Building'],
  summary: 'A comprehensive guide to starting and scaling a successful business, covering market research, funding strategies, and growth tactics.'
})

const generateTechContent = (videoId: string): Partial<VideoAnalysis> => ({
  videoId,
  title: 'Master Programming: Complete Development Guide',
  description: 'Complete programming tutorial covering fundamentals to advanced concepts. Build real projects and master modern development.',
  category: 'technology',
  tags: ['programming', 'coding', 'web development', 'software', 'tutorial'],
  keyTopics: ['Programming Fundamentals', 'Modern Frameworks', 'Best Practices', 'Project Building', 'Career Development'],
  summary: 'Comprehensive programming course covering modern syntax, development practices, and practical software engineering skills.'
})

const generateFitnessContent = (videoId: string): Partial<VideoAnalysis> => ({
  videoId,
  title: 'Complete Fitness Transformation Guide',
  description: 'Transform your body with proven workout routines and nutrition strategies. Learn how to build lean muscle while burning fat effectively.',
  category: 'fitness',
  tags: ['fitness', 'workout', 'nutrition', 'health', 'muscle building'],
  keyTopics: ['Strength Training', 'Cardio Optimization', 'Nutrition Planning', 'Recovery Methods', 'Progress Tracking'],
  summary: 'A comprehensive fitness program combining strength training, cardio, and nutrition strategies for optimal body composition and health.'
})

const generateEducationContent = (videoId: string): Partial<VideoAnalysis> => ({
  videoId,
  title: 'Complete Learning and Study Guide',
  description: 'Master effective learning techniques and study strategies. Discover how to learn faster, retain more information, and achieve academic success.',
  category: 'education',
  tags: ['education', 'learning', 'study', 'knowledge', 'skills'],
  keyTopics: ['Learning Techniques', 'Memory Improvement', 'Study Strategies', 'Skill Development', 'Knowledge Retention'],
  summary: 'Evidence-based learning strategies and study techniques for improved academic performance and skill acquisition.'
})

const generateTravelContent = (videoId: string): Partial<VideoAnalysis> => ({
  videoId,
  title: 'Ultimate Travel Guide and Adventure Tips',
  description: 'Discover insider secrets to amazing travel experiences. Learn how to find the best destinations, save money, and travel like a pro.',
  category: 'travel',
  tags: ['travel', 'adventure', 'explore', 'journey', 'destination'],
  keyTopics: ['Travel Planning', 'Budget Travel', 'Local Experiences', 'Safety Tips', 'Cultural Exploration'],
  summary: 'Practical travel strategies for exploring the world, including planning tips, budget advice, and cultural insights.'
})

const generateGamingContent = (videoId: string): Partial<VideoAnalysis> => ({
  videoId,
  title: 'Epic Gaming Experience and Review',
  description: 'Dive into this incredible gaming experience. Complete walkthrough, tips, tricks, and honest review of gameplay mechanics.',
  category: 'gaming',
  tags: ['gaming', 'games', 'gameplay', 'review', 'entertainment'],
  keyTopics: ['Gameplay Mechanics', 'Strategy Tips', 'Game Review', 'Entertainment Value', 'Gaming Skills'],
  summary: 'Comprehensive gaming content covering gameplay strategies, reviews, and entertainment value for gaming enthusiasts.'
})

const generateGeneralContent = (videoId: string): Partial<VideoAnalysis> => ({
  videoId,
  title: 'Interesting Content and Insights',
  description: 'Discover valuable insights and interesting perspectives on various topics. This content provides useful information and entertainment.',
  category: 'general',
  tags: ['content', 'insights', 'information', 'entertainment', 'knowledge'],
  keyTopics: ['Key Insights', 'Valuable Information', 'Practical Tips', 'Interesting Facts', 'Useful Knowledge'],
  summary: 'Engaging content that provides valuable insights and useful information on various interesting topics.'
})

// Generate realistic mock data based on URL analysis
const generateMockVideoData = (videoId: string, url: string): Partial<VideoAnalysis> => {
  const analysis = analyzeVideoContent(url, videoId)
  
  return {
    ...analysis,
    channelTitle: 'Content Creator',
    duration: '12:34',
    viewCount: Math.floor(Math.random() * 100000 + 10000).toString(),
    publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
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
  
  if (category === 'music') {
    return `# ${title}: Musical Journey and Artistic Expression

## Introduction

Music has the incredible power to move us, inspire us, and connect us to emotions we didn't even know we had. This song is a perfect example of how artistry and creativity can come together to create something truly special.

## About This Musical Piece

${summary}

## Musical Elements

${keyTopics.map((topic, index) => `### ${index + 1}. ${topic}

This aspect of the song showcases the artist's talent and attention to detail. The way these elements work together creates a cohesive and emotionally resonant experience.`).join('\n\n')}

## What Makes This Song Special

### Artistic Vision
The creative vision behind this piece is evident in every note and lyric. The artist has crafted something that speaks to listeners on multiple levels.

### Emotional Connection
Music is all about emotion, and this song delivers. Whether it's the melody, the lyrics, or the overall production, there's something here that resonates with the human experience.

### Technical Excellence
Beyond the emotional impact, the technical aspects of this song demonstrate real skill and craftsmanship in music production and performance.

## Why You Should Listen

Here's why this song deserves your attention:

1. **Unique Sound** - The artist brings something fresh and distinctive to the music scene
2. **Emotional Depth** - The song connects with listeners on a personal level
3. **Quality Production** - Professional sound quality and attention to detail
4. **Artistic Merit** - Demonstrates genuine creativity and musical talent

## Final Thoughts

Music is a universal language that transcends boundaries and brings people together. This song is a beautiful example of what happens when talent, creativity, and passion come together.

Whether you're a music lover, an aspiring artist, or just someone who appreciates good art, this piece has something to offer.

## Listen and Share

- **Experience the full song**: Listen to appreciate all the nuances and details
- **Share with others**: Great music is meant to be shared
- **Support the artist**: Show appreciation for their creative work

*What did you think of this song? Share your thoughts and let me know what resonated with you most!*`
  }
  
  // Default blog post for other categories
  return `# ${title}: Complete Guide and Key Insights

## Introduction

I recently discovered this incredible content about ${category} that completely changed my perspective. The insights shared were so valuable that I had to break them down and share the key takeaways with you.

## Content Overview

${summary}

## Key Topics Covered

${keyTopics.map((topic, index) => `### ${index + 1}. ${topic}

This section provided actionable insights that you can implement immediately. The practical approach makes it easy to understand and apply these concepts in real-world situations.`).join('\n\n')}

## Main Takeaways

Based on the content, here are the most important points to remember:

### Practical Application
The strategies discussed aren't just theoretical - they're proven methods that have been tested and refined. Each technique comes with specific steps you can follow.

### Real-World Results
What makes this content particularly valuable is the focus on measurable outcomes. You're not just learning concepts, but gaining tools that produce tangible results.

### Implementation Strategy
The content provides a clear roadmap for implementation, making it easy to get started regardless of your current level of experience.

## Action Steps

Here's how you can apply these insights:

1. **Start with the fundamentals** - Master the basics before moving to advanced techniques
2. **Focus on consistency** - Small daily actions compound into significant results
3. **Track your progress** - Measure what matters to stay motivated and adjust your approach
4. **Stay committed** - Success requires persistence and dedication to the process

## Conclusion

This content delivers exceptional value for anyone interested in ${category}. The combination of practical advice, real-world examples, and actionable strategies makes it a must-watch.

The insights shared can genuinely transform your approach to ${category} and help you achieve better results faster.

## Resources

- **Original Content**: Watch the full breakdown for detailed explanations and examples
- **Key Topics**: ${keyTopics.join(', ')}
- **Category**: ${category}

*What was your biggest takeaway? Share your thoughts and let me know how you plan to implement these strategies!*`
}

const generateLinkedInPosts = (analysis: VideoAnalysis) => {
  const { title, category, keyTopics, tags } = analysis
  
  if (category === 'music') {
    return [
      {
        content: `🎵 Just discovered an incredible song: "${title}"

The artistry and creativity in this piece are absolutely stunning! Here's what makes it special:

${keyTopics.slice(0, 4).map((topic, i) => `${i + 1}️⃣ ${topic}`).join('\n')}

Music has this amazing power to connect us emotionally and inspire creativity. This song is a perfect example of how art can move us and bring people together.

What's your favorite type of music? I'd love to hear what songs have inspired you recently!

#${tags.join(' #')}`,
        hashtags: tags
      },
      {
        content: `🎶 Amazing musical discovery today!

"${analysis.summary.split('.')[0]}."

There's something magical about discovering new music that resonates with your soul. This song captures emotions and tells a story in such a beautiful way.

Music is truly a universal language that transcends boundaries. What's the last song that gave you chills?

#${tags.slice(0, 3).join(' #')}`,
        hashtags: tags.slice(0, 3)
      }
    ]
  }
  
  // Default LinkedIn posts for other categories
  return [
    {
      content: `🎥 Just discovered incredible content: "${title}"

The insights on ${category} were absolutely game-changing! Here are the key takeaways:

${keyTopics.slice(0, 4).map((topic, i) => `${i + 1}️⃣ ${topic}`).join('\n')}

What resonated most with me was the practical approach - these aren't just theories, but proven strategies you can implement immediately.

Have you explored ${category} recently? What's been your biggest challenge or success?

#${tags.join(' #')}`,
      hashtags: tags
    },
    {
      content: `💡 Key insight from today's content on ${category}:

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
  
  if (category === 'music') {
    return [
      {
        content: `🎵 Just discovered: "${title.length > 60 ? title.substring(0, 57) + '...' : title}"

This song is absolutely incredible! 

The ${keyTopics[0].toLowerCase()} is just *chef's kiss* 🤌

#${tags.slice(0, 2).join(' #')}`,
        hashtags: tags.slice(0, 2)
      },
      {
        content: `🎶 New music discovery!

"${analysis.summary.split('.')[0]}."

When a song hits different... you know you've found something special ✨

#${tags[0]} #${category}`,
        hashtags: [tags[0], category]
      },
      {
        content: `🔥 This song though...

Amazing ${keyTopics.slice(0, 2).join(' & ').toLowerCase()}

Music that actually moves your soul 🎵

#${tags.slice(0, 3).join(' #')}`,
        hashtags: tags.slice(0, 3)
      }
    ]
  }
  
  // Default tweets for other categories
  return [
    {
      content: `🎯 Just discovered: "${title.length > 60 ? title.substring(0, 57) + '...' : title}"

Mind-blowing insights on ${category}! 

Key takeaway: ${keyTopics[0]}

#${tags.slice(0, 2).join(' #')}`,
      hashtags: tags.slice(0, 2)
    },
    {
      content: `💡 Best ${category} insight:

"${analysis.summary.split('.')[0]}."

Simple but powerful. Sometimes the most effective strategies are the most straightforward ones.

#${tags[0]} #${category}`,
      hashtags: [tags[0], category]
    },
    {
      content: `🚀 New content on ${category}!

Covers: ${keyTopics.slice(0, 2).join(' & ')}

The practical approach makes it so much easier to implement these strategies.

#${tags.slice(0, 3).join(' #')}`,
      hashtags: tags.slice(0, 3)
    }
  ]
}

const generateQuotes = (analysis: VideoAnalysis) => {
  const { category, keyTopics } = analysis
  
  if (category === 'music') {
    const musicQuotes = [
      'Music is the universal language of emotion',
      'Where words fail, music speaks',
      'Good music doesn\'t have an expiration date',
      'Music is the soundtrack to our lives',
      'Every song tells a story'
    ]
    
    return musicQuotes.map(quote => ({
      text: quote,
      category: category
    }))
  }
  
  // Default quotes for other categories
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