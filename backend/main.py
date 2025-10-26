"""
Content Catalyst AI - Backend API
FastAPI application for processing YouTube videos and generating content
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, auth, firestore
import os
from typing import List, Optional
import asyncio
from datetime import datetime
import uuid

from models.schemas import ProjectCreate, ProjectResponse, AssetResponse
from services.video_processor import VideoProcessor
from services.ai_pipeline import AIPipeline
from services.auth import verify_firebase_token

# Initialize FastAPI app
app = FastAPI(
    title="Content Catalyst AI API",
    description="AI-powered content repurposing platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "https://your-frontend-domain.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    # In production, use service account key file
    # For development, you can use the Firebase emulator
    try:
        cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH"))
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Firebase initialization failed: {e}")
        # Fallback initialization for development
        firebase_admin.initialize_app()

# Initialize Firestore
db = firestore.client()

# Security
security = HTTPBearer()

# Initialize services
video_processor = VideoProcessor()
ai_pipeline = AIPipeline()

@app.get("/")
async def root():
    return {"message": "Content Catalyst AI API", "status": "running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "firebase": "connected",
            "video_processor": "ready",
            "ai_pipeline": "ready"
        }
    }

@app.post("/projects", response_model=ProjectResponse)
async def create_project(
    project_data: ProjectCreate,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(verify_firebase_token)
):
    """
    Create a new project and start AI processing pipeline
    """
    try:
        # Create project document
        project_id = str(uuid.uuid4())
        project_doc = {
            "id": project_id,
            "user_id": current_user["uid"],
            "original_video_url": project_data.youtube_url,
            "status": "pending",
            "title": None,
            "description": None,
            "duration": None,
            "thumbnail_url": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Save to Firestore
        db.collection("projects").document(project_id).set(project_doc)
        
        # Start background processing
        background_tasks.add_task(
            process_video_pipeline,
            project_id,
            project_data.youtube_url,
            current_user["uid"]
        )
        
        return ProjectResponse(**project_doc)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")

@app.get("/projects", response_model=List[ProjectResponse])
async def get_user_projects(current_user: dict = Depends(verify_firebase_token)):
    """
    Get all projects for the authenticated user
    """
    try:
        projects_ref = db.collection("projects").where("user_id", "==", current_user["uid"])
        projects = projects_ref.order_by("created_at", direction=firestore.Query.DESCENDING).stream()
        
        project_list = []
        for project in projects:
            project_data = project.to_dict()
            project_data["id"] = project.id
            project_list.append(ProjectResponse(**project_data))
        
        return project_list
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch projects: {str(e)}")

@app.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    current_user: dict = Depends(verify_firebase_token)
):
    """
    Get a specific project with all its assets
    """
    try:
        # Get project document
        project_ref = db.collection("projects").document(project_id)
        project_doc = project_ref.get()
        
        if not project_doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project_data = project_doc.to_dict()
        
        # Verify ownership
        if project_data["user_id"] != current_user["uid"]:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Get associated assets
        assets_ref = db.collection("assets").where("project_id", "==", project_id)
        assets = assets_ref.stream()
        
        asset_list = []
        for asset in assets:
            asset_data = asset.to_dict()
            asset_data["id"] = asset.id
            asset_list.append(AssetResponse(**asset_data))
        
        project_data["id"] = project_id
        project_data["assets"] = asset_list
        
        return ProjectResponse(**project_data)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch project: {str(e)}")

async def process_video_pipeline(project_id: str, youtube_url: str, user_id: str):
    """
    Background task to process video through AI pipeline
    """
    try:
        # Update project status
        await update_project_status(project_id, "processing")
        
        # Step 1: Download and analyze video
        video_data = await video_processor.process_video(youtube_url)
        
        # Update project with video metadata
        await update_project_metadata(project_id, video_data)
        
        # Step 2: Run AI pipeline
        generated_content = await ai_pipeline.generate_content(video_data)
        
        # Step 3: Save all generated assets
        await save_generated_assets(project_id, generated_content)
        
        # Update project status to completed
        await update_project_status(project_id, "completed")
        
    except Exception as e:
        print(f"Error processing video pipeline: {e}")
        await update_project_status(project_id, "failed")

async def update_project_status(project_id: str, status: str):
    """Update project status in Firestore"""
    db.collection("projects").document(project_id).update({
        "status": status,
        "updated_at": datetime.utcnow()
    })

async def update_project_metadata(project_id: str, video_data: dict):
    """Update project with video metadata"""
    db.collection("projects").document(project_id).update({
        "title": video_data.get("title"),
        "description": video_data.get("description"),
        "duration": video_data.get("duration"),
        "thumbnail_url": video_data.get("thumbnail_url"),
        "updated_at": datetime.utcnow()
    })

async def save_generated_assets(project_id: str, content: dict):
    """Save generated assets to Firestore"""
    assets_collection = db.collection("assets")
    
    # Save blog post
    if content.get("blog_post"):
        assets_collection.add({
            "project_id": project_id,
            "asset_type": "blog",
            "content": content["blog_post"],
            "metadata": content.get("blog_metadata", {}),
            "created_at": datetime.utcnow()
        })
    
    # Save social media posts
    for i, linkedin_post in enumerate(content.get("linkedin_posts", [])):
        assets_collection.add({
            "project_id": project_id,
            "asset_type": "linkedin_post",
            "content": linkedin_post,
            "metadata": {"post_number": i + 1},
            "created_at": datetime.utcnow()
        })
    
    for i, tweet in enumerate(content.get("tweets", [])):
        assets_collection.add({
            "project_id": project_id,
            "asset_type": "tweet",
            "content": tweet,
            "metadata": {"post_number": i + 1},
            "created_at": datetime.utcnow()
        })
    
    # Save video clips
    for i, clip in enumerate(content.get("video_clips", [])):
        assets_collection.add({
            "project_id": project_id,
            "asset_type": "video_clip",
            "file_url": clip["url"],
            "metadata": {
                "clip_number": i + 1,
                "start_time": clip["start_time"],
                "end_time": clip["end_time"],
                "duration": clip["duration"]
            },
            "created_at": datetime.utcnow()
        })
    
    # Save quote images
    for i, image in enumerate(content.get("quote_images", [])):
        assets_collection.add({
            "project_id": project_id,
            "asset_type": "image",
            "file_url": image["url"],
            "metadata": {
                "image_number": i + 1,
                "quote_text": image["quote"],
                "template_id": image.get("template_id")
            },
            "created_at": datetime.utcnow()
        })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)