// Image Generation Service using free APIs

export interface QuoteImage {
  url: string
  quote: string
  background: string
  textColor: string
}

// Generate quote images using free placeholder services
export const generateQuoteImages = async (quotes: Array<{text: string, category: string}>, videoId: string): Promise<QuoteImage[]> => {
  const colors = [
    { bg: '3b82f6', text: 'ffffff', name: 'blue' },
    { bg: '10b981', text: 'ffffff', name: 'green' },
    { bg: 'f59e0b', text: 'ffffff', name: 'yellow' },
    { bg: 'ef4444', text: 'ffffff', name: 'red' },
    { bg: '8b5cf6', text: 'ffffff', name: 'purple' }
  ]

  return quotes.map((quote, index) => {
    const color = colors[index % colors.length]
    const encodedText = encodeURIComponent(quote.text)
    
    // Using different image generation services for variety
    const services = [
      `https://via.placeholder.com/1080x1080/${color.bg}/${color.text}?text=${encodedText}`,
      `https://dummyimage.com/1080x1080/${color.bg}/${color.text}&text=${encodedText}`,
      `https://picsum.photos/1080/1080?random=${index}&blur=2&overlay=${color.bg}&text=${encodedText}`
    ]

    return {
      url: services[index % services.length],
      quote: quote.text,
      background: `#${color.bg}`,
      textColor: `#${color.text}`
    }
  })
}

// Generate thumbnail-style images
export const generateThumbnailImages = async (title: string, category: string, videoId: string): Promise<QuoteImage[]> => {
  const thumbnailTexts = [
    `${title.split(':')[0]}`,
    `New ${category} Video`,
    `${category} Tips & Tricks`,
    'Watch Now!'
  ]

  const colors = [
    { bg: '1f2937', text: 'ffffff' }, // Dark gray
    { bg: '7c3aed', text: 'ffffff' }, // Purple
    { bg: 'dc2626', text: 'ffffff' }, // Red
    { bg: '059669', text: 'ffffff' }  // Green
  ]

  return thumbnailTexts.map((text, index) => {
    const color = colors[index % colors.length]
    const encodedText = encodeURIComponent(text)
    
    return {
      url: `https://via.placeholder.com/1280x720/${color.bg}/${color.text}?text=${encodedText}`,
      quote: text,
      background: `#${color.bg}`,
      textColor: `#${color.text}`
    }
  })
}

// Alternative: Use Unsplash for background images with text overlay
export const generateUnsplashImages = async (category: string, quotes: string[]): Promise<QuoteImage[]> => {
  const categoryKeywords = {
    business: 'office,success,growth',
    technology: 'computer,code,tech',
    fitness: 'gym,workout,health',
    finance: 'money,investment,wealth',
    productivity: 'workspace,planning,focus',
    travel: 'adventure,explore,journey',
    food: 'cooking,kitchen,meal',
    lifestyle: 'life,happiness,motivation'
  }

  const keyword = categoryKeywords[category as keyof typeof categoryKeywords] || 'inspiration'

  return quotes.map((quote, index) => ({
    url: `https://source.unsplash.com/1080x1080/?${keyword}&sig=${index}`,
    quote,
    background: '#000000',
    textColor: '#ffffff'
  }))
}