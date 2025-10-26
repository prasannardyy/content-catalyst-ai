from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, HttpUrl
from typing import List, Optional
import os
from dotenv import load_dotenv

from services.auth import verify_token
from services.database import DatabaseService
from services.ai_pipeline import AIPipeline
from models.schemas import ProjectCreate, ProjectResponse, AssetResponse

# Import demo mode and hybrid pipeline
from demo_mode import demo_db, demo_pipeline
from services.hybrid_ai_pipeline import HybridAIPipeline

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Content Catalyst AI API",
    description="AI-powered content repurposing platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize services - use demo mode if Supabase not configured
try:
    db_service = DatabaseService()
    # Try hybrid pipeline first (works with just Supabase + YouTube)
    ai_pipeline = HybridAIPipeline()
    DEMO_MODE = False
    print("✅ Real YouTube processing enabled!")
    print("   Configure Google Cloud, Azure AI, and Bannerbear for full AI features")
except Exception as e:
    print("⚠️  Supabase not configured, running in DEMO MODE")
    print("   Configure Supabase credentials to enable real YouTube processing")
    db_service = demo_db
    ai_pipeline = demo_pipeline
    DEMO_MODE = True

@app.get("/")
async def root():
    return {"message": "Content Catalyst AI API is running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "version": "1.0.0",
        "demo_mode": DEMO_MODE,
        "message": "Running in demo mode - configure APIs for full functionality" if DEMO_MODE else "All systems operational"
    }

@app.post("/test-project")
async def test_create_project(project_data: ProjectCreate):
    """Test endpoint for creating projects without auth"""
    try:
        # Use a test UUID
        user_id = "550e8400-e29b-41d4-a716-446655440000"
        
        # Create project in database
        project = await db_service.create_project(
            user_id=user_id,
            video_url=str(project_data.youtube_url)
        )
        
        return project
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/projects", response_model=ProjectResponse)
async def create_project(
    project_data: ProjectCreate,
    background_tasks: BackgroundTasks,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Create a new project and start AI processing pipeline"""
    try:
        # Verify user token
        user_id = await verify_token(credentials.credentials)
        
        # Create project in database
        project = await db_service.create_project(
            user_id=user_id,
            video_url=str(project_data.youtube_url)
        )
        
        # Start AI processing pipeline in background
        background_tasks.add_task(
            ai_pipeline.process_video,
            project_id=project["id"],
            video_url=str(project_data.youtube_url)
        )
        
        return ProjectResponse(**project)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get project details and all generated assets"""
    try:
        # Verify user token
        user_id = await verify_token(credentials.credentials)
        
        # Get project from database
        project = await db_service.get_project(project_id, user_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Get all assets for this project
        assets = await db_service.get_project_assets(project_id)
        project["assets"] = assets
        
        return ProjectResponse(**project)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/projects", response_model=List[ProjectResponse])
async def get_user_projects(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get all projects for the authenticated user"""
    try:
        # Verify user token
        user_id = await verify_token(credentials.credentials)
        
        # Get user's projects
        projects = await db_service.get_user_projects(user_id)
        
        return [ProjectResponse(**project) for project in projects]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)