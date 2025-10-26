"""
Demo mode for Content Catalyst AI - works without external API dependencies
"""
import asyncio
import random
from typing import Dict, List, Any
from models.schemas import AssetType
from services.database import DatabaseService

class DemoAIPipeline:
    """Demo version of AI pipeline that generates mock content"""
    
    def __init__(self):
        self.db_service = None  # Will be set later

    async def process_video(self, project_id: str, video_url: str):
        """Demo AI processing pipeline with mock data"""
        try:
            print(f"🎬 Starting demo processing for project {project_id}")
            
            # Simulate processing time
            await asyncio.sleep(2)
            
            # Update project with mock video metadata
            await self.db_service.update_project_status(
                project_id,
                "processing",
                title="Demo Video: How to Build Amazing Apps",
                description="A comprehensive guide to building modern web applications",
                duration=1800,  # 30 minutes
                thumbnail_url="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHZpZXdCb3g9IjAgMCAxMjgwIDcyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNzIwIiBmaWxsPSIjM0I4MkY2Ii8+Cjx0ZXh0IHg9IjY0MCIgeT0iMzYwIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0OCIgZm9udC1mYW1pbHk9IkFyaWFsIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RGVtbyBWaWRlbzwvdGV4dD4KPHN2Zz4="
            )
            
            # Generate mock content
            await self._generate_demo_content(project_id)
            
            # Update project status to completed
            await self.db_service.update_project_status(project_id, "completed")
            
            print(f"✅ Demo processing completed for project {project_id}")
            
        except Exception as e:
            print(f"❌ Demo processing failed for project {project_id}: {str(e)}")
            await self.db_service.update_project_status(project_id, "failed")

    async def _generate_demo_content(self, project_id: str):
        """Generate demo content assets"""
        
        # Demo blog post
        blog_content = """# How to Build Amazing Apps: A Complete Guide

## Introduction

Building amazing applications requires a combination of technical skills, creative thinking, and user-focused design. In this comprehensive guide, we'll explore the key principles and practices that separate good apps from truly exceptional ones.

## Key Principles

### 1. User-Centered Design
Always start with your users in mind. Understanding their needs, pain points, and goals is crucial for creating applications that truly serve their purpose.

### 2. Performance Optimization
Fast, responsive applications create better user experiences. Focus on optimizing load times, smooth animations, and efficient data handling.

### 3. Scalable Architecture
Design your application architecture to grow with your user base. Consider microservices, proper database design, and cloud-native solutions.

## Best Practices

- Write clean, maintainable code
- Implement comprehensive testing
- Use version control effectively
- Document your APIs and processes
- Monitor and analyze user behavior

## Conclusion

Building amazing apps is both an art and a science. By following these principles and continuously learning from user feedback, you can create applications that not only function well but truly delight your users.
"""
        
        await self.db_service.create_asset(
            project_id=project_id,
            asset_type=AssetType.BLOG,
            content=blog_content,
            metadata={"word_count": len(blog_content.split())}
        )
        
        # Demo LinkedIn posts
        linkedin_posts = [
            """💡 Just learned something fascinating about app development!

The secret to building amazing apps isn't just about the code - it's about understanding your users deeply.

Here's what I've discovered:
✅ User research beats assumptions every time
✅ Simple solutions often work better than complex ones
✅ Performance matters more than fancy features

What's your biggest lesson from building apps? Share below! 👇

#AppDevelopment #UserExperience #TechTips #SoftwareDevelopment""",
            
            """🚀 Three game-changing principles for app development:

1️⃣ Performance First: Users abandon slow apps in seconds
2️⃣ Scalable Architecture: Build for growth from day one  
3️⃣ Continuous Testing: Catch issues before users do

Which principle resonates most with your experience?

#TechLeadership #SoftwareEngineering #AppDevelopment #BestPractices""",
            
            """🎯 Hot take: The best apps solve real problems, not imaginary ones.

Before writing a single line of code, ask yourself:
• What specific problem am I solving?
• Who exactly needs this solution?
• How will I measure success?

Skip the fancy features. Focus on the core value.

Agree or disagree? Let's discuss! 💭

#ProductDevelopment #StartupLife #TechStrategy"""
        ]
        
        for i, post in enumerate(linkedin_posts):
            await self.db_service.create_asset(
                project_id=project_id,
                asset_type=AssetType.LINKEDIN_POST,
                content=post,
                metadata={"post_number": i + 1, "character_count": len(post)}
            )
        
        # Demo tweets
        tweets = [
            """💡 The best apps solve real problems, not imaginary ones.

Focus on core value over fancy features.

#AppDev #ProductTips""",
            
            """🚀 Three pillars of amazing apps:
1. User-centered design
2. Performance optimization  
3. Scalable architecture

Which one do you prioritize first?

#TechTips #SoftwareDevelopment""",
            
            """🎯 Pro tip: User research beats assumptions every single time.

Talk to your users. Listen to their feedback. Build what they actually need.

#UX #ProductDevelopment #UserResearch"""
        ]
        
        for i, tweet in enumerate(tweets):
            await self.db_service.create_asset(
                project_id=project_id,
                asset_type=AssetType.TWEET,
                content=tweet,
                metadata={"tweet_number": i + 1, "character_count": len(tweet)}
            )
        
        # Demo quote graphics (mock URLs)
        quotes = [
            "The best apps solve real problems, not imaginary ones.",
            "User research beats assumptions every single time.",
            "Performance matters more than fancy features."
        ]
        
        for i, quote in enumerate(quotes):
            # Generate a placeholder image URL (using data URL to avoid network requests)
            image_url = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA4MCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTA4MCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTA4MCIgaGVpZ2h0PSIxMDgwIiBmaWxsPSIjM0I4MkY2Ii8+Cjx0ZXh0IHg9IjU0MCIgeT0iNTQwIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0OCIgZm9udC1mYW1pbHk9IkFyaWFsIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UXVvdGUgR3JhcGhpYzwvdGV4dD4KPHN2Zz4="
            
            await self.db_service.create_asset(
                project_id=project_id,
                asset_type=AssetType.IMAGE,
                file_url=image_url,
                metadata={
                    "quote_number": i + 1,
                    "quote_text": quote,
                    "format": "square",
                    "dimensions": "1080x1080"
                }
            )
        
        # Demo video clips (mock URLs)
        clips = [
            {"title": "Introduction to App Development", "duration": 45},
            {"title": "User-Centered Design Principles", "duration": 38},
            {"title": "Performance Optimization Tips", "duration": 52}
        ]
        
        for i, clip in enumerate(clips):
            # Generate a placeholder video URL (using a data URL to avoid network requests)
            video_url = "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAr1tZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE1NSByMjkxNyAwYTg0ZDk4IC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxOCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTYgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAg"
            
            await self.db_service.create_asset(
                project_id=project_id,
                asset_type=AssetType.VIDEO_CLIP,
                file_url=video_url,
                metadata={
                    "clip_number": i + 1,
                    "start_time": i * 60,
                    "end_time": i * 60 + clip["duration"],
                    "duration": clip["duration"],
                    "description": clip["title"],
                    "aspect_ratio": "9:16"
                }
            )

# Demo database service that works without Supabase
class DemoDatabase:
    """In-memory database for demo purposes"""
    
    def __init__(self):
        self.projects = {}
        self.assets = {}
        self.project_counter = 1
        self.asset_counter = 1
    
    async def create_project(self, user_id: str, video_url: str) -> Dict[str, Any]:
        project_id = f"demo_project_{self.project_counter}"
        self.project_counter += 1
        
        project = {
            "id": project_id,
            "user_id": user_id,
            "original_video_url": video_url,
            "status": "pending",
            "title": None,
            "description": None,
            "duration": None,
            "thumbnail_url": None,
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z"
        }
        
        self.projects[project_id] = project
        return project
    
    async def get_project(self, project_id: str, user_id: str) -> Dict[str, Any]:
        return self.projects.get(project_id)
    
    async def get_user_projects(self, user_id: str) -> List[Dict[str, Any]]:
        return [p for p in self.projects.values() if p["user_id"] == user_id]
    
    async def update_project_status(self, project_id: str, status: str, **kwargs) -> bool:
        if project_id in self.projects:
            self.projects[project_id]["status"] = status
            for key, value in kwargs.items():
                if value is not None:
                    self.projects[project_id][key] = value
            return True
        return False
    
    async def create_asset(self, project_id: str, asset_type: str, **kwargs) -> Dict[str, Any]:
        asset_id = f"demo_asset_{self.asset_counter}"
        self.asset_counter += 1
        
        asset = {
            "id": asset_id,
            "project_id": project_id,
            "asset_type": asset_type,
            "content": kwargs.get("content"),
            "file_url": kwargs.get("file_url"),
            "metadata": kwargs.get("metadata"),
            "created_at": "2024-01-01T00:00:00Z"
        }
        
        self.assets[asset_id] = asset
        return asset
    
    async def get_project_assets(self, project_id: str) -> List[Dict[str, Any]]:
        return [a for a in self.assets.values() if a["project_id"] == project_id]

# Global demo instances
demo_db = DemoDatabase()
demo_pipeline = DemoAIPipeline()
demo_pipeline.db_service = demo_db