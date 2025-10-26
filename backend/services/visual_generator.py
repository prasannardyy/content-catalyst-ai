import os
import requests
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class VisualGenerator:
    def __init__(self):
        self.api_key = os.getenv("BANNERBEAR_API_KEY")
        self.template_id = os.getenv("BANNERBEAR_TEMPLATE_ID")
        self.base_url = "https://api.bannerbear.com/v2"
        
        if not self.api_key:
            raise ValueError("Missing Bannerbear API key")

    async def create_quote_graphic(self, quote: str, author: str = "Content Creator") -> str:
        """Create a quote graphic using Bannerbear API"""
        try:
            # Prepare the request data
            data = {
                "template": self.template_id or "default_quote_template",
                "modifications": [
                    {
                        "name": "quote_text",
                        "text": quote,
                        "color": "#2D3748",
                        "background": None
                    },
                    {
                        "name": "author_text", 
                        "text": f"- {author}",
                        "color": "#4A5568",
                        "background": None
                    }
                ],
                "webhook_url": None,
                "metadata": {
                    "quote": quote,
                    "author": author
                }
            }
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            # Make API request
            response = requests.post(
                f"{self.base_url}/images",
                json=data,
                headers=headers
            )
            
            if response.status_code == 201:
                result = response.json()
                return result.get("image_url", "")
            else:
                logger.error(f"Bannerbear API error: {response.status_code} - {response.text}")
                # Return fallback image URL
                return await self._create_fallback_image(quote, author)
                
        except Exception as e:
            logger.error(f"Quote graphic creation failed: {str(e)}")
            return await self._create_fallback_image(quote, author)

    async def _create_fallback_image(self, quote: str, author: str) -> str:
        """Create a fallback image using a simple service or return placeholder"""
        try:
            # Use a simple image generation service as fallback
            # For now, return a placeholder URL
            import urllib.parse
            
            encoded_quote = urllib.parse.quote(quote[:100])  # Limit length
            encoded_author = urllib.parse.quote(author)
            
            # Using a placeholder service (in production, you'd use a proper fallback)
            fallback_url = f"https://via.placeholder.com/1080x1080/3B82F6/FFFFFF?text={encoded_quote}"
            
            return fallback_url
            
        except Exception as e:
            logger.error(f"Fallback image creation failed: {str(e)}")
            return "https://via.placeholder.com/1080x1080/3B82F6/FFFFFF?text=Quote+Graphic"

    async def create_custom_graphic(
        self, 
        template_id: str, 
        modifications: Dict[str, Any]
    ) -> str:
        """Create a custom graphic with specific template and modifications"""
        try:
            data = {
                "template": template_id,
                "modifications": modifications
            }
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(
                f"{self.base_url}/images",
                json=data,
                headers=headers
            )
            
            if response.status_code == 201:
                result = response.json()
                return result.get("image_url", "")
            else:
                logger.error(f"Custom graphic creation failed: {response.status_code}")
                return ""
                
        except Exception as e:
            logger.error(f"Custom graphic creation failed: {str(e)}")
            return ""

    async def get_templates(self) -> list:
        """Get available templates from Bannerbear"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}"
            }
            
            response = requests.get(
                f"{self.base_url}/templates",
                headers=headers
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Failed to fetch templates: {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"Template fetching failed: {str(e)}")
            return []

    async def create_social_media_set(
        self, 
        quotes: list, 
        author: str = "Content Creator"
    ) -> Dict[str, list]:
        """Create a complete set of social media graphics"""
        try:
            results = {
                "square": [],  # 1080x1080 for Instagram/Facebook
                "story": [],   # 1080x1920 for Instagram Stories
                "twitter": []  # 1200x675 for Twitter
            }
            
            for quote in quotes:
                # Create square format
                square_url = await self.create_quote_graphic(quote, author)
                if square_url:
                    results["square"].append({
                        "url": square_url,
                        "quote": quote,
                        "format": "square",
                        "dimensions": "1080x1080"
                    })
                
                # For now, we'll use the same image for all formats
                # In production, you'd create format-specific templates
                results["story"].append({
                    "url": square_url,
                    "quote": quote,
                    "format": "story",
                    "dimensions": "1080x1920"
                })
                
                results["twitter"].append({
                    "url": square_url,
                    "quote": quote,
                    "format": "twitter",
                    "dimensions": "1200x675"
                })
            
            return results
            
        except Exception as e:
            logger.error(f"Social media set creation failed: {str(e)}")
            return {"square": [], "story": [], "twitter": []}