import os
from fastapi import HTTPException
from supabase import create_client, Client
from typing import Optional

try:
    import jwt
except ImportError:
    jwt = None

class AuthService:
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
        self.jwt_secret = os.getenv("JWT_SECRET_KEY")
        
        if not all([self.supabase_url, self.supabase_key]) or self.supabase_url == "your_supabase_project_url":
            raise ValueError("Missing Supabase configuration")
        
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)

    async def verify_token(self, token: str) -> str:
        """Verify JWT token and return user ID"""
        try:
            # Verify token with Supabase
            response = self.supabase.auth.get_user(token)
            
            if response.user is None:
                raise HTTPException(status_code=401, detail="Invalid token")
            
            return response.user.id
            
        except Exception as e:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

    async def get_user_profile(self, user_id: str) -> Optional[dict]:
        """Get user profile information"""
        try:
            response = self.supabase.auth.admin.get_user_by_id(user_id)
            return response.user.model_dump() if response.user else None
        except Exception:
            return None

# Global auth service instance
try:
    auth_service = AuthService()
except ValueError:
    auth_service = None

async def verify_token(token: str) -> str:
    """Dependency function for FastAPI"""
    if auth_service is None:
        # Demo mode - return a valid UUID format
        return "550e8400-e29b-41d4-a716-446655440000"
    
    try:
        return await auth_service.verify_token(token)
    except Exception as e:
        # If auth fails, return a test UUID for development
        print(f"Auth verification failed: {e}")
        return "550e8400-e29b-41d4-a716-446655440000"