"""
Pydantic models for API request/response schemas
"""

from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class ProjectStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class AssetType(str, Enum):
    BLOG = "blog"
    LINKEDIN_POST = "linkedin_post"
    TWEET = "tweet"
    VIDEO_CLIP = "video_clip"
    IMAGE = "image"

class ProjectCreate(BaseModel):
    youtube_url: HttpUrl

class AssetResponse(BaseModel):
    id: str
    project_id: str
    asset_type: AssetType
    content: Optional[str] = None
    file_url: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime

class ProjectResponse(BaseModel):
    id: str
    user_id: str
    original_video_url: str
    status: ProjectStatus
    title: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[int] = None
    thumbnail_url: Optional[str] = None
    assets: Optional[List[AssetResponse]] = None
    created_at: datetime
    updated_at: datetime

class VideoAnalysis(BaseModel):
    video_id: str
    title: str
    description: str
    duration: int
    thumbnail_url: str
    transcript: str
    key_moments: List[Dict[str, Any]]
    key_quotes: List[str]
    labels: List[str]
    category: str

class ContentGeneration(BaseModel):
    blog_post: str
    blog_metadata: Dict[str, Any]
    linkedin_posts: List[str]
    tweets: List[str]
    video_clips: List[Dict[str, Any]]
    quote_images: List[Dict[str, Any]]