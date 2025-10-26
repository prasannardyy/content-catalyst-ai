# 🚀 Content Catalyst AI

> Transform your YouTube videos into complete content campaigns with the power of AI

[![Next.js](https://img.shields.io/badge/Next.js-14.0.3-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6)](https://typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)

## ✨ Features

- 🎬 **YouTube Video Processing** - Extract metadata, thumbnails, and content analysis
- 📝 **AI Blog Generation** - Create SEO-optimized blog posts from video content
- 📱 **Social Media Content** - Generate LinkedIn posts, tweets with relevant hashtags
- 🎨 **AI Quote Graphics** - Beautiful quote graphics powered by Gemini AI
- ⏱️ **Video Timestamps** - Identify key moments with clickable timestamps
- 👤 **User Management** - Secure authentication and project management
- 🎯 **Real-time Processing** - Background AI processing with status updates

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Supabase Auth** - Authentication system

### Backend
- **FastAPI** - Modern Python web framework
- **Supabase** - PostgreSQL database with real-time features
- **yt-dlp** - YouTube video processing
- **Gemini AI** - Advanced image generation

### AI Services
- **Google Gemini** - Image generation and design suggestions
- **YouTube Data Extraction** - Video metadata and content analysis
- **Custom AI Pipeline** - Intelligent content generation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Supabase account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/content-catalyst-ai.git
cd content-catalyst-ai
```

### 2. Install Dependencies
```bash
# Install all dependencies
npm run install:all

# Or install separately
npm install                    # Root dependencies
cd frontend && npm install     # Frontend dependencies
cd ../backend && pip install -r requirements.txt  # Backend dependencies
```

### 3. Environment Setup

**Frontend (.env.local):**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DEMO_MODE=false
```

**Backend (.env):**
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Database Setup
1. Create a Supabase project
2. Run the SQL schema from `backend/database/schema.sql`
3. Update your environment variables

### 5. Run the Application
```bash
npm run dev
```

Visit http://localhost:3000 to see your application!

## 📁 Project Structure

```
content-catalyst-ai/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── lib/                # Utilities and configurations
│   └── public/             # Static assets
├── backend/                 # FastAPI application
│   ├── services/           # Business logic services
│   ├── models/             # Data models and schemas
│   ├── database/           # Database schemas and migrations
│   └── main.py            # FastAPI application entry
├── scripts/                # Utility scripts
└── docs/                  # Documentation
```

## 🎯 How It Works

1. **Submit YouTube URL** - User provides a YouTube video link
2. **AI Analysis** - System extracts video metadata, transcript, and key moments
3. **Content Generation** - AI creates blog posts, social media content, and graphics
4. **Review & Download** - User can edit, copy, and download all generated content

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Copy your project URL and API keys
3. Run the database schema from `backend/database/schema.sql`

### Gemini AI Setup (Optional)
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to your `.env` file
3. Enjoy enhanced AI-generated graphics!

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Connect your GitHub repo to Vercel
# Set environment variables in Vercel dashboard
# Deploy automatically on push
```

### Backend (Railway/Render)
```bash
# Connect your GitHub repo
# Set environment variables
# Deploy with automatic builds
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [FastAPI](https://fastapi.tiangolo.com/) for the fast Python web framework
- [Supabase](https://supabase.com/) for the backend-as-a-service platform
- [Google Gemini](https://ai.google.dev/) for AI-powered image generation
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the setup guides in `SETUP.md` and `GEMINI_SETUP.md`

---

**Built with ❤️ using modern web technologies**