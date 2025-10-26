"""
Gemini-based image generation service for quote graphics
"""
import os
import requests
import base64
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class GeminiImageGenerator:
    """Generate images using Google Gemini API"""
    
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"
        
        if not self.api_key:
            logger.warning("GEMINI_API_KEY not found, using fallback image generation")

    async def create_quote_graphic(self, quote: str, video_title: str = "Content Creator") -> str:
        """Create a quote graphic using Gemini API"""
        try:
            if not self.api_key:
                return await self._create_fallback_image(quote, video_title)
            
            # Create a prompt for image generation
            prompt = self._create_image_prompt(quote, video_title)
            
            # Call Gemini API for image generation
            image_url = await self._generate_with_gemini(prompt, quote)
            
            return image_url
            
        except Exception as e:
            logger.error(f"Gemini image generation failed: {str(e)}")
            return await self._create_fallback_image(quote, video_title)

    def _create_image_prompt(self, quote: str, video_title: str) -> str:
        """Create a detailed prompt for image generation"""
        
        # Truncate quote if too long
        display_quote = quote[:100] + '...' if len(quote) > 100 else quote
        
        prompt = f"""Create a professional, visually appealing quote graphic with the following specifications:

QUOTE TEXT: "{display_quote}"
SOURCE: {video_title[:50]}

DESIGN REQUIREMENTS:
- Modern, clean design with professional typography
- Gradient background (blue to purple or similar professional colors)
- Quote text should be prominent and readable
- Include quotation marks
- Attribution to the source at the bottom
- Square format (1080x1080px)
- High contrast for social media visibility
- Inspirational and motivational aesthetic
- Sans-serif font family
- Proper text hierarchy

STYLE: Professional social media quote graphic, Instagram-ready, modern typography, clean layout, inspirational design"""

        return prompt

    async def _generate_with_gemini(self, prompt: str, quote: str) -> str:
        """Generate image using Gemini API"""
        try:
            # Note: As of now, Gemini primarily focuses on text generation
            # For actual image generation, you might need to use:
            # 1. Gemini + DALL-E integration
            # 2. Google's Imagen API (if available)
            # 3. Other image generation services
            
            # For now, let's create a text-based request to Gemini to get design suggestions
            # and then create an SVG based on those suggestions
            
            design_response = await self._get_design_suggestions(prompt)
            
            # Create SVG based on Gemini's design suggestions
            svg_image = await self._create_svg_from_suggestions(quote, design_response)
            
            return svg_image
            
        except Exception as e:
            logger.error(f"Gemini API call failed: {str(e)}")
            return await self._create_fallback_image(quote, "Content")

    async def _get_design_suggestions(self, prompt: str) -> Dict[str, Any]:
        """Get design suggestions from Gemini"""
        try:
            headers = {
                "Content-Type": "application/json",
            }
            
            data = {
                "contents": [{
                    "parts": [{
                        "text": f"""Based on this image design request, provide specific design recommendations in JSON format:

{prompt}

Please respond with a JSON object containing:
- background_color: hex color for background
- text_color: hex color for main text
- accent_color: hex color for accents
- font_size: recommended font size
- layout_style: description of layout approach

Respond only with valid JSON."""
                    }]
                }]
            }
            
            url = f"{self.base_url}/models/gemini-pro:generateContent?key={self.api_key}"
            
            response = requests.post(url, json=data, headers=headers, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Extract the generated text
                if 'candidates' in result and len(result['candidates']) > 0:
                    generated_text = result['candidates'][0]['content']['parts'][0]['text']
                    
                    # Try to parse as JSON
                    try:
                        import json
                        design_suggestions = json.loads(generated_text)
                        return design_suggestions
                    except json.JSONDecodeError:
                        # If not valid JSON, use defaults
                        return self._get_default_design()
                else:
                    return self._get_default_design()
            else:
                logger.error(f"Gemini API error: {response.status_code} - {response.text}")
                return self._get_default_design()
                
        except Exception as e:
            logger.error(f"Design suggestions failed: {str(e)}")
            return self._get_default_design()

    def _get_default_design(self) -> Dict[str, Any]:
        """Get default design configuration"""
        return {
            "background_color": "#3B82F6",
            "text_color": "#FFFFFF",
            "accent_color": "#1E40AF",
            "font_size": "36",
            "layout_style": "centered with gradient background"
        }

    async def _create_svg_from_suggestions(self, quote: str, design: Dict[str, Any]) -> str:
        """Create SVG image based on design suggestions"""
        
        # Truncate quote for display
        display_quote = quote[:120] + '...' if len(quote) > 120 else quote
        
        # Split quote into lines for better display
        words = display_quote.split()
        lines = []
        current_line = []
        
        for word in words:
            current_line.append(word)
            if len(' '.join(current_line)) > 40:  # Approximate line length
                lines.append(' '.join(current_line[:-1]))
                current_line = [word]
        
        if current_line:
            lines.append(' '.join(current_line))
        
        # Ensure we have at most 3 lines
        if len(lines) > 3:
            lines = lines[:2] + [lines[2] + '...']
        
        # Get design colors
        bg_color = design.get('background_color', '#3B82F6')
        text_color = design.get('text_color', '#FFFFFF')
        accent_color = design.get('accent_color', '#1E40AF')
        
        # Create SVG
        svg_content = f'''<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{bg_color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:{accent_color};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="1080" height="1080" fill="url(#bg)"/>
  
  <!-- Decorative elements -->
  <circle cx="100" cy="100" r="50" fill="{text_color}" opacity="0.1"/>
  <circle cx="980" cy="980" r="80" fill="{text_color}" opacity="0.1"/>
  
  <!-- Opening quote -->
  <text x="540" y="300" fill="{text_color}" font-size="72" font-family="Arial, sans-serif" text-anchor="middle" font-weight="bold" opacity="0.8">
    "
  </text>
  
  <!-- Quote text -->'''
        
        # Add quote lines
        y_start = 400
        line_height = 60
        
        for i, line in enumerate(lines):
            y_pos = y_start + (i * line_height)
            svg_content += f'''
  <text x="540" y="{y_pos}" fill="{text_color}" font-size="42" font-family="Arial, sans-serif" text-anchor="middle" font-weight="500" filter="url(#shadow)">
    {line}
  </text>'''
        
        # Closing quote and attribution
        svg_content += f'''
  
  <!-- Closing quote -->
  <text x="540" y="{y_start + len(lines) * line_height + 50}" fill="{text_color}" font-size="72" font-family="Arial, sans-serif" text-anchor="middle" font-weight="bold" opacity="0.8">
    "
  </text>
  
  <!-- Attribution line -->
  <line x1="340" y1="{y_start + len(lines) * line_height + 120}" x2="740" y2="{y_start + len(lines) * line_height + 120}" stroke="{text_color}" stroke-width="2" opacity="0.6"/>
  
  <!-- Source attribution -->
  <text x="540" y="{y_start + len(lines) * line_height + 160}" fill="{text_color}" font-size="28" font-family="Arial, sans-serif" text-anchor="middle" opacity="0.9">
    Content Catalyst AI
  </text>
  
  <!-- Branding -->
  <text x="540" y="1040" fill="{text_color}" font-size="18" font-family="Arial, sans-serif" text-anchor="middle" opacity="0.6">
    Generated with AI
  </text>
</svg>'''
        
        # Convert to data URL
        svg_b64 = base64.b64encode(svg_content.encode('utf-8')).decode('utf-8')
        return f"data:image/svg+xml;base64,{svg_b64}"

    async def _create_fallback_image(self, quote: str, source: str) -> str:
        """Create fallback image when Gemini is not available"""
        
        display_quote = quote[:100] + '...' if len(quote) > 100 else quote
        display_source = source[:40] + '...' if len(source) > 40 else source
        
        # Split quote into lines
        words = display_quote.split()
        lines = []
        current_line = []
        
        for word in words:
            current_line.append(word)
            if len(' '.join(current_line)) > 35:
                lines.append(' '.join(current_line[:-1]))
                current_line = [word]
        
        if current_line:
            lines.append(' '.join(current_line))
        
        # Create a beautiful gradient SVG
        svg_content = f'''<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <rect width="1080" height="1080" fill="url(#bg)"/>
  
  <!-- Decorative circles -->
  <circle cx="150" cy="150" r="60" fill="white" opacity="0.1"/>
  <circle cx="930" cy="930" r="90" fill="white" opacity="0.1"/>
  <circle cx="200" cy="880" r="40" fill="white" opacity="0.15"/>
  
  <text x="540" y="350" fill="white" font-size="64" font-family="Arial, sans-serif" text-anchor="middle" font-weight="bold" opacity="0.9">
    "
  </text>'''
        
        # Add quote lines
        y_start = 450
        for i, line in enumerate(lines[:3]):
            y_pos = y_start + (i * 55)
            svg_content += f'''
  <text x="540" y="{y_pos}" fill="white" font-size="38" font-family="Arial, sans-serif" text-anchor="middle" font-weight="400" filter="url(#glow)">
    {line}
  </text>'''
        
        svg_content += f'''
  
  <text x="540" y="{y_start + len(lines[:3]) * 55 + 50}" fill="white" font-size="64" font-family="Arial, sans-serif" text-anchor="middle" font-weight="bold" opacity="0.9">
    "
  </text>
  
  <line x1="300" y1="{y_start + len(lines[:3]) * 55 + 120}" x2="780" y2="{y_start + len(lines[:3]) * 55 + 120}" stroke="white" stroke-width="3" opacity="0.7"/>
  
  <text x="540" y="{y_start + len(lines[:3]) * 55 + 170}" fill="white" font-size="24" font-family="Arial, sans-serif" text-anchor="middle" opacity="0.8">
    {display_source}
  </text>
  
  <text x="540" y="1020" fill="white" font-size="16" font-family="Arial, sans-serif" text-anchor="middle" opacity="0.5">
    Content Catalyst AI • Powered by Gemini
  </text>
</svg>'''
        
        svg_b64 = base64.b64encode(svg_content.encode('utf-8')).decode('utf-8')
        return f"data:image/svg+xml;base64,{svg_b64}"