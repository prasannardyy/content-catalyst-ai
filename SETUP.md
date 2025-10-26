# Content Catalyst AI - Setup Guide

This guide will walk you through setting up the complete Content Catalyst AI application.

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Git

## Quick Start

1. **Clone and setup the project:**
   ```bash
   git clone <your-repo-url>
   cd content-catalyst-ai
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

2. **Configure environment variables** (see sections below)

3. **Start development servers:**
   ```bash
   npm run dev
   ```

## Detailed Setup

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Go to SQL Editor and run the schema from `backend/database/schema.sql`
4. Enable Google OAuth in Authentication > Providers (optional)

Update `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Update `backend/.env`:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

### 2. Google Cloud Setup

1. Create a Google Cloud Project
2. Enable the Video Intelligence API
3. Create a service account and download the JSON key
4. Create a Cloud Storage bucket for video processing

Update `backend/.env`:
```env
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
GOOGLE_CLOUD_STORAGE_BUCKET=your_storage_bucket_name
```

### 3. Azure AI Setup

1. Create an Azure AI Language resource
2. Get the endpoint and key from the Azure portal

Update `backend/.env`:
```env
AZURE_AI_ENDPOINT=your_azure_ai_endpoint
AZURE_AI_KEY=your_azure_ai_key
```

### 4. Bannerbear Setup

1. Sign up at [bannerbear.com](https://bannerbear.com)
2. Create a template for quote graphics
3. Get your API key and template ID

Update `backend/.env`:
```env
BANNERBEAR_API_KEY=your_bannerbear_api_key
BANNERBEAR_TEMPLATE_ID=your_bannerbear_template_id
```

### 5. Redis Setup (for background tasks)

Install and start Redis:

**macOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu:**
```bash
sudo apt install redis-server
sudo systemctl start redis-server
```

Update `backend/.env`:
```env
REDIS_URL=redis://localhost:6379/0
```

### 6. JWT Secret

Generate a secure JWT secret:

```bash
openssl rand -hex 32
```

Update `backend/.env`:
```env
JWT_SECRET_KEY=your_generated_jwt_secret
```

## Running the Application

### Development Mode

Start both frontend and backend:
```bash
npm run dev
```

Or start them separately:

**Frontend:**
```bash
cd frontend
npm run dev
```

**Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Production Deployment

**Frontend (Vercel):**
1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

**Backend (Google Cloud Run):**
1. Build Docker image:
   ```bash
   cd backend
   docker build -t content-catalyst-api .
   ```

2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy content-catalyst-api \
     --image gcr.io/YOUR_PROJECT/content-catalyst-api \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

## Testing the Setup

1. **Frontend:** Visit http://localhost:3000
2. **Backend:** Visit http://localhost:8000/docs for API documentation
3. **Create account:** Sign up and verify email
4. **Test project:** Create a project with a YouTube URL

## Troubleshooting

### Common Issues

**"Module not found" errors:**
```bash
cd frontend && npm install
cd backend && pip install -r requirements.txt
```

**Database connection issues:**
- Verify Supabase URL and keys
- Check if RLS policies are properly set

**Video processing fails:**
- Verify Google Cloud credentials
- Check if Video Intelligence API is enabled
- Ensure storage bucket exists and is accessible

**Background tasks not working:**
- Verify Redis is running
- Check Celery worker status

### Getting Help

1. Check the logs in both frontend and backend
2. Verify all environment variables are set correctly
3. Test API endpoints individually using the FastAPI docs at `/docs`

## Next Steps

Once setup is complete:

1. Customize the Bannerbear templates for your brand
2. Adjust AI prompts in the content generation service
3. Add monitoring and analytics
4. Set up automated backups
5. Configure domain and SSL certificates for production

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique passwords for all services
- Enable 2FA on all cloud accounts
- Regularly rotate API keys and secrets
- Monitor usage and set up billing alerts