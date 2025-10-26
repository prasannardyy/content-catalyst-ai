// AI Content Generation Service using free APIs
import { VideoAnalysis } from './youtube-analyzer'

export interface GeneratedContent {
  blogPost: string
  linkedinPosts: Array<{ content: string; hashtags: string[] }>
  tweets: Array<{ content: string; hashtags: string[] }>
  quotes: Array<{ text: string; category: string }>
}

// Main content generation function
export const generateAIContent = async (analysis: VideoAnalysis): Promise<GeneratedContent> => {
  try {
    // Try to enhance content with AI APIs
    const enhancedContent = await generateWithAI(analysis)
    if (enhancedContent) {
      return enhancedContent
    }
  } catch (error) {
    console.error('AI content generation failed, using fallback:', error)
  }
  
  // Fallback to rule-based generation
  return generateRuleBasedContent(analysis)
}

// Try to use free AI APIs for content generation
const generateWithAI = async (analysis: VideoAnalysis): Promise<GeneratedContent | null> => {
  try {
    // Method 1: Try Hugging Face Inference API (free tier available)
    const huggingFaceContent = await generateWithHuggingFace(analysis)
    if (huggingFaceContent) {
      return huggingFaceContent
    }

    // Method 2: Try OpenAI-compatible free APIs
    const freeAIContent = await generateWithFreeAI(analysis)
    if (freeAIContent) {
      return freeAIContent
    }

    return null
  } catch (error) {
    console.error('AI generation methods failed:', error)
    return null
  }
}

// Use Hugging Face Inference API (free tier)
const generateWithHuggingFace = async (analysis: VideoAnalysis): Promise<GeneratedContent | null> => {
  try {
    // This would require a Hugging Face API key, but has a generous free tier
    // For demo purposes, we'll skip this and use rule-based generation
    // In production, you could use:
    // const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
    //   headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
    //   method: 'POST',
    //   body: JSON.stringify({ inputs: prompt })
    // })
    
    return null
  } catch (error) {
    console.error('Hugging Face API failed:', error)
    return null
  }
}

// Use free AI APIs (like Together AI, Groq, etc.)
const generateWithFreeAI = async (analysis: VideoAnalysis): Promise<GeneratedContent | null> => {
  try {
    // This would integrate with free AI APIs
    // For demo purposes, we'll use enhanced rule-based generation
    return null
  } catch (error) {
    console.error('Free AI APIs failed:', error)
    return null
  }
}

// Enhanced rule-based content generation
const generateRuleBasedContent = (analysis: VideoAnalysis): GeneratedContent => {
  const { title, description, category, tags, keyTopics, summary, channelTitle } = analysis

  return {
    blogPost: generateEnhancedBlogPost(analysis),
    linkedinPosts: generateEnhancedLinkedInPosts(analysis),
    tweets: generateEnhancedTweets(analysis),
    quotes: generateEnhancedQuotes(analysis)
  }
}

// Enhanced blog post generation with better structure
const generateEnhancedBlogPost = (analysis: VideoAnalysis): string => {
  const { title, summary, keyTopics, category, tags, channelTitle } = analysis
  
  const seoTags = tags.map(tag => `#${tag}`).join(' ')
  const readingTime = Math.ceil(summary.length / 200) + 3 // Estimate reading time
  
  const categoryEmoji = getCategoryEmoji(category)
  const categorySpecificContent = getCategorySpecificBlogContent(analysis)
  
  return `# ${categoryEmoji} ${title} - Complete Analysis and Guide

*${readingTime} min read | By ${channelTitle || 'Content Creator'} | Category: ${category}*

## Introduction

${categorySpecificContent.introduction}

## Overview

${summary}

This content stands out for its practical approach and valuable insights. Whether you're a beginner or have experience in ${category}, there are actionable takeaways that can make a real difference.

## Key Areas Covered

${keyTopics.map((topic, index) => `### ${index + 1}. ${topic}

${generateTopicAnalysis(topic, category, title)}

**Key Takeaway**: ${generateKeyTakeaway(topic, category)}

**Action Item**: ${generateActionItem(topic, category)}`).join('\n\n')}

## Why This Content Matters

${categorySpecificContent.whyItMatters}

### Practical Value
The insights shared aren't just theoretical concepts - they're proven strategies that have been tested in real-world scenarios. Each technique comes with specific implementation steps.

### Expert Insights
${channelTitle || 'The creator'} brings valuable expertise to the topic, making complex concepts accessible and actionable for viewers at all levels.

### Immediate Application
What makes this content particularly valuable is its focus on immediate applicability. You can start implementing these strategies right away.

## Implementation Strategy

### Phase 1: Foundation (Week 1-2)
Start by understanding and implementing the core concepts discussed. Focus on ${keyTopics[0]?.toLowerCase() || 'the fundamentals'} as your foundation.

### Phase 2: Skill Building (Week 3-4)
Develop the specific skills highlighted in the content. Practice consistently and track your progress.

### Phase 3: Advanced Application (Week 5+)
Once you've mastered the basics, explore the more advanced strategies and techniques presented.

## Key Insights Summary

${generateInsightsSummary(keyTopics, category)}

## Conclusion

"${title}" delivers exceptional value for anyone interested in ${category}. The combination of practical advice, expert insights, and actionable strategies makes this content essential viewing.

${categorySpecificContent.conclusion}

## Resources and Next Steps

- **Original Content**: [Watch the full video](https://youtube.com/watch?v=${analysis.videoId})
- **Creator**: ${channelTitle || 'Content Creator'}
- **Category**: ${category}
- **Key Topics**: ${keyTopics.join(', ')}

## Tags

${seoTags}

---

*What was your biggest takeaway from this content? Share your thoughts and let me know how you plan to implement these strategies!*

*Found this analysis helpful? Share it with others who might benefit from these insights.*`
}

// Enhanced LinkedIn posts with better engagement
const generateEnhancedLinkedInPosts = (analysis: VideoAnalysis): Array<{ content: string; hashtags: string[] }> => {
  const { title, category, keyTopics, tags, channelTitle, summary } = analysis
  const relevantHashtags = generateRelevantHashtags(tags, category)
  const categoryEmoji = getCategoryEmoji(category)
  
  return [
    {
      content: `${categoryEmoji} Just discovered exceptional content: "${title}"

Created by ${channelTitle || 'this talented creator'}, this content delivers incredible value for anyone interested in ${category}.

🎯 Key highlights:
${keyTopics.slice(0, 4).map((topic, i) => `${i + 1}️⃣ ${topic}`).join('\n')}

What impressed me most was the practical approach - these aren't just theoretical concepts, but proven strategies you can implement immediately.

The quality of explanation and real-world examples make this content stand out in the ${category} space.

💡 My biggest takeaway: ${generateKeyInsight(keyTopics[0], category)}

Have you explored ${category} recently? What's been your biggest challenge or success story?

${relevantHashtags.slice(0, 8).map(tag => `#${tag}`).join(' ')}`,
      hashtags: relevantHashtags.slice(0, 8)
    },
    {
      content: `🔥 Game-changing insight from "${title}":

"${generateQuoteFromContent(summary, category)}"

This completely shifted my perspective on ${category}. ${channelTitle || 'The creator'} breaks down complex concepts into digestible, actionable steps.

The practical examples and step-by-step guidance make it so much easier to understand and implement these strategies.

I particularly appreciated the focus on ${keyTopics[0]?.toLowerCase() || 'practical application'} - it's exactly what professionals in this field need to know.

What's your experience with ${category}? I'd love to hear your thoughts and any additional insights you've discovered!

${relevantHashtags.slice(0, 6).map(tag => `#${tag}`).join(' ')}`,
      hashtags: relevantHashtags.slice(0, 6)
    },
    {
      content: `📚 Content recommendation: "${title}"

If you're interested in ${category}, this is a must-watch. ${channelTitle || 'The creator'} covers:

${keyTopics.slice(0, 3).map((topic, i) => `✅ ${topic}`).join('\n')}

The depth of knowledge and practical approach make this content incredibly valuable. It's the kind of resource that you'll want to bookmark and return to.

Perfect for both beginners looking to get started and experienced professionals wanting to refine their approach.

What ${category} content has made the biggest impact on your professional development?

${relevantHashtags.slice(0, 7).map(tag => `#${tag}`).join(' ')}`,
      hashtags: relevantHashtags.slice(0, 7)
    }
  ]
}

// Enhanced tweets with better engagement
const generateEnhancedTweets = (analysis: VideoAnalysis): Array<{ content: string; hashtags: string[] }> => {
  const { title, category, keyTopics, tags, channelTitle, summary } = analysis
  const relevantHashtags = generateRelevantHashtags(tags, category)
  const categoryEmoji = getCategoryEmoji(category)
  
  return [
    {
      content: `${categoryEmoji} Just watched: "${title.length > 70 ? title.substring(0, 67) + '...' : title}"

Mind-blowing insights on ${category}! 

Key takeaway: ${keyTopics[0] || 'Exceptional content'}

By ${channelTitle || 'talented creator'}

#${relevantHashtags.slice(0, 3).join(' #')}`,
      hashtags: relevantHashtags.slice(0, 3)
    },
    {
      content: `🔥 Best ${category} insight today:

"${generateQuoteFromContent(summary, category)}"

Simple but powerful. Sometimes the most effective strategies are the most elegant ones.

#${relevantHashtags.slice(0, 2).join(' #')}`,
      hashtags: relevantHashtags.slice(0, 2)
    },
    {
      content: `⚡ New ${category} content worth watching!

Covers: ${keyTopics.slice(0, 2).join(' & ')}

The practical approach makes complex concepts actually implementable.

Thread with key insights 👇

#${relevantHashtags.slice(0, 4).join(' #')}`,
      hashtags: relevantHashtags.slice(0, 4)
    },
    {
      content: `💡 Quick ${category} tip from today's learning:

${generateQuickTip(keyTopics[0], category)}

Sometimes the simplest insights have the biggest impact.

#${relevantHashtags.slice(0, 3).join(' #')}`,
      hashtags: relevantHashtags.slice(0, 3)
    }
  ]
}

// Enhanced quotes generation
const generateEnhancedQuotes = (analysis: VideoAnalysis): Array<{ text: string; category: string }> => {
  const { category, keyTopics, title, channelTitle } = analysis
  
  const categoryQuotes = getCategorySpecificQuotes(category, keyTopics, title, channelTitle)
  const generalQuotes = [
    `Excellence in ${category} comes from consistent daily practice`,
    `The best ${category} strategies are simple but not easy`,
    `Knowledge without action is just entertainment`,
    `Success in ${category} is built one small win at a time`,
    `The difference between good and great is attention to detail`
  ]
  
  return [...categoryQuotes, ...generalQuotes].map(quote => ({
    text: quote,
    category: category
  }))
}

// Helper functions
const getCategoryEmoji = (category: string): string => {
  const emojiMap: { [key: string]: string } = {
    music: '🎵',
    technology: '💻',
    business: '💼',
    fitness: '💪',
    education: '📚',
    travel: '✈️',
    gaming: '🎮',
    cooking: '👨‍🍳',
    general: '🎯'
  }
  return emojiMap[category] || '🎯'
}

const generateRelevantHashtags = (tags: string[], category: string): string[] => {
  const baseHashtags = [...tags, category]
  const additionalHashtags: string[] = []
  
  // Add category-specific hashtags
  switch (category) {
    case 'music':
      additionalHashtags.push('musiclover', 'newmusic', 'artist', 'songwriter', 'musicreview', 'playlist')
      break
    case 'technology':
      additionalHashtags.push('tech', 'coding', 'developer', 'programming', 'innovation', 'techreview', 'software')
      break
    case 'business':
      additionalHashtags.push('entrepreneur', 'startup', 'businesstips', 'success', 'leadership', 'growth')
      break
    case 'fitness':
      additionalHashtags.push('health', 'wellness', 'workout', 'fitnessmotivation', 'healthylifestyle', 'training')
      break
    case 'education':
      additionalHashtags.push('learning', 'education', 'knowledge', 'skills', 'growth', 'development')
      break
    default:
      additionalHashtags.push('content', 'insights', 'tips', 'guide', 'helpful', 'learning')
  }
  
  const uniqueHashtags = Array.from(new Set([...baseHashtags, ...additionalHashtags]))
  return uniqueHashtags.filter(tag => tag && tag.length > 0)
}

const getCategorySpecificBlogContent = (analysis: VideoAnalysis) => {
  const { category, title, channelTitle } = analysis
  
  switch (category) {
    case 'music':
      return {
        introduction: `Music has the power to move us, inspire us, and connect us across all boundaries. "${title}" by ${channelTitle || 'this artist'} is a perfect example of how artistry and creativity come together to create something truly special.`,
        whyItMatters: `In today's music landscape, finding authentic, well-crafted content is more important than ever. This piece stands out for its artistic integrity and emotional resonance.`,
        conclusion: `This musical piece represents the kind of artistry that reminds us why music remains such a powerful form of human expression.`
      }
    case 'technology':
      return {
        introduction: `In the rapidly evolving world of technology, staying current with best practices and innovative approaches is crucial for success. "${title}" provides valuable insights that every tech professional should consider.`,
        whyItMatters: `The tech industry moves fast, and the strategies discussed here can help you stay ahead of the curve while building more effective, maintainable solutions.`,
        conclusion: `These technical insights can significantly impact your development approach and career trajectory in the technology field.`
      }
    case 'business':
      return {
        introduction: `Success in business requires a combination of strategic thinking, practical execution, and continuous learning. "${title}" offers valuable insights that can transform your approach to business challenges.`,
        whyItMatters: `In today's competitive business environment, the strategies and principles discussed can provide a significant competitive advantage.`,
        conclusion: `These business insights represent proven strategies that can accelerate your success and help you build more effective, sustainable business practices.`
      }
    default:
      return {
        introduction: `"${title}" delivers valuable insights and practical guidance that can make a real difference in your ${category} journey. The content combines expert knowledge with actionable strategies.`,
        whyItMatters: `The practical approach and real-world applications make this content particularly valuable for anyone serious about improving their ${category} skills and knowledge.`,
        conclusion: `The insights shared represent proven strategies that can enhance your approach to ${category} and help you achieve better results.`
      }
  }
}

const generateTopicAnalysis = (topic: string, category: string, title: string): string => {
  return `This section of "${title}" provides comprehensive coverage of ${topic.toLowerCase()}. The practical approach and real-world examples make complex concepts accessible and immediately actionable. The insights shared are based on proven methods and genuine expertise in ${category}.`
}

const generateKeyTakeaway = (topic: string, category: string): string => {
  return `Understanding ${topic.toLowerCase()} is crucial for success in ${category}. The practical strategies discussed provide a clear path forward.`
}

const generateActionItem = (topic: string, category: string): string => {
  return `Implement the ${topic.toLowerCase()} strategies discussed, starting with the foundational concepts and building up to more advanced applications.`
}

const generateInsightsSummary = (keyTopics: string[], category: string): string => {
  return keyTopics.map((topic, index) => 
    `${index + 1}. **${topic}**: Essential for ${category} success, providing practical strategies for immediate implementation.`
  ).join('\n')
}

const generateKeyInsight = (topic: string, category: string): string => {
  return `${topic} is fundamental to achieving excellence in ${category}. The practical approach makes it accessible to implement immediately.`
}

const generateQuoteFromContent = (summary: string, category: string): string => {
  const sentences = summary.split('.').filter(s => s.trim().length > 20)
  if (sentences.length > 0) {
    return sentences[0].trim() + '.'
  }
  return `Excellence in ${category} comes from consistent application of proven principles.`
}

const generateQuickTip = (topic: string, category: string): string => {
  return `Focus on mastering ${topic?.toLowerCase() || 'the fundamentals'} before moving to advanced ${category} techniques. Solid foundations lead to better results.`
}

const getCategorySpecificQuotes = (category: string, keyTopics: string[], title: string, channelTitle?: string): string[] => {
  switch (category) {
    case 'music':
      return [
        'Music is the universal language of emotion',
        'Where words fail, music speaks',
        'Great music connects hearts across all boundaries',
        `"${title}" - ${channelTitle || 'Artist'}`,
        'Every song tells a story worth hearing'
      ]
    case 'technology':
      return [
        'Code is poetry written in logic',
        'The best solutions are elegant and simple',
        'Technology is best when it serves humanity',
        'Innovation happens at the intersection of creativity and logic',
        'Great developers solve problems, not just write code'
      ]
    case 'business':
      return [
        'Success is where preparation meets opportunity',
        'Great businesses solve real problems',
        'Execution is everything in business',
        'Customer success is business success',
        'Innovation is the currency of the future'
      ]
    default:
      return [
        `Excellence in ${category} comes from consistent practice`,
        `The best ${category} strategies are simple but not easy`,
        `Success in ${category} is built one step at a time`,
        `Quality over quantity always wins in ${category}`
      ]
  }
}

export default generateAIContent