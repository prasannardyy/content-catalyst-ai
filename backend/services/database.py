import os
from typing import List, Optional, Dict, Any
from supabase import create_client, Client
from datetime import datetime
from models.schemas import ProjectStatus, AssetType

class DatabaseService:
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        if not all([self.supabase_url, self.supabase_key]) or self.supabase_url == "your_supabase_project_url":
            raise ValueError("Missing Supabase configuration")
        
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)

    async def create_project(self, user_id: str, video_url: str) -> Dict[str, Any]:
        """Create a new project in the database"""
        try:
            # For development/testing, create a test user if it doesn't exist
            if user_id == "550e8400-e29b-41d4-a716-446655440000":
                await self._ensure_test_user_exists(user_id)
            
            project_data = {
                "user_id": user_id,
                "original_video_url": video_url,
                "status": ProjectStatus.PENDING.value,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            
            response = self.supabase.table("projects").insert(project_data).execute()
            
            if response.data:
                return response.data[0]
            else:
                raise Exception("Failed to create project")
                
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    async def _ensure_test_user_exists(self, user_id: str):
        """Ensure test user exists in auth.users table for development"""
        try:
            # Check if user exists
            response = self.supabase.auth.admin.get_user_by_id(user_id)
            if not response.user:
                # Create a test user entry
                self.supabase.auth.admin.create_user({
                    "user_id": user_id,
                    "email": "test@example.com",
                    "password": "testpassword123",
                    "email_confirm": True
                })
        except Exception as e:
            # If we can't create the user, we'll handle it in the constraint
            print(f"Could not create test user: {e}")
            pass

    async def get_project(self, project_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific project by ID"""
        try:
            response = self.supabase.table("projects").select("*").eq("id", project_id).eq("user_id", user_id).execute()
            
            return response.data[0] if response.data else None
            
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")

    async def get_user_projects(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all projects for a user"""
        try:
            response = self.supabase.table("projects").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            
            return response.data or []
            
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")

    async def update_project_status(self, project_id: str, status: ProjectStatus, **kwargs) -> bool:
        """Update project status and optional fields"""
        try:
            update_data = {
                "status": status.value,
                "updated_at": datetime.utcnow().isoformat()
            }
            
            # Add any additional fields
            for key, value in kwargs.items():
                if value is not None:
                    update_data[key] = value
            
            response = self.supabase.table("projects").update(update_data).eq("id", project_id).execute()
            
            return len(response.data) > 0
            
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")

    async def create_asset(
        self, 
        project_id: str, 
        asset_type: AssetType, 
        content: Optional[str] = None,
        file_url: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Create a new asset for a project"""
        try:
            asset_data = {
                "project_id": project_id,
                "asset_type": asset_type.value,
                "content": content,
                "file_url": file_url,
                "metadata": metadata,
                "created_at": datetime.utcnow().isoformat()
            }
            
            response = self.supabase.table("assets").insert(asset_data).execute()
            
            if response.data:
                return response.data[0]
            else:
                raise Exception("Failed to create asset")
                
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")

    async def get_project_assets(self, project_id: str) -> List[Dict[str, Any]]:
        """Get all assets for a project"""
        try:
            response = self.supabase.table("assets").select("*").eq("project_id", project_id).order("created_at", desc=False).execute()
            
            return response.data or []
            
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")

    async def get_assets_by_type(self, project_id: str, asset_type: AssetType) -> List[Dict[str, Any]]:
        """Get assets of a specific type for a project"""
        try:
            response = self.supabase.table("assets").select("*").eq("project_id", project_id).eq("asset_type", asset_type.value).execute()
            
            return response.data or []
            
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")

    async def update_asset(self, asset_id: str, **kwargs) -> bool:
        """Update an asset"""
        try:
            update_data = {}
            for key, value in kwargs.items():
                if value is not None:
                    update_data[key] = value
            
            if not update_data:
                return True
            
            response = self.supabase.table("assets").update(update_data).eq("id", asset_id).execute()
            
            return len(response.data) > 0
            
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")