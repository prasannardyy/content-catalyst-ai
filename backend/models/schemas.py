from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Literal
from datetime import datetime
from enum import Enum

class AssetType(str, Enum):
    BLOG = "blog"
    LINKEDIN_POST = "linkedin_post"
    TWEET = "tweet"
    VIDEO_CLIP = "video_clip"
    IMAGE = "image"

class ProjectStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class ProjectCreate(BaseModel):
    youtube_url: HttpUrl

class AssetResponse(BaseModel):
    id: str
    project_id: str
    asset_type: AssetType
    content: Optional[str] = None
    file_url: Optional[str] = None
    metadata: Optional[dict] = None
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
    assets: Optional[List[AssetResponse]] = []
    created_at: datetime
    updated_at: datetime

class VideoAnalysisResult(BaseModel):
    transcript: str
    key_moments: List[dict]
    key_quotes: List[str]
    labels: List[str]
    shot_changes: List[float]

class ContentGenerationRequest(BaseModel):
    transcript: str
    key_moments: List[dict]
    video_title: str
    video_description: str