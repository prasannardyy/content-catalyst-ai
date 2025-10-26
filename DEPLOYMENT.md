# 🚀 Deployment Guide

## Frontend Deployment (Vercel)

### Option 1: Deploy Frontend Directory Only (Recommended)

1. **In Vercel Dashboard:**
   - Import your GitHub repository
   - **Root Directory**: Set to `frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

2. **Environment Variables in Vercel:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_API_URL=your_backend_url
   NEXT_PUBLIC_DEMO_MODE=false
   ```

### Option 2: Deploy from Root (Alternative)

If you want to deploy from the root directory:

1. **Create `vercel.json` in root:**
   ```json
   {
     "buildCommand": "cd frontend && npm install && npm run build",
     "outputDirectory": "frontend/.next",
     "installCommand": "cd frontend && npm install"
   }
   ```

## Backend Deployment

### Railway Deployment

1. **Connect GitHub Repository**
2. **Set Root Directory**: `backend`
3. **Environment Variables:**
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_service_key
   GEMINI_API_KEY=your_gemini_key
   ```
4. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Render Deployment

1. **Create Web Service**
2. **Root Directory**: `backend`
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Quick Fix for Current Vercel Error

**In your Vercel project settings:**

1. Go to **Settings** → **General**
2. **Root Directory**: Change to `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`
5. **Install Command**: `npm install`
6. **Redeploy**

This will fix the current deployment error by telling Vercel to only build the frontend part of your monorepo.

## Environment Variables Setup

### Frontend (.env.local for local, Vercel settings for production)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_DEMO_MODE=false
```

### Backend (Railway/Render environment variables)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

## Testing Deployment

1. **Frontend**: Should load at your Vercel URL
2. **Backend**: Test at `your-backend-url/health`
3. **Full Flow**: Create account → Create project → Check results

## Troubleshooting

### Common Issues:

1. **Build fails**: Set root directory to `frontend` in Vercel
2. **API calls fail**: Check NEXT_PUBLIC_API_URL points to your backend
3. **Auth issues**: Verify Supabase URLs and keys
4. **CORS errors**: Add your frontend URL to backend CORS settings

### Quick Fixes:

- **Vercel Build Error**: Change root directory to `frontend`
- **API Connection**: Update NEXT_PUBLIC_API_URL to your deployed backend
- **Database Issues**: Run the SQL schema in your Supabase project