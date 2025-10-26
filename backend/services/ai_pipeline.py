import os
import asyncio
from typing import Dict, List, Any
from services.database import DatabaseService
from services.video_processor import VideoProcessor
from services.content_generator import ContentGenerator
from services.visual_generator import VisualGenerator
from models.schemas import ProjectStatus, AssetType
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIPipeline:
    def __init__(self):
        self.db_service = DatabaseService()
        self.video_processor = VideoProcessor()
        self.content_generator = ContentGenerator()
        self.visual_generator = VisualGenerator()

    async def process_video(self, project_id: str, video_url: str):
        """Main AI processing pipeline"""
        try:
            logger.info(f"Starting AI pipeline for project {project_id}")
            
            # Update project status to processing
            await self.db_service.update_project_status(
                project_id, 
                ProjectStatus.PROCESSING
            )
            
            # Step 1: Download and analyze video
            logger.info("Step 1: Video analysis")
            video_analysis = await self.video_processor.analyze_video(video_url)
            
            # Update project with video metadata
            await self.db_service.update_project_status(
                project_id,
                ProjectStatus.PROCESSING,
                title=video_analysis.get("title"),
                description=video_analysis.get("description"),
                duration=video_analysis.get("duration"),
                thumbnail_url=video_analysis.get("thumbnail_url")
            )
            
            # Step 2: Generate text content
            logger.info("Step 2: Content generation")
            await self._generate_text_content(project_id, video_analysis)
            
            # Step 3: Generate visual content
            logger.info("Step 3: Visual content generation")
            await self._generate_visual_content(project_id, video_analysis)
            
            # Step 4: Generate video clips
            logger.info("Step 4: Video clip generation")
            await self._generate_video_clips(project_id, video_analysis)
            
            # Update project status to completed
            await self.db_service.update_project_status(
                project_id, 
                ProjectStatus.COMPLETED
            )
            
            logger.info(f"AI pipeline completed for project {project_id}")
            
        except Exception as e:
            logger.error(f"AI pipeline failed for project {project_id}: {str(e)}")
            
            # Update project status to failed
            await self.db_service.update_project_status(
                project_id, 
                ProjectStatus.FAILED
            )
            
            raise e

    async def _generate_text_content(self, project_id: str, video_analysis: Dict[str, Any]):
        """Generate blog post and social media content"""
        try:
            # Generate blog post
            blog_content = await self.content_generator.generate_blog_post(
                transcript=video_analysis["transcript"],
                title=video_analysis.get("title", ""),
                key_moments=video_analysis["key_moments"]
            )
            
            await self.db_service.create_asset(
                project_id=project_id,
                asset_type=AssetType.BLOG,
                content=blog_content,
                metadata={"word_count": len(blog_content.split())}
            )
            
            # Generate LinkedIn posts
            linkedin_posts = await self.content_generator.generate_linkedin_posts(
                transcript=video_analysis["transcript"],
                key_moments=video_analysis["key_moments"]
            )
            
            for i, post in enumerate(linkedin_posts):
                await self.db_service.create_asset(
                    project_id=project_id,
                    asset_type=AssetType.LINKEDIN_POST,
                    content=post,
                    metadata={"post_number": i + 1, "character_count": len(post)}
                )
            
            # Generate tweets
            tweets = await self.content_generator.generate_tweets(
                transcript=video_analysis["transcript"],
                key_quotes=video_analysis["key_quotes"]
            )
            
            for i, tweet in enumerate(tweets):
                await self.db_service.create_asset(
                    project_id=project_id,
                    asset_type=AssetType.TWEET,
                    content=tweet,
                    metadata={"tweet_number": i + 1, "character_count": len(tweet)}
                )
                
        except Exception as e:
            logger.error(f"Text content generation failed: {str(e)}")
            raise e

    async def _generate_visual_content(self, project_id: str, video_analysis: Dict[str, Any]):
        """Generate quote graphics"""
        try:
            key_quotes = video_analysis["key_quotes"]
            
            for i, quote in enumerate(key_quotes):
                image_url = await self.visual_generator.create_quote_graphic(
                    quote=quote,
                    author=video_analysis.get("title", "Content Creator")
                )
                
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
                
        except Exception as e:
            logger.error(f"Visual content generation failed: {str(e)}")
            raise e

    async def _generate_video_clips(self, project_id: str, video_analysis: Dict[str, Any]):
        """Generate short video clips"""
        try:
            key_moments = video_analysis["key_moments"]
            video_file_path = video_analysis["video_file_path"]
            
            for i, moment in enumerate(key_moments):
                clip_url = await self.video_processor.create_video_clip(
                    video_file_path=video_file_path,
                    start_time=moment["start_time"],
                    end_time=moment["end_time"],
                    clip_number=i + 1
                )
                
                await self.db_service.create_asset(
                    project_id=project_id,
                    asset_type=AssetType.VIDEO_CLIP,
                    file_url=clip_url,
                    metadata={
                        "clip_number": i + 1,
                        "start_time": moment["start_time"],
                        "end_time": moment["end_time"],
                        "duration": moment["end_time"] - moment["start_time"],
                        "description": moment.get("description", ""),
                        "aspect_ratio": "9:16"
                    }
                )
                
        except Exception as e:
            logger.error(f"Video clip generation failed: {str(e)}")
            raise e